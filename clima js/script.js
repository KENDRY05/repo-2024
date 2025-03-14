// Clave de API de OpenWeatherMap
const apiKey = '1499cb6290c28458577e97ea594db2de'; // Reemplaza con tu API Key

// Elementos del DOM
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const loading = document.createElement('div');
loading.className = 'loading';
weatherResult.appendChild(loading);

// Función principal para obtener el clima
async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Por favor, ingresa una ciudad.');
    return;
  }

  showLoading();

  try {
    const data = await fetchWeather(city);
    displayWeather(data);
  } catch (error) {
    showError('Hubo un error al obtener el clima. Intenta de nuevo.');
    console.error('Error:', error);
  } finally {
    hideLoading();
  }
}

// Función para obtener datos del clima desde la API
async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Ciudad no encontrada');
  }

  return await response.json();
}

// Función para mostrar el clima en la interfaz
function displayWeather(data) {
  const { name, sys, main, weather } = data;
  const temperature = main.temp;
  const description = weather[0].description;
  const icon = weather[0].icon;

  weatherResult.innerHTML = `
    <h2>${name}, ${sys.country}</h2>
    <p>Temperatura: ${temperature}°C</p>
    <p>Clima: ${description}</p>
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
  `;
}

// Función para mostrar errores
function showError(message) {
  weatherResult.innerHTML = `<p class="error">${message}</p>`;
}

// Función para mostrar el ícono de carga
function showLoading() {
  loading.style.display = 'block';
}

// Función para ocultar el ícono de carga
function hideLoading() {
  loading.style.display = 'none';
}

// Función para obtener el clima basado en la ubicación del usuario
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        showLoading();

        try {
          const data = await fetchWeatherByCoords(latitude, longitude);
          displayWeather(data);
        } catch (error) {
          showError('No se pudo obtener la ubicación.');
          console.error('Error:', error);
        } finally {
          hideLoading();
        }
      },
      (error) => {
        showError('No se pudo obtener la ubicación.');
        console.error('Error:', error);
      }
    );
  } else {
    showError('Tu navegador no soporta geolocalización.');
  }
}

// Función para obtener el clima por coordenadas
async function fetchWeatherByCoords(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Error al obtener el clima');
  }

  return await response.json();
}

// Evento para buscar el clima al presionar Enter
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeather();
  }
});