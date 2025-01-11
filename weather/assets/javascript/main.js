// API
const apiKey = '7066cbd61218f92eda82a1d36dd5795e';

// DOM элементы
const weatherError = document.querySelector('.weather-error');
const weatherInfo = document.querySelector('.weather');
const weatherFeed = document.querySelector('.weather-feed');
const cityText = document.querySelector('.weather__city');
const date = document.querySelector('.weather__date');
const weatherText = document.querySelector('.weather__temp');
const weatherDescription = document.querySelector('.weather__description');
const humidityIndicator = document.querySelector('.weather__humidity-indicator');
const windIndicator = document.querySelector('.weather__wind-indicator');
const weatherImage = document.querySelector('.weather__image');
const btnSearch = document.querySelector('.bx-search');
const inputSearch = document.querySelector('.search');
const weatherFeedDate = document.querySelectorAll('.weather-feed__date');
const weatherFeedImage = document.querySelectorAll('.weather-feed__image');
const weatherFeedTemp = document.querySelectorAll('.weather-feed__temp');
const weatherFeedDescription = document.querySelectorAll('.weather-feed__description');

// Инициализация
const today = new Date();
date.innerHTML = formatDate(today);
formatDateForecast(today);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    console.error("Geolocation is not supported by this browser.");
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherByCoordinates(latitude, longitude);
}

function error() {
    console.error("Unable to retrieve your location.");
    updateWeatherInfo('Moscow');
}

async function getWeatherByCoordinates(latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const weatherData = await response.json();
    updateWeatherInfoFromData(weatherData);
}

function updateWeatherInfoFromData(weatherData) {
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    cityText.innerText = country;
    weatherText.innerText = `${Math.round(temp)}°C`;
    weatherDescription.innerText = main;
    humidityIndicator.innerText = `${humidity}%`;
    windIndicator.innerText = `${speed} m/s`;
    weatherImage.src = `./assets/png/weather/${getWeatherIcon(id)}`;

    updateForecastInfo(country);
}

// EventListener
btnSearch.addEventListener('click', handleSearch);
inputSearch.addEventListener('keydown', handleKeyPress);

// Функции
function formatDate(date) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = weekDays[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}

function formatDateForecast(date) {
    for (let i = 1; i <= weatherFeedDate.length; i++) {
        const forecastDate = new Date(date);
        forecastDate.setDate(date.getDate() + i);
        weatherFeedDate[i - 1].innerHTML = formatDate(forecastDate);
    }
}

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod !== 200) {
        console.error(weatherData.message);
        weatherInfo.style.display = "none";
        weatherFeed.style.display = "none";
        weatherError.style.display = "block";
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData;

    cityText.innerText = country;
    weatherText.innerText = `${Math.round(temp)}°C`;
    weatherDescription.innerText = main;
    humidityIndicator.innerText = `${humidity}%`;
    windIndicator.innerText = `${speed} m/s`;
    weatherImage.src = `./assets/png/weather/${getWeatherIcon(id)}`;

    weatherError.style.display = "none";
    weatherInfo.style.display = "block";
    weatherFeed.style.display = "flex";

    await updateForecastInfo(city);
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    if (forecastsData && forecastsData.list) {
        for (let i = 0; i < 7; i++) {
            const forecast = forecastsData.list[i];
            const {
                main: { temp },
                weather: [{ id, main }],
            } = forecast;

            if (weatherFeedTemp[i]) {
                weatherFeedTemp[i].innerHTML = `${Math.round(temp)}°C`;
            } else {
                console.error(`Element weatherFeedTemp[${i}] is undefined`);
            }

            if (weatherFeedDescription[i]) {
                weatherFeedDescription[i].innerHTML = main;
            } else {
                console.error(`Element weatherFeedDescription[${i}] is undefined`);
            }

            if (weatherFeedImage[i]) {
                weatherFeedImage[i].src = `./assets/png/weather/${getWeatherIcon(id)}`;
            } else {
                console.error(`Element weatherFeedImage[${i}] is undefined`);
            }
        }
    } else {
        console.error('No forecast data available');
    }
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id <= 800) return 'clear.svg';
    return 'clouds.svg';
}

function handleSearch() {
    if (inputSearch.value.trim() !== '') {
        updateWeatherInfo(inputSearch.value);
        inputSearch.value = '';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && inputSearch.value.trim() !== '') {
        updateWeatherInfo(inputSearch.value);
        inputSearch.value = '';
    }
}