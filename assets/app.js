const $ = (selector) => document.querySelector(selector);

const APP_VERSION = 3;
const todayKey = new Date().toISOString().slice(0, 10);
const SETTINGS_KEY = "breaking-app-settings";

const appSettings = {
  mode: "formal",
  ...loadSettings()
};

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
}

const storage = {
  key(date = todayKey) {
    return `breaking-full-card-${date}`;
  },
  load(date = todayKey) {
    const raw = localStorage.getItem(this.key(date));
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (data.version !== APP_VERSION) return { ...defaultState(), notes: data.notes || "" };
      return { ...defaultState(), ...data, version: data.version || 1 };
    } catch {
      return null;
    }
  },
  save(data, date = todayKey) {
    localStorage.setItem(this.key(date), JSON.stringify({ ...data, version: APP_VERSION }));
  }
};

const plans = [
  { title: "周日｜恢复日", restDay: true, modules: ["recovery"] },
  { title: "周一｜结构控制日", modules: ["warmupBasic", "knee", "core", "freeze", "handstand", "stretch"] },
  { title: "周二｜课程输出日", modules: ["courseOutput"] },
  { title: "周三｜Freestyle主训练日", modules: ["warmupGroove", "toprock", "freestyleMain", "freezeFlow", "cooldown"] },
  { title: "周四｜灵活训练日", modules: ["flexDay"] },
  { title: "周五｜Swipe专项日", modules: ["swipeWarmup", "supportCare", "singleSupport", "swipeSkill", "swipeConnect", "shortStretch"] },
  { title: "周六｜舞蹈整合日", modules: ["warmupGroove", "roundTraining", "problemFix", "creative", "shortCooldown"] }
];

const corePools = [
  [
    ["动态卷腹", "腰贴住。脚踩地、屈膝悬空、直腿悬空按状态选。"],
    ["香蕉卷腹", "身体折叠。摸膝盖轻，摸脚踝难，手伸远更难。"],
    ["交叉卷腹", "肩找对侧膝。骨盆别晃，不用脖子拉。"]
  ],
  [
    ["侧卷腹", "侧腰卷起。屈膝轻，伸直难，可加左右打拳。"],
    ["侧平板冲拳 / 伸腿", "肩顶住，髋别掉。伸出去停 1 秒。"],
    ["侧腰弹动", "弹动小而稳。腰侧发力，不塌肩。"]
  ],
  [
    ["俄罗斯转体", "骨盆稳，胸腔转。脚点地轻，悬空难。"],
    ["直臂 8 字画圈", "手臂伸远画 8 字。核心别散。"],
    ["交替脚点地转体", "转体配脚点地。左右节奏稳。"]
  ],
  [
    ["四足对侧抬起", "手推地，背平。抬起后停 1 秒。"],
    ["四足指南针", "膝盖低，移动小。骨盆别翻。"],
    ["平板 / 直板", "肩在手腕上。收肋骨，不塌腰。"]
  ],
  [
    ["蜘蛛跳 + 半程波比", "落地轻。回深蹲时膝盖别内扣。"],
    ["登山跑 / 左右跳", "核心收住。脚轻落地，屁股别翘太高。"],
    ["肘支撑前后跳", "抬屁股前后跳。腹部收住，不砸腰。"]
  ],
  [
    ["趴下自由式", "Y 字抬胸夹背，大腿交替抬起。不耸肩。"],
    ["直臂后坐伸腿", "直臂后坐，向前伸单侧腿。像 footwork 但更稳。"],
    ["反四足摸脚踝", "髋顶住。单腿踢起，对侧手摸脚踝。"]
  ]
];

const defs = {
  warmupBasic: {
    title: "热身",
    time: "10 分钟",
    note: "Groove、Toprock、关节活动，先激活身体。",
    checks: ["Groove", "Toprock", "关节活动", "身体热起来"]
  },
  warmupGroove: {
    title: "热身",
    time: "10 分钟",
    note: "Groove + Toprock，节奏先在线。",
    checks: ["Groove", "Toprock", "身体松开"]
  },
  knee: {
    title: "膝盖训练",
    time: "约 10 分钟",
    note: "维持膝关节稳定。疼痛不是训练目标。",
    steps: [
      ["墙静蹲", 45, "45s × 2", "背贴墙，膝盖对脚尖，脚掌稳定。酸可以，刺痛停止。", 2, "time"],
      ["离心深蹲", 0, "8 次 × 2", "下蹲 4 秒。慢、稳、膝盖不内扣，起身不抢。", 2, "count"]
    ]
  },
  handstand: {
    title: "倒立结构",
    time: "约 15 分钟",
    note: "开肩、肩上提、Hollow 结构，避免香蕉倒立。",
    steps: [
      ["墙倒立", 45, "30-45s × 2", "手推地，肩上提，收肋骨，腿向上延伸。", 2, "time"],
      ["胸贴墙倒立", 45, "30-45s × 2", "胸贴墙找直线，臀腿收紧，不塌腰。", 2, "time"],
      ["肩胛上推", 0, "10-15 × 3", "手臂伸直，用肩胛把身体顶高，不耸脖子。", 3, "count"],
      ["靠墙找直线", 45, "45s × 2", "肩、肋骨、骨盆、脚尖排成一条线。", 2, "time"]
    ]
  },
  core: {
    title: "核心训练",
    time: "30 分钟",
    note: "6 动作 × 4 组。右滑推进，时间不足会补组。"
  },
  freeze: {
    title: "Freeze训练",
    time: "25 分钟",
    note: "重点不是撑很久，而是进得去、停得住、出得来。",
    checks: ["Baby Freeze", "Turtle Freeze", "Shoulder Freeze", "Three Point Freeze", "Entry", "Exit", "腿型变化"]
  },
  stretch: {
    title: "拉伸",
    time: "10 分钟",
    note: "肩、胸椎、髋。",
    checks: ["肩", "胸椎", "髋"]
  },
  courseOutput: {
    title: "课程输出",
    time: "课堂 + 围圈",
    note: "把课堂输入变成自己的动作，只记重点，不贪多。",
    checks: ["记录今天学到的重点", "Toprock 开场", "课堂内容出现", "Freeze 出现", "完成围圈输出", "可选 Swipe 尝试"]
  },
  toprock: {
    title: "Toprock专项",
    time: "15 分钟",
    note: "节奏、Groove、停顿。",
    checks: ["节奏", "Groove", "停顿", "方向变化"]
  },
  freestyleMain: {
    title: "Freestyle训练",
    time: "40 分钟",
    note: "当前第一优先级：提高动作调用速度和连接能力。",
    checks: ["只跳 Toprock", "Footwork 主导", "必须 Freeze", "完全自由", "循环完成", "卡顿后继续接"]
  },
  freezeFlow: {
    title: "Freeze融入",
    time: "15 分钟",
    note: "Freeze 是转场，不是摆造型。",
    checks: ["Footwork → Freeze", "Freeze → Footwork", "进入干净", "退出干净"]
  },
  cooldown: {
    title: "放松",
    time: "10 分钟",
    note: "降低兴奋度，恢复呼吸。",
    checks: ["呼吸恢复", "腿部放松", "肩背放松"]
  },
  flexDay: {
    title: "灵活训练",
    time: "30-45 分钟",
    note: "根据身体状态选择恢复或轻技术，不追强度。",
    checks: ["方案 A：恢复", "拉伸 / 活动度", "Groove", "方案 B：轻技术", "Footwork", "Freeze 进出", "轻量 Swipe"]
  },
  swipeWarmup: {
    title: "Swipe热身",
    time: "10 分钟",
    note: "肩、手腕、髋优先。",
    checks: ["肩", "手腕", "髋", "身体热起来"]
  },
  supportCare: {
    title: "支撑维护",
    time: "15 分钟",
    note: "维持 Swipe 需要的结构。",
    steps: [
      ["Hollow Hold", 30, "30s × 2", "收肋骨，腰背稳定，不塌。", 2, "time"],
      ["Side Plank", 30, "30s × 2 / 侧", "肩顶住，髋别掉。", 4, "time"],
      ["墙静蹲", 45, "45s × 2", "膝盖对脚尖，脚掌稳定。", 2, "time"]
    ]
  },
  singleSupport: {
    title: "单侧支撑",
    time: "15 分钟",
    note: "当前 Swipe 最大弱点：减少掉胯。",
    checks: ["单手支撑", "髋保持高度", "重心转移", "支撑侧稳定", "掉胯减少"]
  },
  swipeSkill: {
    title: "Swipe专项",
    time: "35 分钟",
    note: "目标是建立结构，不是追求连续 Swipe。",
    checks: ["半圈 Swipe", "Swipe 落地停顿", "Swipe Entry", "Swipe Landing", "落地直接进发力位", "不二次调整"]
  },
  swipeConnect: {
    title: "连接训练",
    time: "10 分钟",
    note: "Swipe 进入舞蹈连接。",
    checks: ["Swipe → Freeze", "Swipe → Footwork", "Swipe → 停顿"]
  },
  shortStretch: {
    title: "拉伸",
    time: "5 分钟",
    note: "肩、髋、手腕放松。",
    checks: ["肩", "髋", "手腕"]
  },
  roundTraining: {
    title: "Round训练",
    time: "50 分钟",
    note: "6-8 轮。完整优先，不追难度。",
    checks: ["6-8 轮", "Toprock", "Footwork", "Freeze", "可选 Swipe", "每轮完整"]
  },
  problemFix: {
    title: "问题修正",
    time: "15 分钟",
    note: "每次只修一个问题。",
    checks: ["选择一个问题", "Freeze", "Swipe", "Footwork", "记录下次继续修什么"]
  },
  creative: {
    title: "创作时间",
    time: "10 分钟",
    note: "增加个人风格。",
    checks: ["新入口", "新转场", "新组合"]
  },
  shortCooldown: {
    title: "放松",
    time: "5 分钟",
    note: "收尾恢复。",
    checks: ["呼吸恢复", "简单拉伸"]
  },
  recovery: {
    title: "恢复日",
    time: "自由",
    note: "不安排高强度训练，恢复身体和灵感。",
    checks: ["拉伸", "散步", "听音乐", "看 Battle", "看教学"]
  }
};

function defaultState() {
  return {
    version: APP_VERSION,
    startedAt: 0,
    finishedAt: 0,
    total: 0,
    modules: {},
    notes: "",
    current: null
  };
}

let state = storage.load() || defaultState();
let timer = null;
let timerToken = 0;
let tipTimer = null;
let dragStart = 0;
let dragging = false;
let suppressClick = false;
let pending = null;
let cardAnchor = "center";

function save() {
  state.notes = $("#notes").value;
  storage.save(state);
}

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function effectiveSeconds(sec, phase = "work") {
  if (!sec) return 0;
  if (appSettings.mode !== "test") return sec;
  return phase === "rest" ? Math.min(sec, 5) : Math.min(sec, 6);
}

function planForDate(date) {
  return plans[new Date(date + "T12:00:00").getDay()];
}

function plan() {
  return planForDate(todayKey);
}

function buildSetSteps(base) {
  const out = [];
  base.forEach(([name, sec, dose, cue, count, kind]) => {
    for (let i = 1; i <= count; i += 1) {
      out.push({ name, sec, kind: kind || "time", cue, dose: `${dose} · ${i}/${count}`, result: null, elapsed: 0 });
    }
  });
  return out;
}

function buildCoreSteps() {
  const picked = corePools.map((pool) => pool[Math.floor(Math.random() * pool.length)]);
  const out = [];
  for (let round = 1; round <= 4; round += 1) {
    picked.forEach(([name, cue], index) => {
      out.push({ name, cue, sec: 40, kind: "time", dose: `第 ${round} 组 · ${index + 1}/6`, result: null, elapsed: 0 });
    });
  }
  return out;
}

function ensure(id) {
  if (!state.modules[id]) {
    state.modules[id] = {
      index: 0,
      done: 0,
      miss: 0,
      checks: {},
      phase: "work",
      remaining: 0,
      steps: id === "core" ? buildCoreSteps() : (defs[id].steps ? buildSetSteps(defs[id].steps) : [])
    };
  }
  return state.modules[id];
}

function moduleCompleteIn(record, id) {
  const mod = record.modules && record.modules[id];
  if (!mod) return false;
  if (defs[id].checks) return Object.values(mod.checks || {}).some(Boolean);
  return mod.index >= mod.steps.length;
}

function moduleComplete(id) {
  return moduleCompleteIn(state, id);
}

function isRecordDone(record, date) {
  return planForDate(date).modules.every((id) => moduleCompleteIn(record, id));
}

function dayStatus(date) {
  const record = storage.load(date);
  if (record) return isRecordDone(record, date) ? "done" : "miss";
  return planForDate(date).restDay ? "rest" : "";
}

function renderDayDetail(date) {
  const dayPlan = planForDate(date);
  const record = storage.load(date);
  const status = dayStatus(date) || "empty";
  const statusText = status === "done" ? "完成" : status === "miss" ? "未完成" : status === "rest" ? "休息日" : "未开始";
  const cards = dayPlan.modules.map((id) => {
    const def = defs[id];
    const mod = record && record.modules ? record.modules[id] : null;
    let meta = "未开始";
    if (defs[id].checks && mod) {
      const count = Object.values(mod.checks || {}).filter(Boolean).length;
      meta = count ? `勾选 ${count}/${def.checks.length}` : "未完成";
    } else if (mod) {
      meta = `${Math.min(mod.index, mod.steps.length)}/${mod.steps.length} · 完成 ${mod.done || 0} · 未完成 ${mod.miss || 0}`;
    }
    return `<div class="detail-card"><div class="name-line">${def.title}</div><div class="meta-line">${meta}</div></div>`;
  }).join("");
  $("#dayDetail").innerHTML = `<div class="detail-title">${date} · ${statusText}</div><div class="meta-line">${dayPlan.title}</div>${cards}`;
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  $("#calendarTitle").textContent = `${year}-${String(month + 1).padStart(2, "0")}`;
  const blanks = Array.from({ length: first.getDay() }, () => "<div></div>");
  const cells = [];
  for (let day = 1; day <= days; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(`<button class="day-dot ${dayStatus(date)}" data-date="${date}">${day}</button>`);
  }
  $("#calendarGrid").innerHTML = blanks.concat(cells).join("");
  document.querySelectorAll("[data-date]").forEach((el) => {
    el.addEventListener("click", () => renderDayDetail(el.dataset.date));
  });
  renderDayDetail(todayKey);
}

function renderHome() {
  const todayPlan = plan();
  $("#dateLine").textContent = todayKey;
  $("#dayTitle").textContent = todayPlan.title;
  $("#notes").value = state.notes || "";
  const done = todayPlan.modules.filter(moduleComplete).length;
  if (done === todayPlan.modules.length && state.startedAt && !state.finishedAt) {
    state.finishedAt = Date.now();
    state.total = Math.floor((state.finishedAt - state.startedAt) / 1000);
    save();
  }
  $("#summaryLabel").textContent = done === todayPlan.modules.length && state.total ? "本次训练时长" : "完成项目";
  $("#summaryValue").textContent = done === todayPlan.modules.length && state.total ? fmt(state.total) : `${done}/${todayPlan.modules.length}`;
  $("#moduleList").innerHTML = todayPlan.modules.map(renderModule).join("");
  document.querySelectorAll("[data-open]").forEach((el) => el.addEventListener("click", () => openModule(el.dataset.open)));
  document.querySelectorAll("[data-check]").forEach((el) => {
    el.addEventListener("change", () => {
      const mod = ensure(el.dataset.module);
      mod.checks[el.dataset.check] = el.checked;
      save();
      renderHome();
    });
  });
}

function renderSettings() {
  $("#modeText").textContent = appSettings.mode === "test" ? "测试模式：计时会缩短" : "正式执行：使用真实时长";
  $("#formalMode").classList.toggle("active", appSettings.mode === "formal");
  $("#testMode").classList.toggle("active", appSettings.mode === "test");
  $("#dataEditor").value = JSON.stringify(state, null, 2);
}

function setMode(mode) {
  appSettings.mode = mode;
  saveSettings();
  renderSettings();
  if (state.current) showStep();
}

function applyDataFromEditor() {
  try {
    const parsed = JSON.parse($("#dataEditor").value);
    state = { ...defaultState(), ...parsed, version: parsed.version || APP_VERSION };
    storage.save(state);
    renderHome();
    renderSettings();
    alert("数据已应用。");
  } catch (error) {
    alert("JSON 格式不正确。");
  }
}

function clearTodayData() {
  if (!confirm("清空今天的训练数据？")) return;
  localStorage.removeItem(storage.key());
  state = defaultState();
  renderHome();
  renderSettings();
}

function renderModule(id) {
  const def = defs[id];
  const mod = ensure(id);
  if (def.checks) {
    return `<section class="module">
      <div class="module-top"><div class="module-title">${def.title}</div><div class="module-time">${def.time}</div></div>
      <div class="module-note">${def.note}</div>
      ${def.checks.map((text, index) => `<label class="check"><span>${text}</span><input type="checkbox" data-module="${id}" data-check="${index}" ${mod.checks[index] ? "checked" : ""}></label>`).join("")}
    </section>`;
  }
  return `<section class="module" data-open="${id}">
    <div class="module-top"><div class="module-title">${def.title}</div><div class="module-time">${def.time}</div></div>
    <div class="module-note">${def.note}</div>
    <div class="badges">
      <span class="badge ok">完成 ${mod.done}</span>
      <span class="badge no">未完成 ${mod.miss}</span>
      <span class="badge">${Math.min(mod.index, mod.steps.length)}/${mod.steps.length}</span>
    </div>
  </section>`;
}

function currentStep() {
  const mod = ensure(state.current);
  return mod.steps[Math.min(mod.index, mod.steps.length - 1)];
}

function openModule(id) {
  state.current = id;
  ensure(id);
  if (!state.startedAt) state.startedAt = Date.now();
  if (state.finishedAt) state.finishedAt = 0;
  $("#train").classList.add("show");
  showStep();
  save();
}

function closeModule() {
  stopTimer();
  stopTips();
  $("#train").className = "train";
  state.current = null;
  save();
  renderHome();
}

function showStep() {
  const mod = ensure(state.current);
  const def = defs[state.current];
  stopTimer();
  resetCard();
  if (mod.index >= mod.steps.length) {
    $("#stepLabel").textContent = def.title;
    $("#stepName").textContent = "完成";
    $("#clock").textContent = "00:00";
    $("#stateText").textContent = "返回首页";
    $("#tip").textContent = "这张卡已经结束。";
    return;
  }
  const step = currentStep();
  mod.phase = "work";
  mod.remaining = effectiveSeconds(step.sec, "work");
  $("#stepLabel").textContent = step.dose;
  $("#stepName").textContent = step.name;
  $("#clock").textContent = step.kind === "count" ? "计数" : fmt(mod.remaining);
  $("#stateText").textContent = step.kind === "count" ? "滑动记录" : "点击开始";
  $("#card").classList.add("paused");
  startTips([step.cue, "点击卡片开始 / 暂停。", state.current === "core" ? "核心只右滑：完成本项或结束休息。" : "右滑完成，左滑未完成。"]);
  autoStartCurrent();
}

function startTips(tips) {
  stopTips();
  let index = 0;
  $("#tip").textContent = tips[0] || "";
  tipTimer = setInterval(() => {
    index = (index + 1) % tips.length;
    $("#tip").textContent = tips[index];
  }, 2600);
}

function stopTips() {
  clearInterval(tipTimer);
  tipTimer = null;
}

function toggleTimer() {
  if (!state.current) return;
  const mod = ensure(state.current);
  if (mod.index >= mod.steps.length) return;
  const step = currentStep();
  if (step.kind === "count") {
    $("#stateText").textContent = "计数训练";
    $("#tip").textContent = "做完后右滑完成，没做到左滑未完成。";
    return;
  }
  if (timer) {
    stopTimer();
    $("#stateText").textContent = "已暂停";
    $("#card").classList.add(mod.phase === "rest" ? "rest-card" : "paused");
    return;
  }
  if (mod.remaining <= 0) {
    $("#stateText").textContent = "等待确认";
    return;
  }
  $("#stateText").textContent = mod.phase === "rest" ? "休息中" : "计时中";
  $("#card").classList.remove("paused", "rest-card");
  $("#card").classList.add(mod.phase === "rest" ? "rest-card" : "running");
  const token = ++timerToken;
  timer = setInterval(() => tick(token), 1000);
}

function autoStartCurrent() {
  setTimeout(() => {
    if (!state.current || timer) return;
    const mod = ensure(state.current);
    if (mod.index >= mod.steps.length || mod.remaining <= 0) return;
    if (currentStep().kind === "count") return;
    toggleTimer();
  }, 220);
}

function tick(token) {
  if (token !== timerToken) return;
  const mod = ensure(state.current);
  mod.remaining -= 1;
  $("#clock").textContent = fmt(Math.max(0, mod.remaining));
  if (mod.remaining > 0) return;
  stopTimer();
  if (state.current === "core" && mod.phase === "work") {
    finishWork("done", true);
    startRest();
  } else if (state.current === "core" && mod.phase === "rest") {
    nextCoreStep();
  } else {
    finishWork("done", true);
    mod.index += 1;
    showStep();
  }
  save();
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  timerToken += 1;
  $("#card").classList.remove("running", "rest-card");
}

function startRest(extra = 0) {
  const mod = ensure("core");
  resetCard();
  mod.phase = "rest";
  mod.remaining = effectiveSeconds(20, "rest") + extra;
  $("#train").classList.add("resting");
  $("#stepLabel").textContent = "短暂休息";
  $("#stepName").textContent = "调整呼吸";
  $("#clock").textContent = fmt(mod.remaining);
  $("#stateText").textContent = "休息中";
  $("#card").classList.add("rest-card");
  stopTips();
  $("#tip").textContent = "";
  stopTimer();
  $("#card").classList.add("rest-card");
  const token = ++timerToken;
  timer = setInterval(() => tick(token), 1000);
}

function nextCoreStep() {
  const mod = ensure("core");
  resetCard();
  $("#train").classList.remove("resting");
  mod.index += 1;
  stopTimer();
  showStep();
  autoStartCurrent();
  save();
}

function finishWork(result, fullTime) {
  const mod = ensure(state.current);
  const step = currentStep();
  const elapsed = step.kind === "count" ? 0 : step.sec - Math.max(0, mod.remaining);
  step.result = result;
  step.elapsed = step.kind === "count" ? 0 : (fullTime ? step.sec : elapsed);
  if (result === "done") mod.done += 1;
  if (result === "miss") mod.miss += 1;
  if (step.kind !== "count" && !fullTime) {
    mod.steps.push({ ...step, result: null, elapsed: 0, dose: "补组" });
  }
}

function recordSwipe(result) {
  const mod = ensure(state.current);
  if (mod.index >= mod.steps.length) return;
  if (state.current === "core") {
    if (mod.phase === "rest") {
      if (result === "miss") nextCoreStep();
      return;
    }
    const fullTime = mod.remaining <= 0;
    finishWork("done", fullTime);
    startRest();
    return;
  }
  const step = currentStep();
  finishWork(result, step.kind === "count" ? true : mod.remaining <= 0);
  mod.index += 1;
  showStep();
  save();
}

function resetCard() {
  pending = null;
  cardAnchor = "center";
  $("#train").classList.remove("peek-left", "peek-right", "pop", "resting");
  $("#card").classList.remove("dragging", "running", "paused", "rest-card");
  $("#card").style.transform = "";
  $("#centerFace").textContent = "😊";
}

function drag(dx) {
  const rotate = Math.max(-9, Math.min(9, dx / 22));
  $("#card").style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
}

function settlePreview(direction) {
  const id = state.current;
  const mod = id ? ensure(id) : null;
  if (id === "core" && mod.phase === "rest" && direction !== "left") {
    pending = null;
    cardAnchor = "center";
    $("#train").classList.remove("peek-left", "peek-right");
    $("#card").style.transform = "";
    $("#tip").textContent = "";
    return;
  }
  if (id === "core" && mod.phase === "rest" && direction === "left") {
    const result = "miss";
    if (pending !== result) {
      pending = result;
      cardAnchor = direction;
      $("#train").classList.remove("peek-left", "peek-right", "pop");
      $("#train").classList.add("peek-left");
      $("#card").classList.remove("dragging");
      $("#card").style.transform = "translateX(-38vw) rotate(-8deg)";
      $("#tip").textContent = "";
      return;
    }
    flyAway(result);
    return;
  }
  if (id === "core" && direction !== "right") {
    pending = null;
    cardAnchor = "center";
    $("#train").classList.remove("peek-left", "peek-right");
    $("#card").style.transform = "";
    return;
  }
  const result = direction === "right" ? "done" : "miss";
  if (pending !== result) {
    if (pending && pending !== result) {
      pending = null;
      cardAnchor = "center";
      $("#train").classList.remove("peek-left", "peek-right");
      $("#card").style.transform = "";
      $("#tip").textContent = "已回到中间。再滑一次选择方向。";
      return;
    }
    pending = result;
    cardAnchor = direction;
    const sign = direction === "right" ? 1 : -1;
    $("#train").classList.remove("peek-left", "peek-right", "pop");
    $("#train").classList.add(direction === "right" ? "peek-right" : "peek-left");
    $("#card").classList.remove("dragging");
    $("#card").style.transform = `translateX(${sign * 38}vw) rotate(${sign * 8}deg)`;
    $("#tip").textContent = direction === "right" ? "再右滑一次确认完成。" : "再左滑一次确认未完成。";
    return;
  }
  flyAway(result);
}

function flyAway(result) {
  stopTimer();
  const done = result === "done";
  const sign = done ? 1 : -1;
  $("#card").classList.remove("dragging");
  $("#card").style.transform = `translateX(${sign * 125}vw) rotate(${sign * 18}deg)`;
  $("#centerFace").textContent = done ? "😊" : "☹️";
  $("#train").classList.remove("peek-left", "peek-right");
  $("#train").classList.add("pop");
  setTimeout(() => recordSwipe(result), 180);
}

function begin(x) {
  dragStart = x;
  dragging = true;
  suppressClick = false;
  $("#card").classList.add("dragging");
}

function move(x) {
  if (!dragging) return;
  const dx = x - dragStart;
  if (Math.abs(dx) > 8) suppressClick = true;
  if (pending) {
    const sameDirection = (pending === "done" && dx > 0) || (pending === "miss" && dx < 0);
    if (!sameDirection && Math.abs(dx) > 26) {
      pending = null;
      cardAnchor = "center";
      $("#train").classList.remove("peek-left", "peek-right");
      $("#card").style.transform = "";
      $("#tip").textContent = "已回到中间。";
      return;
    }
  }
  drag(dx);
}

function end(x) {
  if (!dragging) return;
  dragging = false;
  const dx = x - dragStart;
  $("#card").classList.remove("dragging");
  if (Math.abs(dx) < 90) {
    if (pending && cardAnchor !== "center") {
      const sign = pending === "done" ? 1 : -1;
      $("#card").style.transform = `translateX(${sign * 38}vw) rotate(${sign * 8}deg)`;
    } else {
      $("#card").style.transform = "";
    }
    return;
  }
  settlePreview(dx > 0 ? "right" : "left");
}

$("#backBtn").addEventListener("click", closeModule);
$("#calendarBtn").addEventListener("click", () => {
  renderCalendar();
  $("#calendar").classList.add("show");
});
$("#closeCalendar").addEventListener("click", () => $("#calendar").classList.remove("show"));
$("#settingsBtn").addEventListener("click", () => {
  renderSettings();
  $("#settings").classList.add("show");
});
$("#closeSettings").addEventListener("click", () => $("#settings").classList.remove("show"));
$("#formalMode").addEventListener("click", () => setMode("formal"));
$("#testMode").addEventListener("click", () => setMode("test"));
$("#reloadData").addEventListener("click", renderSettings);
$("#applyData").addEventListener("click", applyDataFromEditor);
$("#clearData").addEventListener("click", clearTodayData);
$("#card").addEventListener("click", () => {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  toggleTimer();
});
$("#restMore").addEventListener("click", (event) => {
  event.stopPropagation();
  const mod = ensure("core");
  mod.remaining += 10;
  $("#clock").textContent = fmt(mod.remaining);
  save();
});
$("#train").addEventListener("touchstart", (event) => begin(event.changedTouches[0].clientX), { passive: true });
$("#train").addEventListener("touchmove", (event) => move(event.changedTouches[0].clientX), { passive: true });
$("#train").addEventListener("touchend", (event) => end(event.changedTouches[0].clientX), { passive: true });
$("#train").addEventListener("mousedown", (event) => begin(event.clientX));
window.addEventListener("mousemove", (event) => move(event.clientX));
window.addEventListener("mouseup", (event) => end(event.clientX));
$("#notes").addEventListener("input", save);

renderHome();
