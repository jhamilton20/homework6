$(document).ready(function () {

    // FUNCTIONS
    function show(data) {
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
        `
    }
    function showUV(data) {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        console.log(uvDisplay);
        return `
        <p><strong>UV Index:</strong>: ${data.value}</p>
        `
    }

    function displayCities(cityList) {
        $('.city-list').empty();
        let list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        
        if (list) {
            for (let i = 0; i < cityList.length; i++) {
                let container = $("<div class=card></div>").text(cityList[i]);
                $('.city-list').prepend(container);
            }
        }
    }





    function showForecast(data) {
        let forecast = data.list; // [{},{},{}]
   
        let currentForecast = [];
        for (let i = 0; i < forecast.length; i++) {

            let currentObject = forecast[i];
            

            let dt_time = currentObject.dt_txt.split(' ')[1] 
            
            if (dt_time === "12:00:00") {
                // currentObject.main ... time, icon, temp, humidity
                let main = currentObject.main;
                
                let temp = main.temp;
                let humidity = main.humidity;
                let date = moment(currentObject.dt_txt).format('l'); 
                let icon = currentObject.weather[0].icon;
                let iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} °F</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }

        }
        $("#5-day-forecast").html(currentForecast.join(''));

    }

    // ///////////////////////////

    let stored = localStorage.getItem("cityList")
    if (stored) {
        cityList = JSON.parse(stored)
    } else {
        cityList = []
    }
    //var cityList = [];
    $('#searchCity').click(function (event) {
        event.preventDefault();
        let city = $('#city').val();
        // push city to cityList array
        cityList.push(city);
        // set cityList in localStorage 
        localStorage.setItem("cityList", JSON.stringify(cityList));
        // check length of array. if > 5 then don't add.
        displayCities(cityList);
        if (city != '') {

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=03aba1457f0e858a8cebe747515ca10d",
                method: "GET",
                success: function (data) {
                    let display = show(data);
                    $("#show").html(display);
                }
            });

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=03aba1457f0e858a8cebe747515ca10d",
                method: "GET",
                success: function (data) {
                    let forecastDisplay = showForecast(data)
                }
            });
           
            // what is wrong??!!

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/uvi?appid=' + "&APPID=03aba1457f0e858a8cebe747515ca10d" + "&lat=" + lat + "&lon=" + lon,
                method: "GET",
                success: function (data) {
                    let uvDisplay = showUV(data);
                }
            });

        } 
    });

    // figure out clear local storage
    // figure out onclick previous search return city
   

   

});