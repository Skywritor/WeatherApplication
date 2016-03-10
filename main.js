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

function initializeWeather(apiData, weatherObject) {

  function timeConversion(seconds, countryName) {
    var datetime = new Date(seconds*1000);
    var minutes = datetime.getMinutes();
    var hours, time;
    // Prepend zero if minutes less than 10
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    // Check if US for necessary 12 hour conversion
    if (countryName === "US") {
      // Convert 24hr to 12hr time
      hours = ((datetime.getHours() + 11) % 12) + 1;
      time = hours + ":" + minutes;
      // Return AM/PM based on hours
      return (datetime.getHours() >= 12) ? time + " PM" : time + " AM";
    } else {
      hours = datetime.getHours();
      return hours + ":" + minutes;
    }
  }

  function formatCoordinate(coorObj) {
    if (coorObj.lon) {
      if (coorObj.lon < 0) {
        return Math.abs(coorObj.lon) + "&deg; W";
      } else {
        return coorObj.lon + "&deg; E";
      }
    } else if (coorObj.lat){
      if (coorObj.lat < 0) {
        return Math.abs(coorObj.lat) + "&deg; S";
      } else {
        return coorObj.lat + "&deg; N";
      }
    }
  }

  weatherObject.conditionId = apiData.weather[0].id;
  weatherObject.mainCondition = apiData.weather[0].main;
  weatherObject.description = apiData.weather[0].description;
  weatherObject.temperature.main = apiData.main.temp;
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
  weatherObject.location.longitude = formatCoordinate({lon: apiData.coord.lon});
  weatherObject.location.latitude = formatCoordinate({lat: apiData.coord.lat});
  weatherObject.datetime = timeConversion(apiData.dt, apiData.sys.country);
  weatherObject.sunrise = timeConversion(apiData.sys.sunrise, apiData.sys.country);
  weatherObject.sunset = timeConversion(apiData.sys.sunset, apiData.sys.country);
}

function geolocationSuccess(pos) {
  // Set up api url
  var url = 'http://api.openweathermap.org/data/2.5/weather';
  var apiKey = '498a1c465e5ecc15a5e913beb7ef67b3';
  var query = url + '?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&appid=' + apiKey;

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
          // Inject table
          loadDataTable();

      }
  };
}

function geolocationError(err) {
  console.warn('ERROR(' + err.code +'): ' + err.message);
  // Place fall-back logic here so client can enter zip code
}

window.onload = function() {
  // Geolocation
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {timeout: 20000});
};


function loadDataTable() {
  var dataTable = document.getElementById("data-table");
  dataTable.innerHTML =
  "<tr>" +
      "<td>" +
          currentWeather.location.cityName + ", " +
          currentWeather.location.country +
      "</td>" +
      "<td>" +
          currentWeather.location.longitude + ", " +
          currentWeather.location.latitude +
      "</td>" +
  "</tr>" +
  "<tr>" +
      "<td>" +
        "Pressure: " + currentWeather.pressure.main +
      "</td>" +
      "<td>" +
        "Humidity: " + currentWeather.humidity + "%, " +
        "Cloud Coverage: " + currentWeather.cloudCoverage + "%" +
      "</td>" +
  "</tr>" +
  "<tr>" +
      "<td>" +
          "Sunrise: " + currentWeather.sunrise +
      "</td>" +
      "<td>" +
          "Sunset: " + currentWeather.sunset +
      "</td>" +
  "</tr>";
}
