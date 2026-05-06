

// =========================
// CLOCK
// =========================

function updateClock() {
  const now = new Date();

  document.getElementById("time").innerText =
    now.toTimeString().split(" ")[0];

  document.getElementById("date").innerText =
    now.toDateString();
}

setInterval(updateClock, 1000);
updateClock();


// =========================
// WEATHER SYSTEM (FIXED)
// =========================

const apiKey = "c54d0341dba66b4a31dd14a6582cf6e0";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const output = document.getElementById("weatherResult");

  if (!city) {
    output.innerText = "Enter a city.";
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},US&appid=${apiKey}&units=imperial`
    );

    if (!res.ok) {
      output.innerText = "City not found.";
      return;
    }

    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    output.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
      <div>
        <strong>${temp}°F</strong><br/>
        ${desc}
      </div>
    `;

    document.getElementById("weatherStatus").innerText =
      "✔ Weather System Online";

  } catch (err) {
    output.innerText = "Weather error.";
  }
}


// GEO WEATHER
function getLocationWeather() {
  const output = document.getElementById("weatherResult");

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );

    const data = await res.json();

    output.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
      <div>
        <strong>${Math.round(data.main.temp)}°F</strong><br/>
        ${data.weather[0].description}
      </div>
    `;
  });
}


// =========================
// TASK SYSTEM
// =========================

let tasks = [];
let filter = "all";

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("taskPriority").value;

  if (!input.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: input.value,
    completed: false,
    priority
  });

  input.value = "";
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function setFilter(type) {
  filter = type;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;

  if (filter === "active") filtered = tasks.filter(t => !t.completed);
  if (filter === "completed") filtered = tasks.filter(t => t.completed);

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="priority-${task.priority}">
        ${task.text}
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✓</button>
        <button onclick="deleteTask(${task.id})">X</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  document.getElementById("taskStats").innerText =
    `${total} tasks • ${done} done • ${total - done} left`;

  const percent = total ? (done / total) * 100 : 0;
  document.getElementById("progressBar").style.width = percent + "%";
}


// =========================
// SYSTEM STATUS
// =========================

document.getElementById("weatherStatus").innerText =
  "⚠ Weather API Pending";


// COMMAND MODE
document.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    e.preventDefault();
    document.getElementById("taskInput").focus();
  }
});


// INIT
renderTasks();