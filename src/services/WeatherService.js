import {DateTime} from 'luxon';

const API_KEY = '1fa9ff4126d95b8db54f3897a208e91c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + '/' + infoType);
    url.search = new URLSearchParams({...searchParams, appid:API_KEY});

    return fetch(url)
        .then((res) => res.json())
        
}

const formatCurrentWeather = (data) => {
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        wind: {speed},
        sys: {country, sunrise, sunset},
        name,
        dt,
        weather,
    } = data

    console.log(data)

    const {main: details, icon} = weather[0]

    return {
        lat,
        lon, 
        temp, 
        feels_like,
        temp_min, 
        temp_max, 
        humidity, 
        speed, 
        country, 
        sunrise, 
        sunset, 
        name, 
        dt,
        details, 
        icon
    }
}


const formatForecastWeather = (data) => {
    if (!data) {
        console.error("No forecast data available");
        return { timezone: null, daily: [], hourly: [] };
    }

    const { list, city: { timezone } } = data; // Extract timezone offset (in seconds)
    const timezoneOffset = `UTC${timezone >= 0 ? "+" : ""}${timezone / 3600}`;

    const daily = [];
    const hourly = [];

    list.forEach((entry) => {
        const localTime = DateTime.fromSeconds(entry.dt)
            .setZone(timezoneOffset);

        // Group daily forecasts at noon
        if (localTime.hour === 12) {
            daily.push({
                title: localTime.toFormat('ccc'),
                temp: entry.main.temp,
                icon: entry.weather[0].icon,
            });
        }

        // Limit hourly forecasts to the next 5 entries
        if (hourly.length < 5) {
            hourly.push({
                title: localTime.toFormat('hh:mm a'),
                temp: entry.main.temp,
                icon: entry.weather[0].icon,
            });
        }
    });

    return { timezone: timezoneOffset, daily: daily.slice(0, 5), hourly };
};


const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        'weather', 
        searchParams
        ).then(formatCurrentWeather)

    const { lat, lon } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData('forecast', {
        lat,
        lon,
        units: searchParams.units,
    }).then(formatForecastWeather)

    console.log(formattedForecastWeather)

    return {...formattedCurrentWeather, ...formattedForecastWeather};
}

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy' | Local Time: 'hh:mm a"
    ) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format)

const iconURLFromCode = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`

export default getFormattedWeatherData;

export {formatToLocalTime, iconURLFromCode }