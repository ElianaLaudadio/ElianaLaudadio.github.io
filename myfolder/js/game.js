const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const foodLogPanel = document.getElementById("foodLogPanel");
const activityLogPanel = document.getElementById("activityLogPanel");
const weightLogPanel = document.getElementById("weightLogPanel");
const workoutLogPanel = document.getElementById("workoutLogPanel");
const proteinLogPanel = document.getElementById("proteinLogPanel");
const bonusLogPanel = document.getElementById("bonusLogPanel");

const foodInput = document.getElementById("foodInput");
const activityInput = document.getElementById("activityInput");
const weightInput = document.getElementById("weightInput");
const workoutInput = document.getElementById("workoutInput");
const proteinInput = document.getElementById("proteinInput");
const bonusInput = document.getElementById("bonusInput");

const saveFoodBtn = document.getElementById("saveFoodBtn");
const saveActivityBtn = document.getElementById("saveActivityBtn");
const saveWeightBtn = document.getElementById("saveWeightBtn");
const saveWorkoutBtn = document.getElementById("saveWorkoutBtn");
const saveProteinBtn = document.getElementById("saveProteinBtn");
const saveBonusBtn = document.getElementById("saveBonusBtn");

const carbsLogPanel = document.getElementById("carbsLogPanel");
const fatLogPanel = document.getElementById("fatLogPanel");

const carbsInput = document.getElementById("carbsInput");
const fatInput = document.getElementById("fatInput");

const saveCarbsBtn = document.getElementById("saveCarbsBtn");
const saveFatBtn = document.getElementById("saveFatBtn");

const gameTitle = document.querySelector(".game-title");

const sheepImg = new Image();
sheepImg.src = "/myfolder/gamePhotos/shadow.png";

const keys = {
  left: false,
  right: false,
  jump: false
};

const completedLogs = {
  food: false,
  activity: false,
  weight: false,
  workout: false,
  protein: false,
  bonus: false,
  carbs: false,
  fat: false
};

let activeLog = null;

const gravity = 0.7;
const friction = 0.82;
const spriteYOffset = 19;
const questXp = 30;
const bonusXp = 20;

const levels = {
  0: {
    title: "Level 0: Baseline",
    hudTitle: "LEVEL 0: BASELINE",
    xpKey: "baselineXp",
    requiredXp: 300,
    startX: 65,
    startY: 300,
    totalLogs: 2,
    platforms: [
      { x: 30, y: 410, width: 145, height: 22, label: "" },
      { x: 215, y: 345, width: 145, height: 22, label: "FOOD", logType: "food" },
      { x: 400, y: 280, width: 145, height: 22, label: "" },
      { x: 585, y: 345, width: 145, height: 22, label: "ACTIVITY", logType: "activity" },
      { x: 400, y: 170, width: 145, height: 22, label: "" }
    ]
  },

  1: {
    title: "Level 1: Consistency",
    hudTitle: "LEVEL 1: CONSISTENCY",
    xpKey: "consistencyXp",
    requiredXp: 300,
    startX: 75,
    startY: 365,
    totalLogs: 3,
    platforms: [
      { x: 40, y: 420, width: 150, height: 22, label: "" },
      { x: 245, y: 370, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
      { x: 470, y: 310, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
      { x: 690, y: 250, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
      { x: 500, y: 175, width: 145, height: 22, label: "" },
      { x: 170, y: 230, width: 145, height: 22, label: "" }
    ]
  },

  2: {
    title: "Level 2: Explore",
    hudTitle: "LEVEL 2: EXPLORE",
    xpKey: "exploreXp",
    requiredXp: 300,
    startX: 60,
    startY: 370,
    totalLogs: 3,
    platforms: [
      { x: 35, y: 425, width: 150, height: 22, label: "" },
      { x: 230, y: 355, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
      { x: 85, y: 260, width: 145, height: 22, label: "" },
      { x: 325, y: 220, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
      { x: 565, y: 285, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
      { x: 720, y: 190, width: 145, height: 22, label: "" },
      { x: 510, y: 125, width: 165, height: 22, label: "BONUS", logType: "bonus" }
    ]
  },

  3: {
  title: "Level 3: Program",
  hudTitle: "LEVEL 3: PROGRAM",
  xpKey: "programXp",
  requiredXp: 300,
  startX: 760,
  startY: 365,
  totalLogs: 3,
  platforms: [
    { x: 715, y: 420, width: 150, height: 22, label: "" },
    { x: 505, y: 365, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 300, y: 310, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 95, y: 255, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
    { x: 320, y: 185, width: 145, height: 22, label: "" },
    { x: 565, y: 145, width: 165, height: 22, label: "BONUS", logType: "bonus" },
    { x: 730, y: 245, width: 130, height: 22, label: "" }
  ]
},

4: {
  title: "Level 4: Nutrition",
  hudTitle: "LEVEL 4: NUTRITION",
  xpKey: "nutritionXp",
  requiredXp: 300,
  startX: 70,
  startY: 380,
  totalLogs: 6,
  platforms: [
    { x: 35, y: 435, width: 150, height: 22, label: "" },
    { x: 210, y: 375, width: 145, height: 22, label: ""},
    { x: 410, y: 330, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 620, y: 375, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 700, y: 255, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
    { x: 470, y: 205, width: 145, height: 22, label: "CARBS", logType: "carbs" },
    { x: 230, y: 155, width: 145, height: 22, label: "FAT", logType: "fat" },
    { x: 55, y: 245, width: 145, height: 22, label: "" }
  ]
},

5: {
  title: "Level 5: Discipline",
  hudTitle: "LEVEL 5: DISCIPLINE",
  xpKey: "disciplineXp",
  requiredXp: 300,
  startX: 735,
  startY: 380,
  totalLogs: 6,
  platforms: [
    { x: 710, y: 435, width: 150, height: 22, label: "" },
    { x: 520, y: 370, width: 165, height: 22, label: "" },
    { x: 315, y: 315, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 95, y: 260, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 300, y: 190, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
    { x: 510, y: 145, width: 145, height: 22, label: "CARBS", logType: "carbs" },
    { x: 710, y: 220, width: 145, height: 22, label: "FAT", logType: "fat" },
    { x: 470, y: 260, width: 165, height: 22, label: "BONUS", logType: "bonus" }
  ]
},

6: {
  title: "Level 6: Mastery",
  hudTitle: "LEVEL 6: MASTERY",
  xpKey: "masteryXp",
  requiredXp: 300,
  startX: 415,
  startY: 390,
  totalLogs: 6,
  platforms: [
    { x: 375, y: 445, width: 150, height: 22, label: "" },


    { x: 660, y: 385, width: 145, height: 22, label: "WEIGHT", logType: "weight" },

    { x: 280, y: 305, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 505, y: 305, width: 145, height: 22, label: "PROTEIN", logType: "protein" },

    { x: 120, y: 220, width: 145, height: 22, label: "CARBS", logType: "carbs" },
    { x: 645, y: 220, width: 145, height: 22, label: "FAT", logType: "fat" },

    { x: 360, y: 140, width: 165, height: 22, label: "BONUS", logType: "bonus" }
  ]
},

7: {
  title: "Level 7: Outlier",
  hudTitle: "LEVEL 7: OUTLIER",
  xpKey: "outlierXp",
  requiredXp: 300,
  startX: 70,
  startY: 390,
  totalLogs: 6,
  platforms: [
    { x: 35, y: 445, width: 150, height: 22, label: "" },

    { x: 250, y: 385, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 470, y: 385, width: 145, height: 22, label: "FAT", logType: "fat" },


    { x: 590, y: 285, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 350, y: 250, width: 145, height: 22, label: "CARBS", logType: "carbs" },
    { x: 120, y: 285, width: 145, height: 22, label: "PROTEIN", logType: "protein" },

    { x: 365, y: 135, width: 175, height: 22, label: "OUTLIER", logType: "bonus" }
  ]
}
};

function getLevelFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const level = Number(params.get("level") || localStorage.getItem("currentLevel") || 0);

  return levels[level] ? level : 0;
}

const currentLevelNumber = getLevelFromUrl();
const currentLevel = levels[currentLevelNumber];

if (gameTitle) {
  gameTitle.textContent = currentLevel.title;
}

const player = {
  x: currentLevel.startX,
  y: currentLevel.startY,
  width: 70,
  height: 55,
  velocityX: 0,
  velocityY: 0,
  speed: 4,
  jumpPower: 13,
  grounded: false,
  facingRight: true,
  currentPlatform: null
};

const platforms = currentLevel.platforms;

function getLevelXp() {
  return Number(localStorage.getItem(currentLevel.xpKey) || 0);
}

function addLevelXp(amount) {
  const currentXp = getLevelXp();
  const newXp = Math.min(currentXp + amount, currentLevel.requiredXp);

  localStorage.setItem(currentLevel.xpKey, newXp);
}

function getTodayDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
}

function getCalendarKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

function addLogToCalendar(logTitle, logText) {
  const calendarKey = getCalendarKey();
  const existingNote = localStorage.getItem(calendarKey) || "";

  const lines = existingNote
    .split("\n")
    .filter(line => line.trim() !== "");

  const filteredLines = lines.filter(line => !line.startsWith(logTitle + ":"));

  filteredLines.push(`${logTitle}: ${logText}`);

  localStorage.setItem(calendarKey, filteredLines.join("\n"));
}

function saveLog(storageKey, logObject) {
  const logs = JSON.parse(localStorage.getItem(storageKey) || "[]");

  const existingIndex = logs.findIndex(log => log.date === logObject.date);

  if (existingIndex !== -1) {
    logs[existingIndex] = logObject;
  } else {
    logs.push(logObject);
  }

  localStorage.setItem(storageKey, JSON.stringify(logs));
}

document.addEventListener("keydown", (e) => {
  if (activeLog) return;

  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    e.preventDefault();
    keys.jump = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    keys.jump = false;
  }
});

function openLogPanel(type) {
  activeLog = type;
  keys.left = false;
  keys.right = false;
  keys.jump = false;
  player.velocityX = 0;

  if (type === "food" && foodLogPanel) {
    foodLogPanel.classList.add("active");
    foodInput.focus();
  }

  if (type === "activity" && activityLogPanel) {
    activityLogPanel.classList.add("active");
    activityInput.focus();
  }

  if (type === "weight" && weightLogPanel) {
    weightLogPanel.classList.add("active");
    weightInput.focus();
  }

  if (type === "workout" && workoutLogPanel) {
    workoutLogPanel.classList.add("active");
    workoutInput.focus();
  }

  if (type === "protein" && proteinLogPanel) {
    proteinLogPanel.classList.add("active");
    proteinInput.focus();
  }

  if (type === "bonus" && bonusLogPanel) {
    bonusLogPanel.classList.add("active");
    bonusInput.focus();
  }
  if (type === "carbs" && carbsLogPanel) {
  carbsLogPanel.classList.add("active");
  carbsInput.focus();
}

if (type === "fat" && fatLogPanel) {
  fatLogPanel.classList.add("active");
  fatInput.focus();
}
}

function closeLogPanel() {
  activeLog = null;

  if (foodLogPanel) foodLogPanel.classList.remove("active");
  if (activityLogPanel) activityLogPanel.classList.remove("active");
  if (weightLogPanel) weightLogPanel.classList.remove("active");
  if (workoutLogPanel) workoutLogPanel.classList.remove("active");
  if (proteinLogPanel) proteinLogPanel.classList.remove("active");
  if (bonusLogPanel) bonusLogPanel.classList.remove("active");

  if (foodInput) foodInput.value = "";
  if (activityInput) activityInput.value = "";
  if (weightInput) weightInput.value = "";
  if (workoutInput) workoutInput.value = "";
  if (proteinInput) proteinInput.value = "";
  if (bonusInput) bonusInput.value = "";

  if (carbsLogPanel) carbsLogPanel.classList.remove("active");
if (fatLogPanel) fatLogPanel.classList.remove("active");

if (carbsInput) carbsInput.value = "";
if (fatInput) fatInput.value = "";

  canvas.focus();
}

function saveCarbsLog() {
  const carbs = parseFloat(carbsInput.value);

  if (isNaN(carbs)) {
    alert("Please enter your carbs.");
    return;
  }

  const today = getTodayDate();

  saveLog("carbsLogs", {
    date: today,
    carbs: carbs
  });

  addLogToCalendar("Carbs Log", carbs + "g");
  addLevelXp(questXp);
  completedLogs.carbs = true;
  closeLogPanel();
}

function saveFatLog() {
  const fat = parseFloat(fatInput.value);

  if (isNaN(fat)) {
    alert("Please enter your fat.");
    return;
  }

  const today = getTodayDate();

  saveLog("fatLogs", {
    date: today,
    fat: fat
  });

  addLogToCalendar("Fat Log", fat + "g");
  addLevelXp(questXp);
  completedLogs.fat = true;
  closeLogPanel();
}

function saveFoodLog() {
  const food = foodInput.value.trim();

  if (!food) {
    alert("Please enter what you ate today.");
    return;
  }

  const today = getTodayDate();

  saveLog("foodLogs", {
    date: today,
    food: food
  });

  addLogToCalendar("Food Log", food);
  addLevelXp(questXp);
  completedLogs.food = true;
  closeLogPanel();
}

function saveActivityLog() {
  const activity = activityInput.value.trim();

  if (!activity) {
    alert("Please enter your activity for today.");
    return;
  }

  const today = getTodayDate();

  saveLog("activityLogs", {
    date: today,
    activity: activity
  });

  addLogToCalendar("Activity Log", activity);
  addLevelXp(questXp);
  completedLogs.activity = true;
  closeLogPanel();
}

function saveWeightLog() {
  const weight = parseFloat(weightInput.value);

  if (isNaN(weight)) {
    alert("Please enter your weight.");
    return;
  }

  const today = getTodayDate();

  saveLog("weightLogs", {
    date: today,
    weight: weight
  });

  const weightEntries = JSON.parse(localStorage.getItem("weightEntries") || "[]");

  const existingWeightIndex = weightEntries.findIndex(entry => entry.date === today);

  const newWeightEntry = {
    date: today,
    label: today,
    weight: weight
  };

  if (existingWeightIndex !== -1) {
    weightEntries[existingWeightIndex] = newWeightEntry;
  } else {
    weightEntries.push(newWeightEntry);
  }

  localStorage.setItem("weightEntries", JSON.stringify(weightEntries));

  addLogToCalendar("Weight Log", weight + " lbs");
  addLevelXp(questXp);
  completedLogs.weight = true;
  closeLogPanel();
}

function saveWorkoutLog() {
  const workout = workoutInput.value.trim();

  if (!workout) {
    alert("Please enter your workout.");
    return;
  }

  const today = getTodayDate();

  saveLog("workoutLogs", {
    date: today,
    workout: workout
  });

  addLogToCalendar("Workout Log", workout);
  addLevelXp(questXp);
  completedLogs.workout = true;
  closeLogPanel();
}

function saveProteinLog() {
  const protein = parseFloat(proteinInput.value);

  if (isNaN(protein)) {
    alert("Please enter your protein.");
    return;
  }

  const today = getTodayDate();

  saveLog("proteinLogs", {
    date: today,
    protein: protein
  });

  addLogToCalendar("Protein Log", protein + "g");
  addLevelXp(questXp);
  completedLogs.protein = true;
  closeLogPanel();
}

function saveBonusLog() {
  const bonus = bonusInput.value.trim();

  if (!bonus) {
    alert("Please enter your bonus leverage point.");
    return;
  }

  const today = getTodayDate();

  saveLog("bonusLogs", {
    date: today,
    bonus: bonus
  });

  addLogToCalendar("Bonus Leverage Point", bonus);
  addLevelXp(bonusXp);
  completedLogs.bonus = true;
  closeLogPanel();
}

if (saveFoodBtn) saveFoodBtn.addEventListener("click", saveFoodLog);
if (saveActivityBtn) saveActivityBtn.addEventListener("click", saveActivityLog);
if (saveWeightBtn) saveWeightBtn.addEventListener("click", saveWeightLog);
if (saveWorkoutBtn) saveWorkoutBtn.addEventListener("click", saveWorkoutLog);
if (saveProteinBtn) saveProteinBtn.addEventListener("click", saveProteinLog);
if (saveBonusBtn) saveBonusBtn.addEventListener("click", saveBonusLog);

if (saveCarbsBtn) saveCarbsBtn.addEventListener("click", saveCarbsLog);
if (saveFatBtn) saveFatBtn.addEventListener("click", saveFatLog);

if (carbsInput) {
  carbsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCarbsLog();
    }
  });
}

if (fatInput) {
  fatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveFatLog();
    }
  });
}

if (foodInput) {
  foodInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveFoodLog();
    }
  });
}

if (activityInput) {
  activityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveActivityLog();
    }
  });
}

if (weightInput) {
  weightInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveWeightLog();
    }
  });
}

if (workoutInput) {
  workoutInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveWorkoutLog();
    }
  });
}

if (proteinInput) {
  proteinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveProteinLog();
    }
  });
}

if (bonusInput) {
  bonusInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveBonusLog();
    }
  });
}

function updatePlayer() {
  if (activeLog) return;

  if (keys.left) {
    player.velocityX = -player.speed;
    player.facingRight = false;
  }

  if (keys.right) {
    player.velocityX = player.speed;
    player.facingRight = true;
  }

  if (keys.jump && player.grounded) {
    player.velocityY = -player.jumpPower;
    player.grounded = false;
  }

  player.velocityY += gravity;
  player.x += player.velocityX;
  player.y += player.velocityY;

  player.velocityX *= friction;
  player.grounded = false;
  player.currentPlatform = null;

  platforms.forEach(platform => {
    const isColliding =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y;

    const falling = player.velocityY >= 0;
    const wasAbove = player.y + player.height - player.velocityY <= platform.y;

    if (isColliding && falling && wasAbove) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
      player.currentPlatform = platform;

      if (platform.logType && !completedLogs[platform.logType]) {
        openLogPanel(platform.logType);
      }
    }
  });

  if (player.x < 0) player.x = 0;

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y > canvas.height) {
    player.x = currentLevel.startX;
    player.y = currentLevel.startY;
    player.velocityX = 0;
    player.velocityY = 0;
    player.facingRight = true;
  }
}

function drawBackground() {
  ctx.fillStyle = "#f5f4f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(17,17,17,0.08)";
  ctx.lineWidth = 1;

  for (let y = 0; y < canvas.height; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPlatforms() {
  platforms.forEach(platform => {
    ctx.fillStyle = "#111111";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    ctx.fillStyle = "#ece9e6";
    ctx.fillRect(platform.x + 4, platform.y + 4, platform.width - 8, platform.height - 8);

    if (platform.label) {
      ctx.fillStyle = "#111111";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        platform.label,
        platform.x + platform.width / 2,
        platform.y - 10
      );
      ctx.textAlign = "left";
    }
  });
}

function drawPlayer() {
  ctx.save();

  if (sheepImg.complete) {
    if (!player.facingRight) {
      ctx.drawImage(
        sheepImg,
        player.x,
        player.y + spriteYOffset,
        player.width,
        player.height
      );
    } else {
      ctx.scale(-1, 1);

      ctx.drawImage(
        sheepImg,
        -player.x - player.width,
        player.y + spriteYOffset,
        player.width,
        player.height
      );
    }
  } else {
    ctx.fillStyle = "#111111";
    ctx.fillRect(player.x, player.y + spriteYOffset, player.width, player.height);
  }

  ctx.restore();
}

function getCompletedLogCount() {
  let count = 0;

  Object.keys(completedLogs).forEach(logType => {
    if (logType !== "bonus" && completedLogs[logType]) count++;
  });

  return count;
}

function drawHUD() {
  ctx.fillStyle = "#111111";
  ctx.font = "18px monospace";
  ctx.fillText(currentLevel.hudTitle, 20, 35);

  const completedCount = getCompletedLogCount();

  ctx.fillText("LOGS: " + completedCount + " / " + currentLevel.totalLogs, 20, 60);

  let yPosition = 90;

  Object.keys(completedLogs).forEach(logType => {
    if (completedLogs[logType]) {
      const earnedXp = logType === "bonus" ? bonusXp : questXp;
      ctx.fillText(logType.toUpperCase() + " LOGGED +" + earnedXp + "XP", 20, yPosition);
      yPosition += 25;
    }
  });
}

function gameLoop() {
  updatePlayer();
  drawBackground();
  drawPlatforms();
  drawPlayer();
  drawHUD();

  requestAnimationFrame(gameLoop);
}

gameLoop();
