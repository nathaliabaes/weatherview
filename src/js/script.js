const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const flagcdnElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");
const errorMessage = document.querySelector("#error");
const loadingElement = document.querySelector("#loading");

// 1 - buscar clima (back-end)

const getWeatherData = async (city) => {
  const res = await fetch(`https://backend-weatherview.onrender.com/weather?city=${city}`);
  const data = await res.json();
  return data;
};

// 2 - buscar foto (back-end)

const getPhoto = async (city) => {
  const res = await fetch(`https://backend-weatherview.onrender.com/photo?city=${city}`);
  const data = await res.json();
  return data;
};

// 3 - troca background

const setBackgroundImage = async (city) => {
  try {
    const data = await getPhoto(city);

    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;

      document.body.style.backgroundImage = `url(${imageUrl})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.transition = "background-image 1s ease";
    }
  } catch (error) {
    console.log(error);
  }
};

// 4 - mostrar os dados

const showWeatherData = async (city) => {
  loadingElement.classList.remove("hide");

  const data = await getWeatherData(city);

  // erro de cidade não encontrada
  if (data.error || data.cod === "404") {
    errorMessage.classList.remove("hide");
    weatherContainer.classList.add("hide");
    loadingElement.classList.add("hide");
    return;
  }

  errorMessage.classList.add("hide");

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;

  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );

  flagcdnElement.setAttribute(
    "src",
    `https://flagcdn.com/24x18/${data.sys.country.toLowerCase()}.png`
  );

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed} km/h`;

  setBackgroundImage(city);

  weatherContainer.classList.remove("hide");
  loadingElement.classList.add("hide");
};

//Eventos
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value;
  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});
