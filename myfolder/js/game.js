(async () => {
  await window.auth.requireAuth();
})();

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

const foodLogPanel = document.getElementById("foodLogPanel");
const activityLogPanel = document.getElementById("activityLogPanel");
const weightLogPanel = document.getElementById("weightLogPanel");
const workoutLogPanel = document.getElementById("workoutLogPanel");
const proteinLogPanel = document.getElementById("proteinLogPanel");
const bonusLogPanel = document.getElementById("bonusLogPanel");
const hitMacrosLogPanel = document.getElementById( "hitMacrosLogPanel");

const foodInput = document.getElementById("foodInput");
const activityInput = document.getElementById("activityInput");
const weightInput = document.getElementById("weightInput");
const workoutInput = document.getElementById("workoutInput");
const proteinInput = document.getElementById("proteinInput");
const bonusInput = document.getElementById("bonusInput");
const hitMacrosInput = document.getElementById("hitMacrosInput");

const saveFoodBtn = document.getElementById("saveFoodBtn");
const saveActivityBtn = document.getElementById("saveActivityBtn");
const saveWeightBtn = document.getElementById("saveWeightBtn");
const skipWeightBtn = document.getElementById("skipWeightBtn");
const saveWorkoutBtn = document.getElementById("saveWorkoutBtn");
const saveProteinBtn = document.getElementById("saveProteinBtn");
const saveBonusBtn = document.getElementById("saveBonusBtn");
const saveHitMacrosBtn = document.getElementById( "saveHitMacrosBtn");

const carbsLogPanel = document.getElementById("carbsLogPanel");
const fatLogPanel = document.getElementById("fatLogPanel");

const carbsInput = document.getElementById("carbsInput");
const fatInput = document.getElementById("fatInput");

const saveCarbsBtn = document.getElementById("saveCarbsBtn");
const saveFatBtn = document.getElementById("saveFatBtn");

const selectedDateLabel = document.getElementById("selectedDateLabel");

const previousDateBtn = document.getElementById("previousDateBtn");

const nextDateBtn = document.getElementById("nextDateBtn");

const sheepImg = new Image();
sheepImg.src = "/myfolder/gamePhotos/shadow.png";

const keys = {
  left: false,
  right: false,
  jump: false
};

function pressLeft(e) {
  if (e) e.preventDefault();
  keys.left = true;
}

function releaseLeft(e) {
  if (e) e.preventDefault();
  keys.left = false;
}

function pressRight(e) {
  if (e) e.preventDefault();
  keys.right = true;
}

function releaseRight(e) {
  if (e) e.preventDefault();
  keys.right = false;
}

function pressJump(e) {
  if (e) e.preventDefault();
  keys.jump = true;
}

function releaseJump(e) {
  if (e) e.preventDefault();
  keys.jump = false;
}

if (leftBtn) {
  leftBtn.addEventListener("touchstart", pressLeft, { passive: false });
  leftBtn.addEventListener("touchend", releaseLeft, { passive: false });
  leftBtn.addEventListener("touchcancel", releaseLeft, { passive: false });
  leftBtn.addEventListener("mousedown", pressLeft);
  leftBtn.addEventListener("mouseup", releaseLeft);
  leftBtn.addEventListener("mouseleave", releaseLeft);
}

if (rightBtn) {
  rightBtn.addEventListener("touchstart", pressRight, { passive: false });
  rightBtn.addEventListener("touchend", releaseRight, { passive: false });
  rightBtn.addEventListener("touchcancel", releaseRight, { passive: false });
  rightBtn.addEventListener("mousedown", pressRight);
  rightBtn.addEventListener("mouseup", releaseRight);
  rightBtn.addEventListener("mouseleave", releaseRight);
}

if (jumpBtn) {
  jumpBtn.addEventListener("touchstart", pressJump, { passive: false });
  jumpBtn.addEventListener("touchend", releaseJump, { passive: false });
  jumpBtn.addEventListener("touchcancel", releaseJump, { passive: false });
  jumpBtn.addEventListener("mousedown", pressJump);
  jumpBtn.addEventListener("mouseup", releaseJump);
  jumpBtn.addEventListener("mouseleave", releaseJump);
}

const completedLogs = {
  food: false,
  activity: false,
  weight: false,
  workout: false,
  protein: false,
  bonus: false,
  carbs: false,
  fat: false,
  hit_macros: false
};

let activeLog = null;
let dismissedLogType = null;

const gravity = 0.7;
const friction = 0.82;
const spriteYOffset = 19;
const questXp = {
  food: 5,
  activity: 10,
  weight: 5,
  workout: 20,
  protein: 5,
  carbs: 5,
  fat: 5,
  bonus: 20,
  hit_macros: 5
};

const weeklyLogCaps = {
  food: 6,
  activity: 4,
  weight: 6,
  workout: 4,
  protein: 6,
  carbs: 6,
  fat: 6,
  hit_macros: 6
};

const levels = {
  0: {
    title: "Level 0: Baseline",
    hudTitle: "LEVEL 0: BASELINE",
    requiredXp: 70,
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
    requiredXp: 100,
    startX: 75,
    startY: 365,
    totalLogs: 3,
    platforms: [
      { x: 40, y: 420, width: 150, height: 22, label: "" },
      { x: 245, y: 370, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
      { x: 470, y: 310, width: 160, height: 22, label: "ACTIVITY", logType: "activity" },
      { x: 690, y: 250, width: 145, height: 22, label: ""},
      { x: 500, y: 175, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
      { x: 170, y: 230, width: 145, height: 22, label:  "" }
    ]
  },

  2: {
    title: "Level 2: Explore",
    hudTitle: "LEVEL 2: EXPLORE",
    requiredXp: 280,
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
      { x: 510, y: 125, width: 165, height: 22, label: "" },
      { x: 720, y: 50, width: 145, height: 22, label: "" }
    ]
  },

  3: {
  title: "Level 3: Program",
  hudTitle: "LEVEL 3: PROGRAM",
  requiredXp: 280,
  startX: 760,
  startY: 365,
  totalLogs: 3,
  platforms: [
    { x: 715, y: 420, width: 150, height: 22, label: "" },
    { x: 505, y: 365, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 300, y: 310, width: 160, height: 22, label: "" },
    { x: 95, y: 255, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
    { x: 150, y: 370, width: 145, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 320, y: 185, width: 145, height: 22, label: "" },
    { x: 565, y: 145, width: 165, height: 22, label: "" },
    { x: 730, y: 245, width: 130, height: 22, label: "" }
  ]
},

4: {
  title: "Level 4: Discipline",
  hudTitle: "LEVEL 4: DISCIPLINE",
  requiredXp: 280,
  startX: 735,
  startY: 380,
  totalLogs: 3,
  platforms: [
    { x: 710, y: 435, width: 150, height: 22, label: "" },
    { x: 520, y: 370, width: 165, height: 22, label: "" },
    { x: 315, y: 315, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 95, y: 260, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 300, y: 190, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
    { x: 510, y: 145, width: 145, height: 22, label: "", },
    { x: 710, y: 220, width: 145, height: 22, label: "", }

  ]
},

5: {
  title: "Level 5: Nutrition",
  hudTitle: "LEVEL 5: NUTRITION",
  requiredXp: 400,
  startX: 70,
  startY: 380,
  totalLogs: 5,
  platforms: [
    { x: 35, y: 435, width: 150, height: 22, label: "" },
    { x: 210, y: 375, width: 145, height: 22, label: ""},
    { x: 410, y: 330, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 620, y: 375, width: 160, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 690, y: 255, width: 145, height: 22, label: "PROTEIN", logType: "protein" },
    { x: 470, y: 205, width: 145, height: 22, label: "CARBS", logType: "carbs" },
    { x: 230, y: 155, width: 145, height: 22, label: "FAT", logType: "fat" },
    { x: 55, y: 245, width: 145, height: 22, label: "" }
  ]
},

6: {
  title: "Level 6: Vitality",
  hudTitle: "LEVEL 6: VITALITY",
  requiredXp: 400,
  startX: 415,
  startY: 390,
  totalLogs: 5,
  platforms: [

    // Start
    { x: 375, y: 445, width: 150, height: 22, label: "" },

    // First tier
    { x: 190, y: 355, width: 145, height: 22, label: "WEIGHT", logType: "weight" },
    { x: 565, y: 355, width: 145, height: 22, label: "WORKOUT", logType: "workout" },

    // Second tier
    { x: 120, y: 255, width: 145, height: 22, label: "CARBS", logType: "carbs" },
    { x: 645, y: 255, width: 145, height: 22, label: "FAT", logType: "fat" },

    // Middle platform
    { x: 375, y: 260, width: 145, height: 22, label: "PROTEIN", logType: "protein" },

    // Peak

    { x: 250, y: 150, width: 165, height: 22, label: "" },
    { x: 360, y: 50, width: 165, height: 22, label: "", }
  ]
},

7: {
  title: "Level 7: Outlier",
  hudTitle: "LEVEL 7: OUTLIER",
  requiredXp: 560,
  startX: 60,
  startY: 390,
  totalLogs: 3,
  platforms: [
    // Start
    { x: 35, y: 445, width: 150, height: 22, label: "" },

    // Lower route
    { x: 230, y: 395, width: 130, height: 22, label: "" },
    { x: 420, y: 430, width: 145, height: 22, label: "FOOD", logType: "food" },
    { x: 625, y: 390, width: 130, height: 22, label: "" },

    // Right climb
    { x: 735, y: 305, width: 145, height: 22, label: "WORKOUT", logType: "workout" },
    { x: 575, y: 250, width: 145, height: 22, label: "" },

    // Middle path
    { x: 355, y: 295, width: 145, height: 22, label: "" },
    { x: 150, y: 250, width: 145, height: 22, label: "HIT MACROS", logType: "hit_macros" },

    // Empty challenge jumps

    { x: 245, y: 140, width: 120, height: 22, label: "" },
    { x: 535, y: 150, width: 120, height: 22, label: "" },
    { x: 735, y: 180, width: 120, height: 22, label: "" },

    // Final destination
    { x: 365, y: 80, width: 175, height: 22, label: "", }
  ]
}
};

function getLevelFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const level = Number(params.get("level") || localStorage.getItem("currentLevel") || 0);

  return levels[level] ? level : 0;
}

let currentLevelNumber = getLevelFromUrl();
let currentLevel = levels[currentLevelNumber];

const quickLogGrid = document.getElementById("quickLogGrid");

const logLabels = {
  food: "Track Food",
  activity: "Track Activity",
  weight: "Log Weight",
  workout: "Log Workout",
  protein: "Log Protein",
  carbs: "Log Carbs",
  fat: "Log Fat",
  hit_macros: "Hit Macros",
  bonus: "Bonus Point"
};

function getRequiredLogsForLevel() {
  const requiredLogs = [];

  currentLevel.platforms.forEach(platform => {
    if (platform.logType && !requiredLogs.includes(platform.logType)) {
      requiredLogs.push(platform.logType);
    }
  });

  return requiredLogs;
}

function renderQuickLogButtons() {
  if (!quickLogGrid) return;

  quickLogGrid.innerHTML = "";

  const requiredLogs = getRequiredLogsForLevel();

  requiredLogs.forEach(logType => {
    const button = document.createElement("button");

    button.textContent = logLabels[logType] || logType;
    button.addEventListener("click", () => {
      openLogPanel(logType);
    });

    quickLogGrid.appendChild(button);
  });
}

const cancelLogButtons =
  document.querySelectorAll(
    ".cancel-log-button"
  );

cancelLogButtons.forEach(button => {
  button.addEventListener(
    "click",
    () => {
      dismissedLogType = activeLog;
      closeLogPanel();
    }
  );
});



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

async function loadSelectedDateStatus() {
  const user =
    await window.auth.getUser();

  if (!user) {
    return;
  }

  /*
    Reset today's visual completion state.
  */
  Object.keys(completedLogs)
    .forEach(logType => {
      completedLogs[logType] = false;
    });

  const requiredLogs =
    getRequiredLogsForLevel();

  if (requiredLogs.length === 0) {
    return;
  }

  const { data, error } =
    await window.auth.supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq(
        "log_date",
        getSelectedDate()
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Could not load selected date:",
      error
    );

    return;
  }

  if (!data) {
    return;
  }

  requiredLogs.forEach(logType => {
    const value = data[logType];

    completedLogs[logType] =
      value !== null &&
      value !== undefined &&
      value !== "";
  });
}

const platforms = currentLevel.platforms;

async function addLevelXp(amount) {
  const user = await window.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data: progress, error: readError } =
    await window.auth.supabase
      .from("game_progress")
      .select("current_level, current_xp")
      .eq("user_id", user.id)
      .single();

  if (readError) {
    throw readError;
  }

  let newLevel = Number(progress.current_level);
  let newXp = Number(progress.current_xp) + amount;

  const levelRequiredXp =
    levels[newLevel]?.requiredXp ?? 300;

  // Level up and carry extra XP into the next level.
  if (newXp >= levelRequiredXp && newLevel < 7) {
    newXp -= levelRequiredXp;
    newLevel += 1;
  }

  // Level 7 is the maximum level.
  if (newLevel === 7) {
    const maxXp = levels[7].requiredXp;
    newXp = Math.min(newXp, maxXp);
  }

  const { data: updatedProgress, error: updateError } =
    await window.auth.supabase
      .from("game_progress")
      .update({
        current_level: newLevel,
        current_xp: newXp,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)
      .select("current_level, current_xp")
      .single();

  if (updateError) {
    throw updateError;
  }

  currentLevelNumber = updatedProgress.current_level;
  currentLevel = levels[currentLevelNumber];

  localStorage.setItem(
    "currentLevel",
    String(currentLevelNumber)
  );

  return updatedProgress;
}

function getTodayDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
}

let selectedDate = getTodayDate();

function dateStringToLocalDate(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}

function getSelectedDate() {
  return selectedDate;
}

function formatSelectedDateLabel() {
  if (!selectedDateLabel) {
    return;
  }

  if (selectedDate === getTodayDate()) {
    selectedDateLabel.textContent = "Today";
    return;
  }

  const date = dateStringToLocalDate(selectedDate);

  selectedDateLabel.textContent =
    date.toLocaleDateString(
      undefined,
      {
        weekday: "short",
        month: "short",
        day: "numeric"
      }
    );
}

function getEarliestEditableDate() {
  const date = new Date();

  date.setDate(date.getDate() - 7);

  return formatLocalDate(date);
}


function updateDateNavigation() {
  formatSelectedDateLabel();

  const today =
    getTodayDate();

  const earliestDate =
    getEarliestEditableDate();

  if (nextDateBtn) {
    nextDateBtn.disabled =
      selectedDate >= today;
  }

  if (previousDateBtn) {
    previousDateBtn.disabled =
      selectedDate <= earliestDate;
  }
}

async function changeSelectedDate(dayChange) {
  const currentDate =
    dateStringToLocalDate(selectedDate);

  currentDate.setDate(
    currentDate.getDate() + dayChange
  );

  const newDate =
    formatLocalDate(currentDate);

  const today =
    getTodayDate();

  const earliestDate =
    getEarliestEditableDate();

  // No future dates.
  if (newDate > today) {
    return;
  }

  // No dates older than 7 days.
  if (newDate < earliestDate) {
    return;
  }

  selectedDate = newDate;

  updateDateNavigation();

  await loadSelectedDateStatus();
}


function formatLocalDate(date) {
  const localDate = new Date(date);

  localDate.setMinutes(
    localDate.getMinutes() -
    localDate.getTimezoneOffset()
  );

  return localDate
    .toISOString()
    .split("T")[0];
}

function getWeekRangeForDate(
  dateString = getSelectedDate()
) {
  const selected =
    dateStringToLocalDate(dateString);

  const dayOfWeek =
    selected.getDay();

  const daysSinceMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1;

  const monday =
    new Date(selected);

  monday.setDate(
    selected.getDate() -
    daysSinceMonday
  );

  const sunday =
    new Date(monday);

  sunday.setDate(
    monday.getDate() + 6
  );

  return {
    startDate:
      formatLocalDate(monday),

    endDate:
      formatLocalDate(sunday)
  };
}

async function getWeeklyLogCount(
  userId,
  fieldName
) {
const {
  startDate,
  endDate
} = getWeekRangeForDate(
  getSelectedDate()
);

  const {
    count,
    error
  } = await window.auth.supabase
    .from("daily_logs")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("user_id", userId)
    .gte("log_date", startDate)
    .lte("log_date", endDate)
    .not(fieldName, "is", null);

  if (error) {
    throw error;
  }

  return count || 0;
}

function getCalendarKey(
  dateString = getSelectedDate()
) {
  const date =
    dateStringToLocalDate(dateString);

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

async function saveDailyLogField(fieldName, fieldValue) {
  const user = await window.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const logDate = getSelectedDate();

  // Check whether this field was already completed today.
  const { data: existingLog, error: readError } =
    await window.auth.supabase
      .from("daily_logs")
      .select(fieldName)
      .eq("user_id", user.id)
      .eq("log_date", logDate)
      .maybeSingle();

  if (readError) {
    throw readError;
  }

  const wasAlreadyCompleted =
    existingLog?.[fieldName] !== null &&
    existingLog?.[fieldName] !== undefined;

  const { data, error } = await window.auth.supabase
    .from("daily_logs")
    .upsert(
      {
        user_id: user.id,
        log_date: logDate,
        [fieldName]: fieldValue,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "user_id,log_date"
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    dailyLog: data,
    isNewCompletion: !wasAlreadyCompleted
  };
}
async function saveQuestEntry({
  fieldName,
  fieldValue,
  storageKey,
  localLog,
  calendarTitle,
  calendarText,
  xpAmount,
  completedKey
}) {
  const logDate = getSelectedDate();

  try {
    const { isNewCompletion } =
      await saveDailyLogField(
        fieldName,
        fieldValue
      );

    // Keep these temporarily for your current
    // dashboard/calendar/progress functionality.
    saveLog(storageKey, {
      date: logDate,
      ...localLog
    });

    addLogToCalendar(
      calendarTitle,
      calendarText
    );

if (isNewCompletion) {
  const user =
    await window.auth.getUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const weeklyCap =
    weeklyLogCaps[fieldName];

  /*
    The log has already been saved, so this count
    includes today's new entry.
  */
  const weeklyCount =
    await getWeeklyLogCount(
      user.id,
      fieldName
    );

  if (
    weeklyCap !== undefined &&
    weeklyCount <= weeklyCap
  ) {
    await addLevelXp(xpAmount);

    console.log(
      `${fieldName}: ${weeklyCount}/${weeklyCap} XP days used`
    );
  } else if (
    weeklyCap !== undefined
  ) {
    console.log(
      `${fieldName} saved, but its weekly XP cap has been reached.`
    );
  } else {
    /*
      Temporary fallback for logs such as Bonus
      that do not currently have a weekly cap.
    */
    await addLevelXp(xpAmount);
  }
}

    completedLogs[completedKey] = true;
    closeLogPanel();

    return true;

  } catch (error) {
    console.error(
      `Could not save ${fieldName} log:`,
      error
    );

    alert(
      `Your ${fieldName} log could not be fully saved. Please try again.`
    );

    return false;
  }
}

function saveLog(storageKey, logObject) {
  const logs = JSON.parse(
    localStorage.getItem(storageKey) || "[]"
  );

  const existingIndex = logs.findIndex(
    log => log.date === logObject.date
  );

  const isNewLog = existingIndex === -1;

  if (isNewLog) {
    logs.push(logObject);
  } else {
    logs[existingIndex] = logObject;
  }

  localStorage.setItem(
    storageKey,
    JSON.stringify(logs)
  );

  return isNewLog;
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

if (
  type === "hit_macros" &&
  hitMacrosLogPanel
) {
  hitMacrosLogPanel.classList.add(
    "active"
  );

  hitMacrosInput.focus();
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
  if (hitMacrosLogPanel) { hitMacrosLogPanel.classList.remove("active");
}

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

if (hitMacrosInput) {hitMacrosInput.checked = false;}

  canvas.focus();
}

async function saveCarbsLog() {
  const carbs = parseFloat(
    carbsInput.value
  );

  if (isNaN(carbs)) {
    alert("Please enter your carbs.");
    return;
  }

  await saveQuestEntry({
    fieldName: "carbs",
    fieldValue: carbs,
    storageKey: "carbsLogs",
    localLog: {
      carbs: carbs
    },
    calendarTitle: "Carbs Log",
    calendarText: carbs + "g",
    xpAmount: questXp.carbs,
    completedKey: "carbs"
  });
}

async function saveFatLog() {
  const fat = parseFloat(
    fatInput.value
  );

  if (isNaN(fat)) {
    alert("Please enter your fat.");
    return;
  }

  await saveQuestEntry({
    fieldName: "fat",
    fieldValue: fat,
    storageKey: "fatLogs",
    localLog: {
      fat: fat
    },
    calendarTitle: "Fat Log",
    calendarText: fat + "g",
    xpAmount: questXp.fat,
    completedKey: "fat"
  });
}

async function saveFoodLog() {
  const food = foodInput.value.trim();

  if (!food) {
    alert("Please enter what you ate today.");
    return;
  }

  await saveQuestEntry({
    fieldName: "food",
    fieldValue: food,
    storageKey: "foodLogs",
    localLog: {
      food: food
    },
    calendarTitle: "Food Log",
    calendarText: food,
    xpAmount: questXp.food,
    completedKey: "food"
  });
}

async function saveActivityLog() {
  const activity =
    activityInput.value.trim();

  if (!activity) {
    alert(
      "Please enter your activity for today."
    );

    return;
  }

  await saveQuestEntry({
    fieldName: "activity",
    fieldValue: activity,
    storageKey: "activityLogs",
    localLog: {
      activity: activity
    },
    calendarTitle: "Activity Log",
    calendarText: activity,
    xpAmount: questXp.activity,
    completedKey: "activity"
  });
}

async function saveWeightLog() {
  const weight = parseFloat(
    weightInput.value
  );

  if (isNaN(weight)) {
    alert("Please enter your weight.");
    return;
  }

  const saved = await saveQuestEntry({
    fieldName: "weight",
    fieldValue: weight,
    storageKey: "weightLogs",
    localLog: {
      weight: weight
    },
    calendarTitle: "Weight Log",
    calendarText: weight + " lbs",
    xpAmount: questXp.weight,
    completedKey: "weight"
  });

  if (!saved) {
    return;
  }

  // Keep the existing local weight chart working
  // until progress.html is converted to Supabase.
  const logDate = getSelectedDate();

  const weightEntries = JSON.parse(
    localStorage.getItem(
      "weightEntries"
    ) || "[]"
  );

  const existingWeightIndex =
    weightEntries.findIndex(
      entry => entry.date === logDate
    );

const newWeightEntry = {
  date: logDate,
  label: logDate,
  weight: weight
};

  if (existingWeightIndex !== -1) {
    weightEntries[existingWeightIndex] =
      newWeightEntry;
  } else {
    weightEntries.push(newWeightEntry);
  }

  localStorage.setItem(
    "weightEntries",
    JSON.stringify(weightEntries)
  );
}


async function skipWeightLog() {
  const logDate = getSelectedDate();

  const weightLogs = JSON.parse(
    localStorage.getItem("weightLogs") || "[]"
  );

  const alreadyCompleted =
    weightLogs.some(
      log => log.date === logDate
    );

  if (alreadyCompleted) {
    completedLogs.weight = true;
    closeLogPanel();
    return;
  }

  /*
    Record ONLY that the Weight quest
    was acknowledged for this date.
    No bodyweight value is stored.
  */
  saveLog("weightLogs", {
    date: logDate,
    skipped: true
  });

  await addLevelXp(
    questXp.weight
  );

  completedLogs.weight = true;

  closeLogPanel();
}

async function saveWorkoutLog() {
  const workout = workoutInput.value.trim();

  if (!workout) {
    alert("Please enter your workout.");
    return;
  }

  await saveQuestEntry({
    fieldName: "workout",
    fieldValue: workout,
    storageKey: "workoutLogs",
    localLog: {
      workout: workout
    },
    calendarTitle: "Workout Log",
    calendarText: workout,
    xpAmount: questXp.workout,
    completedKey: "workout"
  });
}

async function saveProteinLog() {
  const protein = parseFloat(
    proteinInput.value
  );

  if (isNaN(protein)) {
    alert("Please enter your protein.");
    return;
  }

  await saveQuestEntry({
    fieldName: "protein",
    fieldValue: protein,
    storageKey: "proteinLogs",
    localLog: {
      protein: protein
    },
    calendarTitle: "Protein Log",
    calendarText: protein + "g",
    xpAmount: questXp.protein,
    completedKey: "protein"
  });
}

async function saveHitMacrosLog() {
  if (!hitMacrosInput.checked) {
    alert(
      "Check the box if you hit your macro goals today."
    );

    return;
  }

  await saveQuestEntry({
    fieldName: "hit_macros",
    fieldValue: true,
    storageKey: "hitMacrosLogs",
    localLog: {
      hitMacros: true
    },
    calendarTitle: "Hit Macros",
    calendarText: "Yes",
    xpAmount: questXp.hit_macros,
    completedKey: "hit_macros"
  });
}

async function saveBonusLog() {
  const bonus = bonusInput.value.trim();

  if (!bonus) {
    alert(
      "Please enter your bonus leverage point."
    );
    return;
  }

  await saveQuestEntry({
    fieldName: "bonus",
    fieldValue: bonus,
    storageKey: "bonusLogs",
    localLog: {
      bonus: bonus
    },
    calendarTitle:
      "Bonus Leverage Point",
    calendarText: bonus,
    xpAmount: questXp.bonus,
    completedKey: "bonus"
  });
}

if (saveFoodBtn) saveFoodBtn.addEventListener("click", saveFoodLog);
if (saveActivityBtn) saveActivityBtn.addEventListener("click", saveActivityLog);
if (saveWeightBtn) saveWeightBtn.addEventListener("click", saveWeightLog);
if (skipWeightBtn) {skipWeightBtn.addEventListener("click",skipWeightLog );
}
if (saveWorkoutBtn) saveWorkoutBtn.addEventListener("click", saveWorkoutLog);
if (saveProteinBtn) saveProteinBtn.addEventListener("click", saveProteinLog);
if (saveBonusBtn) saveBonusBtn.addEventListener("click", saveBonusLog);

if (saveCarbsBtn) saveCarbsBtn.addEventListener("click", saveCarbsLog);
if (saveFatBtn) saveFatBtn.addEventListener("click", saveFatLog);
if (saveHitMacrosBtn) {saveHitMacrosBtn.addEventListener("click",saveHitMacrosLog);
}

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

     if (
  platform.logType &&
  !completedLogs[platform.logType] &&
  dismissedLogType !== platform.logType
) {
  openLogPanel(platform.logType);
}
    }
  });

  if (
  dismissedLogType &&
  player.currentPlatform?.logType !== dismissedLogType
) {
  dismissedLogType = null;
}

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
      const earnedXp = questXp[logType] || 0;
const displayLogType =logType.replaceAll("_", " ").toUpperCase();

ctx.fillText(
  displayLogType +
  " LOGGED +" +
  earnedXp +
  "XP",
  20,
  yPosition
);
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

const toggle = document.getElementById("gameModeToggle");
const gameModeContent = document.getElementById("gameModeContent");
const quickLogMode = document.getElementById("quickLogMode");

function updateGameModeView() {
  const isGameMode = toggle.checked;

  localStorage.setItem("gameMode", isGameMode);

  if (isGameMode) {
    gameModeContent.style.display = "block";
    quickLogMode.style.display = "none";
  } else {
    gameModeContent.style.display = "none";
    quickLogMode.style.display = "block";

    keys.left = false;
    keys.right = false;
    keys.jump = false;
    player.velocityX = 0;
    player.velocityY = 0;
  }
}

if (previousDateBtn) {
  previousDateBtn.addEventListener(
    "click",
    () => {
      changeSelectedDate(-1);
    }
  );
}

if (nextDateBtn) {
  nextDateBtn.addEventListener(
    "click",
    () => {
      changeSelectedDate(1);
    }
  );
}

toggle.checked = localStorage.getItem("gameMode") !== "false";

toggle.addEventListener("change", updateGameModeView);

updateDateNavigation();
loadSelectedDateStatus();

updateGameModeView();
renderQuickLogButtons();
