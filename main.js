function initializeWeather(apiData, weatherObject) {
   weatherObject.conditionId = apiData.weather[0].id;
   weatherObject.mainCondition = apiData.weather[0].main;
   weatherObject.description = apiData.weather[0].description; weatherObject.temperature.main = apiData.main.temp;
   weatherObject.temperature.min = apiData.main.temp_min;
   weatherObject.temperature.max = apiData.main.temp_max;
   weatherObject.pressure.main = apiData.main.pressure;
   weatherObject.pressure.sea = apiData.main.sea_level;
   weatherObject.pressure.ground = apiData.main.grnd_level;
   weatherObject.humidity = apiData.main.humidity;
   weatherObject.wind.speed = apiData.wind.speed;
   weatherObject.wind.degree = apiData.wind.deg;
   weatherObject.cloudCoverage = apiData.clouds.all;
   // Check if api provides rain data
   if(apiData.rain){
       weatherObject.rain = apiData.rain['3h'];
   }
   // Check if api provides snow data
   if(apiData.snow){
       weatherObject.snow = apiData.snow['3h'];
   }
   weatherObject.location.country = apiData.sys.country;
   weatherObject.location.cityName = apiData.name;
   weatherObject.location.cityId = apiData.id;
   weatherObject.location.longitude = apiData.coord.lon;
   weatherObject.location.latitude = apiData.coord.lat;
   weatherObject.datetime = apiData.dt;
   weatherObject.sunrise = apiData.sys.sunrise;
   weatherObject.sunset = apiData.sys.sunset;
};

var currentWeather = {
    conditionId: null,
    mainCondition: null,
    description: null,
    temperature: {
        main: null,
        min: null,
        max: null
    },
    pressure: {
        main: null,
        sea: null,
        ground: null
    },
    humidity: null,
    wind: {
        speed: null,
        degree: null
    },
    cloudCoverage: null,
    rain: null,
    snow: null,
    location: {
        country: null,
        cityName: null,
        cityId: null,
        longitude: null,
        latitude: null
    },
    datetime: null,
    sunrise: null,
    sunset: null
};

var trigger = document.getElementById('trigger');

trigger.addEventListener('click', function() {
    // Set longitude and latitude
    var latitude = 47.61;
    var longitude = -122.33;
    // Set up api url
    var url = 'http://api.openweathermap.org/data/2.5/weather';
    var apiKey = '498a1c465e5ecc15a5e913beb7ef67b3';
    var query = url + '?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;

    // Create XHR Instance
    var request = new XMLHttpRequest();
    // Request Weather data api
    request.open('GET', query);
    // Send request
    request.send();
    // When readyState changes
    request.onreadystatechange = function() {
        // If status OK and request is ready (4)
        if(request.status === 200 && request.readyState === 4){
            // Parse response from api
            var weatherData = JSON.parse(request.response);
            // Initialize currentWeather object with api data
            initializeWeather(weatherData, currentWeather);
            // Set currentWeather to display weather data
            console.log(request.response);
            console.log(JSON.stringify(currentWeather));
        }
    };
});
