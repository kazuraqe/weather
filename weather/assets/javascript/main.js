const apiKey = '7066cbd61218f92eda82a1d36dd5795e';

const today = new Date();
const cityText = document.querySelector('.weather__city');
const date = document.querySelector('.weather__date');
const weatherText = document.querySelector('.weather__temp');
const weatherDescription = document.querySelector('.weather__description');
const humidityIndicator = document.querySelector('.weather__humidity-indicator');
const windIndicator = document.querySelector('.weather__wind-indicator');
const weatherImage = document.querySelector('.weather__image');


function nowDate(today) {
    const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayWeek = week[today.getDay() - 1];

    const year = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthYear = year[today.getMonth()];

    return dayWeek + ', ' + today.getDate() + ' ' + monthYear;
}

date.innerHTML = nowDate(today);

const btnSearch = document.querySelector('.bx-search');
const inputSearch = document.querySelector('.search');

btnSearch.addEventListener('click', () => {
    if (inputSearch.value.trim() !== '') {
        updateWeatherInfo(inputSearch.value);
    }
})

inputSearch.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter') && (inputSearch.value.trim() !== '')) {
        updateWeatherInfo(inputSearch.value);
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData =  await getFetchData('weather', city);
    console.log(weatherData);
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    cityText.innerText = country;
    weatherText.innerText = Math.round(temp) + '°C';
    weatherDescription.innerText = main;
    humidityIndicator.innerText = humidity + '%';
    windIndicator.innerText = speed + 'm/s';
    weatherImage.src = `./assets/png/weather/${getWeatherIcon(id)}`;
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id <= 800) return 'clear.svg';
    else return 'clouds.svg';
}