
const clientId = "kXlZ4kCsGDbUr7WUS5yw0";
const clientSecret = "ssRELPdrTCjh7yFwSgjloAAuenVAqa67QfYKccY7";

// Get HTML elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherInfo = document.getElementById("weatherInfo");

// Main function to fetch weather
async function getWeather() {
    const city = cityInput.value.trim();

    // Check if city input is empty
    if (city === "") {
        message.textContent = "Please enter a city name.";
        weatherInfo.hidden = true;
        return;
    }

    message.textContent = "Loading weather...";
    weatherInfo.hidden = true;
    searchBtn.disabled = true;

    try {
        // Create API authentication parameters
        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret
        });

        // Create API URL
       const location = `${city},PK`;

const url =
    `https://data.api.xweather.com/conditions/` +
    `${encodeURIComponent(location)}?${params}`;
        // Fetch weather data
        const response = await fetch(url);
        const data = await response.json();

        // Check for API errors
        if (!response.ok || !data.success) {
            throw new Error(
                data.error?.description ||
                data.error ||
                "Unable to get weather data."
            );
        }

        // Get the first weather result
        const result = data.response?.[0];
        const weather = result?.periods?.[0];

        if (!result || !weather) {
            throw new Error("No weather data found for this city.");
        }

        // Display city and country
        const country = result.place.country || "";

        document.getElementById("cityName").textContent =
            `${result.place.name}${country ? ", " + country : ""}`;

        // Display temperature in Celsius
        document.getElementById("temperature").textContent =
            weather.tempC == null
                ? "N/A"
                : `${Math.round(weather.tempC)}°C`;

        // Display weather condition
        document.getElementById("condition").textContent =
            weather.weather || "Condition unavailable";

        // Display humidity
        document.getElementById("humidity").textContent =
            weather.humidity == null
                ? "N/A"
                : `${weather.humidity}%`;

        // Display wind speed
        document.getElementById("wind").textContent =
            weather.windSpeedMPS == null
                ? "N/A"
                : `${weather.windSpeedMPS} m/s`;

        // Display a weather emoji in place of the old image
        const weatherIcon = document.getElementById("weatherIcon");

        weatherIcon.removeAttribute("src");
        weatherIcon.alt = "Weather icon";
        weatherIcon.style.display = "block";
        weatherIcon.style.objectFit = "contain";

        const condition = (weather.weather || "").toLowerCase();

        if (condition.includes("thunder")) {
            weatherIcon.alt = "⛈️";
        } else if (condition.includes("snow")) {
            weatherIcon.alt = "❄️";
        } else if (condition.includes("rain") ||
                   condition.includes("shower")) {
            weatherIcon.alt = "🌧️";
        } else if (condition.includes("cloud")) {
            weatherIcon.alt = "☁️";
        } else if (condition.includes("fog")) {
            weatherIcon.alt = "🌫️";
        } else if (condition.includes("clear") ||
                   condition.includes("sun")) {
            weatherIcon.alt = "☀️";
        } else {
            weatherIcon.alt = "🌤️";
        }

        // Show weather information
        weatherInfo.hidden = false;
        message.textContent = "";

    } catch (error) {
        console.error("Weather API error:", error);

        message.textContent =
            error.message === "Failed to fetch"
                ? "Network error. Check your internet connection and API access."
                : `Unable to load weather: ${error.message}`;

        weatherInfo.hidden = true;

    } finally {
        searchBtn.disabled = false;
    }
}

// Search button click event
searchBtn.addEventListener("click", getWeather);

// Allow searching by pressing Enter
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
