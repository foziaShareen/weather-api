$(document).ready(function () {
    const API_KEY = ''; // Replace with your OpenWeatherMap API Key

    $('#get-weather').click(function () {
        const city = $('#city').val();
        if (city === '') {
            alert('Please enter a city name.');
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

        $.get(apiUrl, function (data) {
            displayWeeklyForecast(data);
        }).fail(function () {
            alert('City not found. Please try again.');
        });
    });

    function displayWeeklyForecast(data) {
        const dailyForecasts = groupByDay(data.list);

        const weeklyForecastContainer = $('#weekly-forecast');
        weeklyForecastContainer.empty();

        for (const [day, forecast] of dailyForecasts.entries()) {
            const date = new Date(forecast[0].dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            const temperatureMax = Math.max(...forecast.map(entry => entry.main.temp_max));
            const temperatureMin = Math.min(...forecast.map(entry => entry.main.temp_min));
            const description = forecast[0].weather[0].description;

            const dayCard = `<div class="day-card">
                <h2>${dayName}</h2>
                <p><strong>Max Temp:</strong> ${temperatureMax}°C</p>
                <p><strong>Min Temp:</strong> ${temperatureMin}°C</p>
                <p><strong>Description:</strong> ${description}</p>
            </div>`;

            weeklyForecastContainer.append(dayCard);
        }
    }

    function groupByDay(dataList) {
        const dailyForecasts = new Map();

        dataList.forEach(entry => {
            const date = new Date(entry.dt * 1000);
            const day = date.toDateString();

            if (!dailyForecasts.has(day)) {
                dailyForecasts.set(day, []);
            }

            dailyForecasts.get(day).push(entry);
        });

        return dailyForecasts;
    }
});
