const fetchWeather = async () => {
  // 1. Get user input and DOM elements
  const cityInput = document
    .getElementById("cityName")
    .value.trim()
    .toLowerCase();
  const weatherHeader = document.querySelector(".header");
  const detailsElement = document.getElementById("weatherDetails");
  const elementDetails = document.getElementById("detailsWeather");

  // Check if input is empty before making a network request
  if (!cityInput) {
    alert("Please enter a city name first!");
    return;
  }

  try {
    // 2. STEP 1: Fetch city latitude & longitude coordinates
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`,
    );

    // Check if the HTTP response status is okay (200-299)
    if (!geoResponse.ok) {
      throw new Error("Failed to connect to the geocoding service.");
    }

    const geoData = await geoResponse.json();

    // Check if the API returned any results for the city name provided
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please try another city.");
    }

    // Extract relevant data from the geocoding result
    const cityResult = geoData.results[0];
    const lat = cityResult.latitude;
    const lon = cityResult.longitude;
    const officialName = cityResult.name;
    const country = cityResult.country || "";

    // 3. STEP 2: Fetch current weather using the latitude & longitude
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    );

    if (!weatherResponse.ok) {
      throw new Error("Failed to retrieve weather data.");
    }

    const weatherData = await weatherResponse.json();
    console.log("Weather Data:", weatherData); // Log full object to console for debugging

    // Extract weather details from the JSON response
    const temp = weatherData.current_weather.temperature;
    const windSpeed = weatherData.current_weather.windspeed;
    const weatherCode = weatherData.current_weather.weathercode;

    // 4. Update the HTML elements with fetched data
    weatherHeader.style.display = "block"; // Make the header visible
    weatherHeader.innerText = `Weather in ${officialName}${country ? `, ${country}` : ""}`;
    detailsElement.innerText = `${temp}°C 
    `;
    elementDetails.innerText = `Wind Speed: ${windSpeed} km/h`;
  } catch (error) {
    // Catch and display any errors (e.g. invalid city or network failure)
    console.error("Error:", error);
    weatherHeader.innerText = "Error Loading Weather";
    detailsElement.innerText = error.message;
  }
};

const cityInput = document.getElementById("cityName");
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    fetchWeather();
  }
});
