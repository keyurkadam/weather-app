import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import searchIcon from "../assets/search.png";
import clearIcon from "../assets/clear.png";
import cloudIcon from "../assets/cloud.png";
import humidityIcon from "../assets/humidity.png";
import windIcon from "../assets/wind.png";
import drizzleIcon from "../assets/drizzle.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";

const WeatherApp = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState({
        humidity: null,
        wind: null,
        temperature: null,
        location: null,
    });
    const [weatherIcon, setWeatherIcon] = useState(clearIcon);

    const apiKey = "9726882213ce0658442a2f044c19b6fa";

    useEffect(() => {
        fetchWeatherDataByLocation();
    }, []); 

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeatherData = async () => {
        try {
            if (!city) return;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            updateWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const fetchWeatherDataByLocation = async () => {
        try {
            if (!navigator.geolocation) {
                console.error("Geolocation is not supported by your browser");
                return;
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                updateWeatherData(data);
            });
        } catch (error) {
            console.error("Error fetching weather data by location:", error);
        }
    };

    const updateWeatherData = (data) => {
        const { main, wind, weather, name } = data;
        setWeatherData({
            humidity: main.humidity,
            wind: Math.floor(wind.speed),
            temperature: Math.floor(main.temp),
            location: name,
        });
        const weatherIconCode = weather[0].icon.slice(0, -1);
        switch (weatherIconCode) {
            case "01":
                setWeatherIcon(clearIcon);
                break;
            case "02":
            case "03":
            case "04":
                setWeatherIcon(cloudIcon);
                break;
            case "09":
            case "10":
                setWeatherIcon(rainIcon);
                break;
            case "13":
                setWeatherIcon(snowIcon);
                break;
            default:
                setWeatherIcon(drizzleIcon);
        }
    };

    return (
        <div className="container">
            <div className="top-bar">
                <input
                    type="text"
                    className="cityInput"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Search"
                />
                <div className="search-icon" onClick={fetchWeatherData}>
                    <img src={searchIcon} alt="Search" />
                </div>
            </div>
            <div className="weather-image">
                <img src={weatherIcon} alt="Weather" />
            </div>
            <div className="weather-temp">{weatherData.temperature}°C</div>
            <div className="weather-location">{weatherData.location}</div>
            <div className="data-container">
                <WeatherElement icon={humidityIcon} value={`${weatherData.humidity}%`} text="Humidity" />
                <WeatherElement icon={windIcon} value={`${weatherData.wind} km/h`} text="Wind Speed" />
            </div>
        </div>
    );
};

const WeatherElement = ({ icon, value, text }) => (
    <div className="element">
        <img src={icon} alt={text} className="icon" />
        <div className="data">
            <div className="value">{value}</div>
            <div className="text">{text}</div>
        </div>
    </div>
);

WeatherElement.propTypes = {
    icon: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default WeatherApp;
