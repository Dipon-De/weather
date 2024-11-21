// const apiKey = config.apiKey;                // API key from config.js      for locally run 

// const apiKey = process.env.NEXT_PUBLIC_API_KEY; // api key for deployment     for public 
require('dotenv').config();

const apiKey = process.env.API_KEY;

const weatherDataEle = document.querySelector(".weather-data");
const cityNameEle = document.querySelector("#city-name");
const formEle = document.querySelector("#weather-form");
const imgIcon = document.querySelector(".icon");
const dateTimeEle = document.querySelector("#date-time");


formEle.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityValue = cityNameEle.value.trim();

    if (cityValue) {
        getWeatherData(cityValue);
    } else {
        displayError("Please enter a city name!");
    }
});

async function getWeatherData(cityValue) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
            throw new Error("City not found!");
        }

        const data = await response.json();
        updateWeatherData(data);
    } catch (err) {
        displayError(err.message);
    }
}

function updateWeatherData(data) {
    const temperature = Math.floor(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    const getcurrentday = () => {
        var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        let currentday = new Date();
        return weekday[currentday.getDay()];
    };

    const curr_rem = () => {
        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];
        var now = new Date();
        var month = months[now.getMonth()];
        var date = now.getDate();

        let hours = now.getHours();
        let mins = now.getMinutes();

        let periods = "AM";

        if (hours > 11) {
            periods = "PM";
            if (hours > 12) hours -= 12;
        }

        if (mins < 10) {
            mins = "0" + mins;
        }

        return `${month} ${date} | ${hours}:${mins} ${periods}`;
    }
    const formattedTime = getcurrentday() + " | " + curr_rem();

    dateTimeEle.textContent = `${formattedTime}`;

    const details = [
        `Feels Like: ${Math.floor(data.main.feels_like)}°C`,
        `Min Temp: ${data.main.temp_min}°C`,
        `Max Temp: ${data.main.temp_max}°C`,
        `Humidity: ${data.main.humidity}%`,
        `Sea Level: ${data.main.sea_level} hPa`,
        `Ground Level: ${data.main.grnd_level} hPa`,
        `Visibility: ${data.visibility} m`,
        `Wind Speed: ${data.wind.speed} m/s`,
    ];

    weatherDataEle.querySelector(".temp").textContent = `${temperature}°C`;
    weatherDataEle.querySelector(".desc").textContent = description;
    imgIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
    weatherDataEle.querySelector(".details").innerHTML = details.map((detail) => `<div>${detail}</div>`).join("");
}

function displayError(message) {
    weatherDataEle.querySelector(".temp").textContent = "";
    imgIcon.innerHTML = "";
    weatherDataEle.querySelector(".desc").textContent = message;
    weatherDataEle.querySelector(".details").innerHTML = "";
}