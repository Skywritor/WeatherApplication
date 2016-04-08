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
    sunrise: null, sunset: null
};

function loadImage() {
  // See weather-codes.txt for code descriptions
  var directories = {
    thunderstorm: {
      codes: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
      imageCount: 1
    },
    drizzle: {
      codes: [300, 301, 302, 310, 311, 312, 313, 314, 321],
      imageCount: 1
    },
    rain: {
      codes: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
      imageCount: 1
    },
    snow: {
      codes: [600, 601, 602, 611, 612, 615, 616, 620, 621, 622, 906],
      imageCount: 1
    },
    haze: {
      codes: [701, 721, 741],
      imageCount: 1
    },
    dust: {
      codes: [711, 731, 751, 761, 762],
      imageCount: 1
    },
    tornado: {
      codes: [771, 781, 900],
      imageCount: 1
    },
    clear: {
      codes: [800, 951, 952, 953, 954, 955],
      imageCount: 1
    },
    clouds: {
      codes: [801, 802, 803, 804],
      imageCount: 1
    },
    windy: {
      codes: [905, 956, 957, 958],
      imageCount: 1
    },
    hot: {
      codes: [904],
      imageCount: 1
    },
    cold: {
      codes: [903],
      imageCount: 1
    },
    storm: {
      codes: [901, 902, 959, 960, 961, 962],
      imageCount: 1
    },
  };

  var conditionId = parseInt(currentWeather.conditionId);

  for (var directory in directories) {
    if (directories[directory]["codes"].indexOf(conditionId) !== -1) {
      var imageDirectory = "assets/weather-pictures/" + directory + "/";
      var imageIndex = Math.floor(Math.random()) * directories[directory]["imageCount"];
      var imageElement = document.getElementById("condition-picture");
      imageElement.src = imageDirectory + imageIndex + ".jpg";
    }
  }

}


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

  function pressureConversion(pressure, countryName) {
      var convertedPressure
      if (countryName === 'US') {
        convertedPressure = (pressure*0.0295299830714).toPrecision(4)
        return convertedPressure + ' inHg'
      }
      else {
          return (pressure).toString() + ' hPa'
      }
  }

  function temperatureConversion(temperature, countryName) {
      var convertedTemperature
      fahrenheitCountries = ['US', 'BS', 'BZ', 'KY', 'PW']
      if(fahrenheitCountries.indexOf(countryName) >= 0) {
        convertedTemperature = Math.round((temperature*9/5)-459.67)
        return (convertedTemperature).toString() + ' &deg;F'
      }
      else {
        convertedTemperature = Math.round(temperature-273.15)
        return (convertedTemperature).toString() + ' &deg;C'
      }
  }

  weatherObject.conditionId = apiData.weather[0].id;
  weatherObject.mainCondition = apiData.weather[0].main;
  weatherObject.description = apiData.weather[0].description;
  weatherObject.temperature.main = temperatureConversion(apiData.main.temp, apiData.sys.country);
  weatherObject.temperature.min = temperatureConversion(apiData.main.temp_min, apiData.sys.country);
  weatherObject.temperature.max = temperatureConversion(apiData.main.temp_max, apiData.sys.country);
  weatherObject.pressure.main = pressureConversion(apiData.main.pressure, apiData.sys.country);
  weatherObject.pressure.sea = pressureConversion(apiData.main.sea_level, apiData.sys.country);
  weatherObject.pressure.ground = pressureConversion(apiData.main.grnd_level, apiData.sys.country);
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

function loadWeatherCondition() {
  var weatherCondition = document.getElementById("weather-condition");
  weatherCondition.innerHTML =
  "<h1 id='conditionId'>" +
      currentWeather.mainCondition +
  "</h1>";
  if (currentWeather.mainCondition.toLowerCase() !== currentWeather.description.toLowerCase()) {
    weatherCondition.innerHTML += "<h2>" + currentWeather.description + "</h2>";
  }
}

function loadTemperatureData() {
  var temperatureMain = document.getElementById("temperature-main");
  temperatureMain.innerHTML = currentWeather.temperature.main;
}

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
          'Low: ' +
          currentWeather.temperature.min +
      "</td>" +
      "<td>" +
          'High: ' +
          currentWeather.temperature.max +
      "</td>" +
  "</tr>" +
  "<tr>" +
      "<td>" +
        "Pressure: " + "<br>" + currentWeather.pressure.main +
      "</td>" +
      "<td>" +
        "Humidity: " + currentWeather.humidity + "%, " + "<br>" +
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

function setColor(apiData) {
    var now = new Date();
    var sunrise = new Date(apiData.sys.sunrise * 1000);
    var sunset = new Date(apiData.sys.sunset * 1000);
    if(now.getHours() > sunset.getHours() ||
       now.getHours() < sunrise.getHours() ||
       now.getHours() === sunset.getHours() &&
       now.getMinutes() > sunset.getMinutes() ||
       now.getHours() === sunrise.getHours() &&
       now.getMinutes() < sunrise.getMinutes()) {
       var contentWrapper = document.getElementById("content-wrapper");
       contentWrapper.style.backgroundColor = "black"
       contentWrapper.style.color = "rgba(255, 255, 255, .85)"
       var jumbotron = document.getElementById('weather-condition')
       jumbotron.style.backgroundColor = "rgba(255, 255, 255, .3)"
    }
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
          loadWeatherCondition();
          loadTemperatureData();
          loadDataTable();
          loadImage();
          setColor(weatherData);
          // Once everything is properly loaded fade-in body
          document.getElementById("content-wrapper").style.opacity = 1;
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
