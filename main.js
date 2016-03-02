var trigger = document.getElementById('trigger');

trigger.addEventListener('click', function() {
    // Grab Zip Code value from input box
    var zipCode = document.getElementById('zipcode').value;
    // Set up api url
    var url = 'http://api.openweathermap.org/data/2.5/weather';
    var apiKey = '498a1c465e5ecc15a5e913beb7ef67b3';
    var query = url + '?zip=' + zipCode + 'us&appid=' + apiKey;

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
            // Grab weather information
            var currentWeather = document.getElementById('current-weather');
            // Parse response from api
            var weatherData = JSON.parse(request.response);
            // Set currentWeather to display weather data
            currentWeather.innerHTML = weatherData.weather[0].description;
        }
    };
});
