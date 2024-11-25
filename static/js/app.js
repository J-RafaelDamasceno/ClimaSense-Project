
'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * Add event listener on multiple elements
 * @param {NodeList} elements Eelements node array
 * @param {string} eventType Event Type e.g.: "click", "mouseover"
 * @param {Function} callback Callback function
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
}

/**
 * Toggle search in mobile devices
 */
const searchViews = document.querySelectorAll("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const staticUrl = "/static/img/weather_icons/";


// Função para alternar a visibilidade da barra de pesquisa
const toggleSearch = (view) => {
  view.classList.toggle("active");

  // Focar automaticamente no campo de pesquisa ao abrir
  const inputField = view.querySelector("[data-search-field]");
  if (view.classList.contains("active") && inputField) {
    inputField.focus();
  }
};

// Adicionar evento para alternar a barra de pesquisa
searchTogglers.forEach((toggler) => {
  toggler.addEventListener("click", function () {
    const view = toggler.closest("header") ? document.querySelector("header .search-view") : document.querySelector(".content-left .search-view");
    toggleSearch(view);
  });
});

/**
 * SEARCH INTEGRATION
 */
function handleSearch(inputField) {
  const resultContainer = inputField.closest(".search-view").querySelector("[data-search-result]");
  
  let searchTimeout = null;
  const serachTimeoutDuration = 500;

  inputField.addEventListener("input", function () {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (!inputField.value) {
      resultContainer.classList.remove("active");
      resultContainer.innerHTML = "";
      inputField.classList.remove("searching");
    } else {
      inputField.classList.add("searching");
    }

    if (inputField.value) {
      searchTimeout = setTimeout(() => {
        fetchData(url.geo(inputField.value), function (locations) {
          inputField.classList.remove("searching");

          if (locations.length > 0) {
            resultContainer.classList.add("active");
            resultContainer.innerHTML = `<ul class="view-list" data-search-list></ul>`;

            const items = [];

            for (const { name, lat, lon, country, state } of locations) {
              const searchItem = document.createElement("li");
              searchItem.classList.add("view-item");

              searchItem.innerHTML = `
                <i class="ph-light ph-map-pin m-icon"></i>
                <div>
                  <p class="item-title">${name}</p>
                  <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                </div>
                <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
              `;

              resultContainer.querySelector("[data-search-list]").appendChild(searchItem);
              items.push(searchItem.querySelector("[data-search-toggler]"));
            }

            // Forçar a visibilidade do contêiner de resultados
            resultContainer.style.display = "block";

            addEventOnElements(items, "click", function () {
              toggleSearch(inputField.closest(".search-view"));
              resultContainer.classList.remove("active");
              resultContainer.innerHTML = "";
              inputField.value = "";
            });
          } else {
            // Se nenhuma cidade for encontrada
            resultContainer.innerHTML = `<p class="no-results">Nenhuma cidade encontrada.</p>`;
            resultContainer.classList.add("active");
          }
        });
      }, serachTimeoutDuration);
    }
  });
}

// Aplicar a função em todos os campos de pesquisa
document.querySelectorAll("[data-search-field]").forEach(handleSearch);

// Fechar a barra de pesquisa se clicar fora dela
document.addEventListener("click", function (event) {
  const searchViews = document.querySelectorAll(".search-view");

  // Verifica se o clique não foi no botão de alternância, nem na barra de pesquisa
  let isSearchButtonClick = event.target.closest("[data-search-toggler]");
  if (!isSearchButtonClick) {
    searchViews.forEach((view) => {
      const inputField = view.querySelector("[data-search-field]");
      const resultContainer = view.querySelector("[data-search-result]");

      // Se o clique for fora da barra de pesquisa, fecha
      if (
        !view.contains(event.target) && // Clique fora da search-view
        event.target !== inputField && // Clique fora do input de pesquisa
        event.target !== resultContainer // Clique fora do resultado da pesquisa
      ) {
        view.classList.remove("active"); // Fecha a pesquisa
        resultContainer.classList.remove("active"); // Fecha os resultados
        resultContainer.innerHTML = ""; // Limpa os resultados
      }
    });
  }
});




const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html page
 * 
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = function (lat, lon) {

  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector("[data-current-weather]");
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  /**
   * CURRENT WEATHER SECTION
   */
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {

    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone
    } = currentWeather
    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
      <h2 class="title-2 card-title">Agora</h2>

      <div class="weapper">
        <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

        <img src="${staticUrl}${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
      </div>

      <p class="body-3">${description}</p>

      <ul class="meta-list">

        <li class="meta-item">
          <i class="icon ph-light ph-calendar-blank m-icon"></i>

          <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
        </li>

        <li class="meta-item">
           <i class="ph-light ph-map-pin m-icon"></i>

          <p class="title-3 meta-text" data-location></p>
        </li>

      </ul>
    `;

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
    });

    currentWeatherSection.appendChild(card);

    /**
     * TODAY'S HIGHLIGHTS
     */
    fetchData(url.airPollution(lat, lon), function (airPollution) {

      const [{
        main: { aqi },
        components: { no2, o3, so2, pm2_5 }
      }] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");

      card.innerHTML = `
        <h2 class="title-2" id="highlights-label">Destaques de Hoje</h2>

        <div class="highlight-list">

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Umidade</h3>

            <div class="wrapper">
              <i class="ph-bold ph-drop m-icon"></i>

              <p class="title-1">${humidity}<sub>%</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Pressão</h3>

            <div class="wrapper">
              <i class="ph-bold ph-waves m-icon"></i>
              <p class="title-1">${pressure}<sub>hPa</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Visibilidade</h3>

            <div class="wrapper">
              <i class="ph-bold ph-eye m-icon"></i>

              <p class="title-1">${visibility / 1000}<sub>km</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Sensação Térmica</h3>

            <div class="wrapper">
              <i class="ph-bold ph-thermometer m-icon"></i>

              <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
            </div>

          </div>

        </div>
      `;

      highlightSection.appendChild(card);

    });

    /**
     * 24H FORECAST SECTION
     */
    fetchData(url.forecast(lat, lon), function (forecast) {

      const {
        list: forecastList,
        city: { timezone }
      } = forecast;

      hourlySection.innerHTML = `
        <h2 class="title-2">Hoje às</h2>

        <div class="slider-container">
          <ul class="slider-list" data-temp></ul>

          <ul class="slider-list" data-wind></ul>
        </div>
      `;

      for (const [index, data] of forecastList.entries()) {

        if (index > 7) break;

        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed }
        } = data
        const [{ icon, description }] = weather

        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");

        tempLi.innerHTML = `
          <div class="card card-sm slider-card">

            <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

            <img src="${staticUrl}${icon}.png" width="48" height="48" style="margin-top: 28px; margin-bottom: 28px;" alt="${description}" class="weather-icon">

            <p class="body-3">${parseInt(temp)}&deg;</p>

          </div>
        `;
        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");

        windLi.innerHTML = `
        <div class="card card-sm slider-card">
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

          <!-- Ajustando a rotação da seta para a direção do vento -->
          <img src="${staticUrl}direction.png" width="48" height="48" style="margin-top: 28px; margin-bottom: 28px; transform: rotate(${windDirection}deg)" class="weather-icon">

          <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
        </div>
        `;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);

      }

      /**
       * 5 DAY FORECAST SECTION
       */
      forecastSection.innerHTML = `
        <h2 class="title-2" id="forecast-label">Previsão para 5 Dias</h2>

        <div class="card card-lg forecast-card">
          <ul data-forecast-list></ul>
        </div>
      `;
      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt
        } = forecastList[i];
        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);
      
        const li = document.createElement("li");
        li.classList.add("card-item");
      
        li.innerHTML = `
          <!-- Contêiner para ícone, temperatura, data e dia -->
            <div class="temp-date-day">
              <div class="icon-wrapper">
                <img src="${staticUrl}${icon}.png" width="52" height="52" alt="${description}" class="weather-icon">
              </div>
              <p class="temperature">${parseInt(temp_max)}&deg;</p>
              <p class="date">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
             
            </div>
        `;
      
        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }
      
      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });

  });

}

export const error404 = () => errorContent.style.display = "flex";

