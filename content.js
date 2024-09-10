import { createEvents } from 'ics';

function scrape_class_schedule_data(){
    function find_index(target_element){
        let cells=Array.from(target_element.parentNode.children);
        let col_idx=cells.indexOf(target_element);
        //if cell col1 is not dblabel it is not time hence add 1
        if(cells[0].getAttribute('class')!='dblabel'){
            col_idx++
        }
        console.log(cells[1].textContent +" "+ cells[2].textContent + " " + cells[3].textContent)
        if(cells[1].textContent===cells[2].textContent & cells[2].textContent===cells[3].textContent & cells[1].getAttribute('class')=="dbhighlight"
        & cells.length<7 ){
            //means we are the 6500 thing
            console.log("cells is")
            console.log(cells);
            if(col_idx==2){
                return 3
            }
            else if(col_idx==3){
                return 5
            }
            else{
                return col_idx
            }

        }
        return col_idx
    
    }
    console.log("scrape_class_schedule_data run")
    let data_array=[];
    let class_elements = document.getElementsByClassName('dbhighlight');
    for( let i=0;i<class_elements.length;i++){
        let data=class_elements[i].innerText;
        // console.log(class_elements[i])
        // console.log(find_index(class_elements[i]))
        data+="\n" + String(find_index(class_elements[i]))
        //console.log(data);
        data_array.push(data);
    }
    // console.log(data_array)
    return data_array;
}
function getFirstMondayDate(year, month) {
    // Create a Date object for the 1st day of the month
    let date = new Date(year, month - 1, 1); // month - 1 because months are 0-based

    // Get the day of the week for the 1st day of the month
    let dayOfWeek = date.getDay();

    // Calculate the difference in days to the first Monday
    let daysToAdd = (8 - dayOfWeek) % 7; // 8 - dayOfWeek gives the days to next Monday

    // If the 1st is already Monday, daysToAdd will be 0, so we need to adjust
    if (daysToAdd === 0) {
        daysToAdd = 7;
    }

    // Set the date to the first Monday
    date.setDate(date.getDate() + daysToAdd);

    // Return the numerical date of the first Monday
    return date.getDate();
}
function parseEventDetails(timeString) {
    var times = timeString.split('-');
    var startTime = times[0];
    var endTime = times[1];

    // Helper function to convert time to 24-hour format and get the hours and minutes
    function parseTime(time) {
        var timeComponents = time.trim().split(' ');
        var timePart = timeComponents[0];
        var period = timeComponents[1];
        var hourMinute = timePart.split(':').map(Number);
        var hours = hourMinute[0];
        var minutes = hourMinute[1];
        var hour24 = hours;

        // Adjust for AM/PM
        if (period === 'pm' && hours !== 12) {
            hour24 += 12;
        } else if (period === 'am' && hours === 12) {
            hour24 = 0;
        }

        return { hour24, minutes };
    }

    var start = parseTime(startTime);
    var end = parseTime(endTime);

    // Calculate the duration in minutes
    var durationMinutes = (end.hour24 * 60 + end.minutes) - (start.hour24 * 60 + start.minutes);

    return {
        startHour: start.hour24,
        startMinutes: start.minutes,
        duration: durationMinutes
    };
}




function generateICS(refined_data_array) {
    let date_span=refined_data_array[0]
    //console.log(date_span);
    let start_date_array=Array(3);
    let year_idx=date_span.indexOf("20")
    let year=date_span.slice(year_idx,12)
    let start_month=date_span.slice(0,3)
    let end_month=date_span.slice(15,18)
    let months = ['',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
    //console.log("start_month " + start_month)
    for(let i=0;i<months.length;i++){
        if(String(months[i]).slice(0,3)==start_month){
            start_month=i;
        }
        if(String(months[i]).slice(0,3)==end_month){
            end_month=i;
        }
    }
    function getFirstMondayDate(year, month) {
        // Create a Date object for the 1st day of the month
        let date = new Date(year, month - 1, 1); // month - 1 because months are 0-based
    
        // Get the day of the week for the 1st day of the month
        let dayOfWeek = date.getDay();
    
        // Calculate the difference in days to the first Monday
        let daysToAdd = (8 - dayOfWeek) % 7; // 8 - dayOfWeek gives the days to next Monday
    
        // If the 1st is already Monday, daysToAdd will be 0, so we need to adjust
        if (daysToAdd === 0) {
            daysToAdd = 7;
        }
    
        // Set the date to the first Monday
        date.setDate(date.getDate() + daysToAdd);
    
        // Return the numerical date of the first Monday
        return date.getDate();
    }
    function parseEventDetails(timeString) {
        var times = timeString.split('-');
        var startTime = times[0];
        var endTime = times[1];
        
        // Helper function to convert time to 24-hour format and get the hours and minutes
        function parseTime(time) {
            var timeComponents = time.trim().split(' ');
            var timePart = timeComponents[0];
            var period = timeComponents[1];
            var hourMinute = timePart.split(':').map(Number);
            var hours = hourMinute[0];
            var minutes = hourMinute[1];
            var hour24 = hours;
    
            // Adjust for AM/PM
            if (period === 'pm' && hours !== 12) {
                hour24 += 12;
            } else if (period === 'am' && hours === 12) {
                hour24 = 0;
            }
    
            return { hour24, minutes };
        }
    
        var start = parseTime(startTime);
        var end = parseTime(endTime);
    
        // Calculate the duration in minutes
        var durationMinutes = (end.hour24 * 60 + end.minutes) - (start.hour24 * 60 + start.minutes);
    
        return {
            startHour: start.hour24,
            startMinutes: start.minutes,
            duration: durationMinutes
        };
    }
    //console.log(" generateICS func run")
    let events_array=[];
    for(let i=1;i<refined_data_array.length;i++)
    {
        var t=refined_data_array[i]
        var time_data=t[2];
        var start_data=parseEventDetails(time_data)
        //console.log(refined_data_array)
        //console.log("printing start")
        //console.log(year)
        //console.log([year, start_month,getFirstMondayDate(year,start_month) ,start_data.startHour, start_data.startMinutes])
        let day=refined_data_array[i][3]-1;
        //console.log(" day is " + String(day))
        var event = 
            {   
                title: refined_data_array[i][0],
                description: '',
                start: [parseInt(year), start_month,getFirstMondayDate(year,start_month)+day ,start_data.startHour, start_data.startMinutes],
                duration: { minutes: start_data.duration },
                location: refined_data_array[i][1],
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                recurrenceRule: 'FREQ=WEEKLY;INTERVAL=1'}
                
        events_array.push(event);
        }

    createEvents(events_array, (error, value) => {
        if (error) {
            console.log(error);
            return;
        }
    
        // Create a Blob with the ICS data
        var blob = new Blob([value], { type: 'text/calendar' });
        var url = URL.createObjectURL(blob);
    
        // Create a download link and trigger it
        var a = document.createElement('a');
        a.href = url;
        a.download = 'ClassScheduleExported.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    
        // Revoke the object URL
        URL.revokeObjectURL(url);
    });
    
    }

function process_class_schedule_data(data_array){
    let refined_data_array=[]
    let days=[]
    console.log("process_class_schedule_data run")
    for(let i=0;i<data_array.length;i++){
        let class_array=new Array(4);
        let j=0
        let class_name='';
        let class_location='';
        let class_timings='';
        let day=0;
        for(;j<data_array[i].length;j++){
            if(data_array[i][j]=="\n"){
                break
            }
            class_name+=data_array[i][j];
        }
        //skiping n in \n
        // console.log(data_array[i][j]);
        j++;
        for(;j<data_array[i].length;j++){
            if(data_array[i][j]=="\n"){
                break
            }
            class_location+=data_array[i][j];
        }
        j++
        for(;j<data_array[i].length;j++){
            if(data_array[i][j]=="\n"){
                break
            }
            class_timings+=data_array[i][j];
        }
        j++
        for(;j<data_array[i].length;j++){

            day=Number(data_array[i][j]);
        }
        class_array[0]=class_name;
        class_array[1]=class_location;
        class_array[2]=class_timings;
        class_array[3]=day;
        refined_data_array.push(class_array);
        // console.log(class_array)
        // console.log(refined_data_array)
    }
    let date_span=document.querySelector('.pagebodydiv').querySelector('b').innerText;
    console.log(date_span)
    // console.log("start_month " + start_month + "end_month " + end_month)
    refined_data_array.unshift(date_span);
    return refined_data_array;
}


//console.log("createEvents "+createEvents);
// console.log(document)
let data_array=scrape_class_schedule_data()
let refined_array=process_class_schedule_data(data_array);
// console.log("refined_array" +refined_array)
generateICS(refined_array);
// console.log(String(refined_array[1][2]));
// let event=parseEventDetails('9:00 am-9:50 am')
// console.log(event)
// let elements_array=document.getElementsByClassName("dbhighlight");
// for(let i=0;i<elements_array.length;i++){
//     find_index(elements_array[i]);
