let is24Hour = true;
let wakeLock = null;
let hideTimeout;

/* CLOCK */

function updateClock() {

let now = new Date();

let hours = now.getHours();
let minutes = String(now.getMinutes()).padStart(2,'0');
let seconds = String(now.getSeconds()).padStart(2,'0');
let ampm = "";

if(!is24Hour){

ampm = hours >= 12 ? " PM" : " AM";
hours = hours % 12;
hours = hours ? hours : 12;

}

hours = String(hours).padStart(2,'0');

document.getElementById("clock").textContent =
`${hours}:${minutes}:${seconds}${ampm}`;

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

document.getElementById("date").textContent =
`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

}

/* FORMAT */

document.getElementById("formatSwitch").addEventListener("change",(e)=>{

is24Hour = !e.target.checked;

document.getElementById("formatLabel").textContent =
is24Hour ? "24-hour" : "12-hour";

updateClock();

});

/* FULLSCREEN */

document.getElementById("fsBtn").addEventListener("click",()=>{

if(!document.fullscreenElement){

document.documentElement.requestFullscreen();
document.getElementById("fsBtn").textContent = "❎";

}else{

document.exitFullscreen();
document.getElementById("fsBtn").textContent = "⛶";

}

});

document.addEventListener("fullscreenchange",()=>{

if(!document.fullscreenElement){

document.getElementById("fsBtn").textContent = "⛶";

}

});

/* WAKE LOCK */

document.getElementById("wakeSwitch").addEventListener("change", async (e) => {

if(e.target.checked){

try{

wakeLock = await navigator.wakeLock.request("screen");

document.getElementById("wakeLabel").textContent = "Keep Awake ON";

wakeLock.addEventListener("release", () => {

wakeLock = null;

document.getElementById("wakeSwitch").checked = false;

document.getElementById("wakeLabel").textContent = "Keep Awake OFF";

});

}catch{

alert("Wake Lock not supported");

e.target.checked = false;

document.getElementById("wakeLabel").textContent = "Keep Awake OFF";

}

}else{

if(wakeLock){

await wakeLock.release();
wakeLock = null;

}

document.getElementById("wakeLabel").textContent = "Keep Awake OFF";

}

});

/* RE-REQUEST WHEN TAB BECOMES ACTIVE */

document.addEventListener("visibilitychange", async () => {

const wakeSwitch = document.getElementById("wakeSwitch");

if(
wakeSwitch.checked &&
document.visibilityState === "visible" &&
!wakeLock
){

try{

wakeLock = await navigator.wakeLock.request("screen");

}catch(err){

console.error(err);

}

}

});

/* NAVBAR HIDE */

function showUI(){

document.getElementById("navbar").classList.remove("hidden");
document.body.style.cursor = "default";

clearTimeout(hideTimeout);

hideTimeout = setTimeout(()=>{

document.getElementById("navbar").classList.add("hidden");
document.body.style.cursor = "none";

},3000);

}

document.addEventListener("mousemove",showUI);

showUI();

/* LIGHT MODE */

const modeBtn = document.getElementById("modeBtn");

modeBtn.onclick = ()=>{

document.body.classList.toggle("light");

modeBtn.textContent =
document.body.classList.contains("light") ? "☀️" : "🌙";

};

/* THEMES */

const themeSelect = document.getElementById("themeSelect");

themeSelect.addEventListener("change",()=>{

document.body.classList.remove(
"green","blue","red","purple","orange","pink","cyan"
);

document.body.classList.add(themeSelect.value);

});

/* RUN CLOCK */

setInterval(updateClock,1000);
updateClock();
