import playList from './playList.js';

const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const greetingContainer = document.querySelector('.greeting-container');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
let randomNum;
const weather = document.querySelector('.weather');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const name = document.querySelector('.name');
const weatherError = document.querySelector('.weather-error');
const quoteContainer = document.querySelector('.quote-container');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
let isPlay = false;
const player = document.querySelector('.player');
const playBtn = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const audio = new Audio();
const playListContainer = document.querySelector('.play-list');
let playNum = 0;
let startTime = 0;
const songTitle = document.querySelector('.song-title');
const elemForStyling = playListContainer.children;
const languageBtn = document.querySelector('.language-btn');
let defaultLanguage = 0;
let numberForTranslateHolder;
const todoBtn = document.querySelector('.todo-btn');
const todo = document.querySelector('.todo');
const todoInput = document.querySelector('.todo-input');
let todoListArray = [];
var settings = {time: true, date: true, greeting: true, quote: true, weather: true, audio: true, todolist: true};
const settingsBtn = document.querySelector('.settings-btn');
const settingsList = document.querySelector('.settings-list');
const settingsLanguage = document.querySelector('.settings-language');
const settingsTime = document.querySelector('.settings-time');
const settingsTimeBtn = document.querySelector('.settings-time-btn');
const settingsDate = document.querySelector('.settings-date');
const settingsDateBtn = document.querySelector('.settings-date-btn');
const settingsGreeting = document.querySelector('.settings-greeting');
const settingsGreetingBtn = document.querySelector('.settings-greeting-btn');
const settingsQuote = document.querySelector('.settings-quote');
const settingsQuoteBtn = document.querySelector('.settings-quote-btn');
const settingsWeather = document.querySelector('.settings-weather');
const settingsWeatherBtn = document.querySelector('.settings-weather-btn');
const settingsAudio = document.querySelector('.settings-audio');
const settingsAudioBtn = document.querySelector('.settings-audio-btn');
const settingsTodo = document.querySelector('.settings-todo');
const settingsTodoBtn = document.querySelector('.settings-todo-btn');

function setLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', city.value);
  localStorage.setItem('todo',  JSON.stringify(todoListArray));
  localStorage.setItem('settings',  JSON.stringify(settings));
};
window.addEventListener('beforeunload', setLocalStorage);    

function getLocalStorage() {
    if(localStorage.getItem('name')) name.value = localStorage.getItem('name');
    if(localStorage.getItem('city')) city.value = localStorage.getItem('city');
    if(localStorage.getItem('defaultLanguage')) defaultLanguage = localStorage.getItem('defaultLanguage');
    if(localStorage.getItem('todo')) todoListArray = JSON.parse(localStorage.getItem('todo'));
    if(localStorage.getItem('settings')) settings = JSON.parse(localStorage.getItem('settings'));
  };
getLocalStorage();

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  setTimeout(showTime, 1000);
  showDate();
  showGreeting();
};
showTime();    

function showDate() {
  let options;
  const dateTemp = new Date();  
  if (defaultLanguage == 0) options = {weekday: 'long', month: 'long', day: 'numeric'};
  if (defaultLanguage == 1) options = {day: 'numeric', month: 'numeric', year: 'numeric'};
  const currentDate = dateTemp.toLocaleDateString('en-US', options);
  date.textContent = currentDate;
};    

function getHours() { 
  const date = new Date();
  const hours = date.getHours();
  return hours;
};   

function getTimeOfDay() {
  const hours = getHours();
  let timeOfDay;
  if (hours >= 0 && hours < 6) {
      timeOfDay = 'night';
  } else if (hours >= 6 && hours < 12) {
      timeOfDay = 'morning';
  } else if (hours >= 12 && hours < 18) {
      timeOfDay = 'afternoon';
  } else {
      timeOfDay = 'evening';
  }
  return timeOfDay;
};    

function showGreeting() {  
  const timeOfDay = getTimeOfDay();

  if (defaultLanguage == 0) {
    const greetingText = `Good ${timeOfDay}`;
    greeting.textContent = greetingText;
  };
  if (defaultLanguage == 1) {
    if (timeOfDay === 'morning') greeting.textContent = 'Добрай раніцы';
    else if (timeOfDay === 'afternoon') greeting.textContent = 'Добры дзень';
    else if (timeOfDay === 'evening') greeting.textContent = 'Добры вечар';
    else greeting.textContent = 'Дабранач';
  };  
};

function getRandomNum(min, max) {
  randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
};
getRandomNum(1, 20);    

function setBg() {
  let timeOfDay = getTimeOfDay();
  let bgNum = String(randomNum).padStart(2, "0");
  const img = new Image();
  img.src = "../momentum/assets/images/" + timeOfDay + '/' + bgNum + ".jpg";
  img.onload = () => {      
    body.style.backgroundImage = "url('../momentum/assets/images/" + timeOfDay + '/' + bgNum + ".jpg')";
  }; 
};
setBg();    

function getSlideNext() {
  if (randomNum == 20) randomNum = 0;  
  if (randomNum < 20) randomNum += 1;
  setBg();
};
slideNext.addEventListener('click', getSlideNext);

function getSlidePrev() {
  if (randomNum == 1) randomNum = 21;
  if (randomNum > 1) randomNum -= 1;  
  setBg();
};
slidePrev.addEventListener('click', getSlidePrev);

async function getWeather() {
  let windSpeed;
  let wordHumidity;
  let language;
  let speed;

  if (city.value == '') city.value = 'Minsk';
  if (defaultLanguage == 0) {
    language = 'en';
    wordHumidity = 'Humidity';
    windSpeed = 'Wind speed';
    speed = 'm/s';
  };
  if (defaultLanguage == 1) {
    language = 'be';
    wordHumidity = 'Вільготнасць';
    windSpeed = 'Хуткасць ветру';
    speed = 'м/с';
  };

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=353f690da109c36b2e53ab2ce93a9e4b&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.cod == '404') {
    weatherError.textContent = 'Error! Nothing to geocode for ' + "'" + city.value + "'!";
  } else {
    weatherError.textContent = '';
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    wind.textContent = `${windSpeed}: ${Math.floor(data.wind.speed)} ${speed}`;
    humidity.textContent = `${wordHumidity}: ${data.main.humidity} %`;
    weatherDescription.textContent = data.weather[0].description;
  };
};
city.addEventListener('change', getWeather);
window.addEventListener('load', getWeather);

async function getQuotes() {
  getLocalStorage();

  let quotes;  
  if (defaultLanguage == 0) quotes = "../momentum/assets/data/quotesEng.json";
  if (defaultLanguage == 1) quotes = "../momentum/assets/data/quotesBel.json";
  const res = await fetch(quotes);
  const dataQuotes = await res.json();
  let number = getRandomNum(0, (dataQuotes.length - 1));
  quote.textContent = dataQuotes[number].text;
  author.textContent = dataQuotes[number].author;
  numberForTranslateHolder = number;
};
window.addEventListener('load', getQuotes);
changeQuote.addEventListener('click', getQuotes);

function createPlayList() {
  playList.forEach(el => {
    const li = document.createElement('li');
    playListContainer.append(li);
    li.classList.add('play-item');
    li.textContent = el.title;
  })
};
createPlayList();

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = startTime;
  
  if (isPlay == true) {
    audio.pause();
    isPlay = false;
    playBtn.classList.remove('pause');
    stylePauseItems();
    setInterval(isPlay);
  } else {
    audio.play();
    isPlay = true;
    playBtn.classList.add('pause');
    stylePlayItems();
    setInterval(isPlay);
    songTitle.textContent = (playNum + 1) + '. ' + playList[playNum].title;
    if (elemForStyling[playNum].classList.contains('item-active-in-pause')) elemForStyling[playNum].classList.remove('item-active-in-pause');
  };
};
playBtn.addEventListener('click', playAudio);

audio.addEventListener('ended', getPlayNext);

audio.addEventListener('loadeddata',() => {
    document.querySelector('.length').textContent = getTimeCodeFromNum(audio.duration);
  },
);

for (let i = 0; i < playList.length; i++) {
  elemForStyling[i].addEventListener('click', () => {
    if (i == playNum) playAudio();
    else {
      playNum = i;
      isPlay = false;
       startTime = 0;
       playAudio();
    }    
  })
};

function getPlayNext() {
  if (playNum == (playList.length - 1)) playNum = 0;  
  else playNum += 1;
  if (isPlay == true) isPlay = false;
  startTime = 0;
  playAudio();
};
playNext.addEventListener('click', getPlayNext);

function getPlayPrev() {
  if (playNum == 0) playNum = (playList.length - 1);  
  else playNum -= 1;
  if (isPlay == true) isPlay = false;
  startTime = 0;
  playAudio();
};
playPrev.addEventListener('click', getPlayPrev);

function stylePlayItems() {
  for (let i = 0; i < playList.length; i++) {
    if (elemForStyling[i].classList.contains('item-active')) elemForStyling[i].classList.remove('item-active');
    if (elemForStyling[i].classList.contains('item-active-in-pause')) elemForStyling[i].classList.remove('item-active-in-pause');
  };
  elemForStyling[playNum].classList.add('item-active');
};

function stylePauseItems() {
  elemForStyling[playNum].classList.remove('item-active');
  elemForStyling[playNum].classList.add('item-active-in-pause');
}

//volume slider

let newVolume = 0.15;
let oldVolume = newVolume;
audio.volume = newVolume;
const volumeBtn = document.querySelector('.volume-button');

const volumeSlider = document.querySelector('.volume-slider');
volumeSlider.addEventListener('click', e => {
  if (audio.muted == true) {
    audio.muted = false;
    volumeBtn.style.opacity = 1;
  }
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector('.volume-percentage').style.width = newVolume * 100 + '%';
}, false);

//volume mute

volumeBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (volumeBtn.style.opacity == 0.4) {
    volumeBtn.style.opacity = 1;
    document.querySelector('.volume-percentage').style.width = oldVolume * 100 + '%';
  }
  else {
    volumeBtn.style.opacity = 0.4;
    document.querySelector('.volume-percentage').style.width = 0 + '%';
    oldVolume = newVolume;
  }
});

//timeline

const timeline = document.querySelector('.timeline');
timeline.addEventListener('click', e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
  if (isPlay == false) {
    startTime = audio.currentTime;
    playAudio();
  }
}, false);

function setInterval() {
  if (!isPlay) return;
  else {
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = audio.currentTime / audio.duration * 100 + '%';
    document.querySelector('.current').textContent = getTimeCodeFromNum(audio.currentTime);
    startTime = audio.currentTime;
    setTimeout(setInterval, 500);
  }  
};

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
};

// translate

languageBtn.addEventListener('click', () => {
  defaultLanguage = defaultLanguage + 1;
  if (defaultLanguage > 1) defaultLanguage = 0;
  localStorage.setItem('defaultLanguage', defaultLanguage);
  translateQuotes();
  showGreeting();
  getWeather();
  showDate();
});

async function translateQuotes() {
  let quotes;  
  if (defaultLanguage == 0) quotes = "../momentum/assets/data/quotesEng.json";
  if (defaultLanguage == 1) quotes = "../momentum/assets/data/quotesBel.json";
  const res = await fetch(quotes);
  const dataQuotes = await res.json();
  quote.textContent = dataQuotes[numberForTranslateHolder].text;
  author.textContent = dataQuotes[numberForTranslateHolder].author;
};

function translate() {
  if (defaultLanguage == 0) {
    languageBtn.textContent = 'Бел';
    settingsLanguage.textContent = 'Language';
    settingsTime.textContent = 'Clock';
    settingsDate.textContent = 'Date';
    settingsGreeting.textContent = 'Greeting';
    settingsQuote.textContent = 'Quote';
    settingsWeather.textContent = 'Weather';
    settingsAudio.textContent = 'Audio';
    settingsTodo.textContent = 'Todo';
    todoBtn.textContent = 'Todo';
    name.placeholder = '[Enter name]';
    todoInput.placeholder = '[New todo]';
  } 
  if (defaultLanguage == 1) {
    languageBtn.textContent = 'En';
    settingsLanguage.textContent = 'Мова';
    settingsTime.textContent = 'Гадзіннік';
    settingsDate.textContent = 'Дата';
    settingsGreeting.textContent = 'Вітанне';
    settingsQuote.textContent = 'Цытата';
    settingsWeather.textContent = 'Надвор\'е';
    settingsAudio.textContent = 'Аўдыяплэер';
    settingsTodo.textContent = 'Спіс спраў';
    todoBtn.textContent = 'Рабіць';
    name.placeholder = '[Увядзіце імя]';
    todoInput.placeholder = '[Новая справа]';
  }
};
translate();

// settings

languageBtn.addEventListener('click', () => {
  translate();
});

settingsBtn.addEventListener('click', () => {
  settingsList.classList.toggle ('settings-list-show');
});


function toggleTime() {
  getMagic(time);
  toggleClasses(settingsTimeBtn);
};

if (settings.time == false) toggleTime();

settingsTimeBtn.addEventListener('click', () => {
  toggleTime();
  settings.time = !settings.time;
});


function toggleDate() {
  getMagic(date);
  toggleClasses(settingsDateBtn);
};

if (settings.date == false) toggleDate();

settingsDateBtn.addEventListener('click', () => {
  toggleDate();
  settings.date = !settings.date;
});


function toggleGreeting() {
  getMagic(greetingContainer);
  toggleClasses(settingsGreetingBtn);
};

if (settings.greeting == false) toggleGreeting();

settingsGreetingBtn.addEventListener('click', () => {
  toggleGreeting();
  settings.greeting = !settings.greeting;
});


function toggleQuote() {
  getMagic(quoteContainer);
  toggleClasses(settingsQuoteBtn);
};

if (settings.quote == false) toggleQuote();

settingsQuoteBtn.addEventListener('click', () => {
  toggleQuote();
  settings.quote = !settings.quote;
});


function toggleWeather() {
  getMagic(weather);
  toggleClasses(settingsWeatherBtn);
};

if (settings.weather == false) toggleWeather();

settingsWeatherBtn.addEventListener('click', () => {
  toggleWeather();
  settings.weather = !settings.weather;
});


function toggleAudio() {
  getMagic(player);
  toggleClasses(settingsAudioBtn);
};

if (settings.audio == false) toggleAudio();

settingsAudioBtn.addEventListener('click', () => {
  toggleAudio();
  settings.audio = !settings.audio;
});

function toggleTodo() {
  getMagic(todo);
  getMagic(todoBtn);
  toggleClasses(settingsTodoBtn);
};

if (settings.todolist == false) toggleTodo();

settingsTodoBtn.addEventListener('click', () => {
  toggleTodo();
  settings.todolist = !settings.todolist;
});


function toggleClasses(param) {
  param.children[0].classList.toggle('checkboxAfter');
  param.children[0].children[0].classList.toggle('sliderAfter');
};

function getMagic (param) {
  param.classList.toggle('magic');
};

//.todolist 

let itemId;
let itemText;
let isCrossedOut = false;
const todoList = document.querySelector(".todo-list");

for (let i = 0; i < todoListArray.length; i++) {
  itemId = Object.entries(todoListArray[i])[0][1];
  itemText = Object.entries(todoListArray[i])[1][1];
  isCrossedOut = Object.entries(todoListArray[i])[2][1];
  addItemToPage(itemId, itemText, isCrossedOut);
};

todoBtn.addEventListener('click', () => {
  todo.classList.toggle ('todo-show');
});

document.addEventListener('keyup', event => {
  if(event.code === 'Enter' || event.code === 'NumpadEnter') {
    if (todoInput.value === '') return;
    event.preventDefault();
    itemId = String(Date.now());
    itemText = todoInput.value; 
    addItemToPage(itemId, itemText, isCrossedOut);
    addItemToArray(itemId, itemText, isCrossedOut);
  };
});

function addItemToPage(itemId, itemText, isCrossedOut) {  
  const todoItem = document.createElement('div');
  todoList.appendChild(todoItem);
  todoItem.classList.add('todo-item');  
  todoItem.id = itemId;

  const todoSelect = document.createElement('div');
  todoItem.appendChild(todoSelect);
  todoSelect.classList.add('todo-select');
  todoSelect.id = itemId + 'crossed-out';  

  const span = document.createElement('span');
  todoItem.appendChild(span);
  span.classList.add('todo-text');

  
  const todoDel = document.createElement('div');
  todoItem.appendChild(todoDel);
  todoDel.classList.add('todo-del');
  todoDel.id = itemId + 'del';
  
  span.innerHTML = itemText;
  todoInput.value = '';

  if (isCrossedOut == true) {
    var crossedOut = document.getElementById (itemId);
    var selectBox = document.getElementById (itemId + 'crossed-out');
    crossedOut.classList.toggle('todo-crossed-out');
    selectBox.classList.toggle('todo-select-active');  

  };
};

function addItemToArray(itemId, itemText, isCrossedOut) {
  todoListArray.push({itemId, itemText, isCrossedOut});
};

todoList.addEventListener('click', event => {
  let id = event.target.getAttribute('id');
  if (!id) return;  
  if (id.includes('crossed-out')) {
    crossOutItemInArray(id);
    crossOutItem(id);
  };
  if (id.includes('del')) {
    removeItemFromPage(id);
    removeItemFromArray(id);
  };
});

function crossOutItemInArray(id) {
  for (let i = 0; i < todoListArray.length; i++) {
    if (Object.entries(todoListArray[i])[0][1] == id.replace('crossed-out', '')) {
    todoListArray[i].isCrossedOut = !todoListArray[i].isCrossedOut;
    };
  };  
};

function crossOutItem(id) {
  var crossedOut = document.getElementById (id.replace('crossed-out', ''));
  var selectBox = document.getElementById (id);
  crossedOut.classList.toggle('todo-crossed-out');
  selectBox.classList.toggle('todo-select-active');  
};

function removeItemFromPage(id) {
  var div = document.getElementById (id.replace('del', ''));
  todoList.removeChild(div);
};

function removeItemFromArray(id) {
  todoListArray = todoListArray.filter(item => item.itemId !== id.replace('del', ''));
};