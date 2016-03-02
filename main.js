var trigger = document.getElementById('trigger');

trigger.addEventListener('click', function() {
    var request = new XMLHttpRequest();

    request.open('GET', 'weather_info.json');  

    request.send();

    request.onreadystatechange = function() {
        if(request.status === 200 && request.readyState === 4){
            var currentWeather = document.getElementById('current-weather');
            var weatherData = JSON.parse(request.response);
            currentWeather.innerHTML = weatherData.weather[0].description
        }
    }
});
