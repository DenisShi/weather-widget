const search = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-clean-btn");
const searchLabel = document.querySelector(".search-label");

const temperatureMain = document.querySelector(".temperature-main");
const precipitationMain = document.querySelector(".precipitation-main");
const locationMain = document.querySelector(".location-main");

const weeksWeather = document.querySelector(".week-weather");

searchBtn.addEventListener("click", () => {
  search.value = "";
  searchLabel.innerHTML = "Write any city";
});

///// get geoCoding API /////
search.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    try {
      async function getData(city) {
        try {
          const response = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=477f4ab01aab289167fbe31dcb76522c`
          );
          const locate = await response.json();
          weeksWeather.innerHTML = "";
          changeSelected(locate);
          getTemp(locate);
        } catch (err) {
          console.log(err);
        }
      }

      getData(search.value);
    } catch (err) {
      console.log(err);
    }
  }
});

function changeSelected(locate) {
  searchLabel.innerHTML =
    locate.length > 0
      ? `Selected: <strong>${locate[0].name}, ${locate[0].country}</strong>`
      : "Such a city does not exist!";

  locationMain.innerHTML = `${locate[0].name}, ${locate[0].country}`;
}

///// get Weather /////
async function getTemp(locate) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.8/onecall?lat=${locate[0].lat}&lon=${locate[0].lon}&exclude=hourly,minutely&appid=477f4ab01aab289167fbe31dcb76522c&units=metric`
    );

    const data = await response.json();
    mainTemp(data);
    weather5days(data);
  } catch (err) {
    console.log(err);
  }
}

const precipitations = [
  "broken clouds",
  "clear sky",
  "few clouds",
  "light snow",
  "lightning",
  "mist",
  "overcast clouds",
  "rain",
  "scattered clouds",
  "shower rain",
  "snow",
  "thunderstorm",
  "light rain",
  "heavy intensity rain",
  "rain and snow",
  "light shower snow",
  "moderate rain",
];

///// main block render /////
function mainTemp(data) {
  temperatureMain.innerHTML = `<h3>${Math.round(
    data.current.temp
  )}°C</h3><p>Feels like ${Math.round(data.current.feels_like)}°C</p>`;

  const precipitation = data.current.weather[0].description;
  precipitationMain.innerHTML = `<strong>${
    precipitation.charAt(0).toUpperCase() + precipitation.slice(1)
  }</strong>`;

  const iconMainImg = document.querySelector(".icon-main-img");

  iconMainImg.src = `./img/${
    precipitations.includes(precipitation) ? precipitation : "weather-forecast"
  }.png`;
  iconMainImg.alt = precipitation;
}

///// weather render for 5 days /////
function weather5days(data) {
  const weatherItems = data.daily.slice(0, 5).map((item) => {
    const precipitation = item.weather[0].description;
    const tempDay = Math.round(item.temp.day);
    const tempNight = Math.round(item.temp.night);
    const day = item[8];
    return `
      <div class="week-info">
      <div class="week"><p class='day'>${day}</p></div>
      <div class="icon">
         <img width="40px" src='./img/${
           precipitations.includes(precipitation)
             ? precipitation
             : "weather-forecast"
         }.png'  alt=${precipitation}>
      </div>
      <div class="precipitation"><p>${precipitation}</p></div>
      <div class="temperature">
         <p>${tempDay}°C</p>
         <p>${tempNight}°C</p>
      </div>
   </div>
      `;
  });

  weeksWeather.insertAdjacentHTML("afterBegin", weatherItems.join(""));

  // getting the days of the week //
  function dayOfTheWeek() {
    const daysOfTheWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const dateToLocale = new Date().toLocaleString("en-US", {
      timeZone: data.timezone,
    });

    const getDay = new Date(dateToLocale).getDay();

    const days = (
      daysOfTheWeek.slice(getDay) +
      "," +
      daysOfTheWeek.slice(0, getDay)
    )
      .split(",")
      .slice(0, 5);

    return days;
  }

  const week = document.querySelectorAll(".day");

  week.forEach((item, i) => {
    const item1 = dayOfTheWeek()[i];
    item.innerHTML = item1.toUpperCase();
  });
}
