const STORAGE_KEYS = {
  unlocked: "kodomoMarcheUnlockedItems",
  selection: "kodomoMarcheSelection"
};

const ITEM_DEFS = [
  { id: "face_usamimi_01", category: "faceAccessory", label: "うさみみ", src: "face_usamimi_01.png", unlockedByDefault: true, scale: 1, offsetX: 0, offsetY: 0, angleScale: 1, angleOffset: 0 },
  { id: "face_usamimi_02", category: "faceAccessory", label: "おともだち", src: "face_usamimi_02.png", unlockedByDefault: true, scale: 1.24, offsetX: -0.02, offsetY: -0.16, angleScale: 0.2, angleOffset: 0.12 },
  { id: "face_usamimi_03", category: "faceAccessory", label: "つばさ", src: "face_usamimi_03.png", unlockedByDefault: true, scale: 0.9, offsetX: 0, offsetY: -0.22, angleScale: 1, angleOffset: 0 },
  { id: "face_usamimi_04", category: "faceAccessory", label: "カラフル", src: "face_usamimi_04.png", unlockedByDefault: true, scale: 1.12, offsetX: 0, offsetY: -0.12, angleScale: 1, angleOffset: 0 },
  { id: "character_molddoll_01", category: "character", label: "モールドール", src: "character_molddoll_01.svg", unlockedByDefault: true, defaultX: 0.5, defaultY: 0.88, defaultScale: 0.28 },
  { id: "frame_kodomomarche_01", category: "frame", label: "マルシェフレーム", src: "frame_kodomomarche_01.svg", unlockedByDefault: true }
];

const ITEM_MAP = new Map(ITEM_DEFS.map((item) => [item.id, item]));

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");
const statusText = document.getElementById("statusText");
const startButton = document.getElementById("startButton");
const menuButton = document.getElementById("menuButton");
const qrButton = document.getElementById("qrButton");
const switchButton = document.getElementById("switchButton");
const captureButton = document.getElementById("captureButton");
const pickerPanel = document.getElementById("pickerPanel");
const closePickerButton = document.getElementById("closePickerButton");
const faceAccessoryOptions = document.getElementById("faceAccessoryOptions");
const characterOptions = document.getElementById("characterOptions");
const frameOptions = document.getElementById("frameOptions");
const toast = document.getElementById("toast");
const qrPanel = document.getElementById("qrPanel");
const qrVideo = document.getElementById("qrVideo");
const closeQrButton = document.getElementById("closeQrButton");
const qrStatus = document.getElementById("qrStatus");

const loadedAssets = new Map();

let currentFacingMode = "user";
let currentStream = null;
let qrStream = null;
let animationFrameId = null;
let qrFrameId = null;
let isSending = false;
let toastTimeoutId = null;
let facePose = null;
let dragState = null;
let barcodeDetector = null;

const state = {
  unlockedItemIds: loadUnlockedItemIds(),
  selectedFaceAccessoryId: null,
  selectedCharacterId: null,
  selectedFrameId: null,
  characterPlacement: null
};

hydrateSelection();

function defaultUnlockedIds() {
  return ITEM_DEFS.filter((item) => item.unlockedByDefault).map((item) => item.id);
}

function loadUnlockedItemIds() {
  const fallback = defaultUnlockedIds();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.unlocked);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return fallback;
    }
    const known = parsed.filter((id) => ITEM_MAP.has(id));
    return Array.from(new Set([...fallback, ...known]));
  } catch {
    return fallback;
  }
}

function hydrateSelection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.selection);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    state.selectedFaceAccessoryId = sanitizeSelectedId(parsed.selectedFaceAccessoryId, "faceAccessory");
    state.selectedCharacterId = sanitizeSelectedId(parsed.selectedCharacterId, "character");
    state.selectedFrameId = sanitizeSelectedId(parsed.selectedFrameId, "frame");
    state.characterPlacement = sanitizeCharacterPlacement(parsed.characterPlacement);
  } catch {
    state.selectedFaceAccessoryId = null;
    state.selectedCharacterId = null;
    state.selectedFrameId = null;
    state.characterPlacement = null;
  }
}

function sanitizeSelectedId(id, category) {
  if (!id) {
    return null;
  }
  const item = ITEM_MAP.get(id);
  if (!item || item.category !== category) {
    return null;
  }
  return state.unlockedItemIds.includes(id) ? id : null;
}

function sanitizeCharacterPlacement(placement) {
  if (!placement || typeof placement !== "object") {
    return null;
  }
  if (typeof placement.x !== "number" || typeof placement.y !== "number") {
    return null;
  }
  return { x: clamp(placement.x, 0.12, 0.88), y: clamp(placement.y, 0.2, 0.96) };
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.unlocked, JSON.stringify(state.unlockedItemIds));
  localStorage.setItem(STORAGE_KEYS.selection, JSON.stringify({
    selectedFaceAccessoryId: state.selectedFaceAccessoryId,
    selectedCharacterId: state.selectedCharacterId,
    selectedFrameId: state.selectedFrameId,
    characterPlacement: state.characterPlacement
  }));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove("visible");
    toastTimeoutId = null;
  }, 2200);
}

function showStatus(message) {
  statusText.textContent = message;
  status.classList.remove("hiddenPanel");
}

function hideStatus() {
  status.classList.add("hiddenPanel");
}

function toggleControls(show) {
  for (const element of [menuButton, qrButton, switchButton, captureButton]) {
    element.classList.toggle("hiddenControl", !show);
  }
}

function openPickerPanel() {
  pickerPanel.classList.remove("hiddenPanel");
  pickerPanel.setAttribute("aria-hidden", "false");
}

function closePickerPanel() {
  pickerPanel.classList.add("hiddenPanel");
  pickerPanel.setAttribute("aria-hidden", "true");
}

function getUnlockedItems(category) {
  return ITEM_DEFS.filter((item) => item.category === category && state.unlockedItemIds.includes(item.id));
}

function renderOptionButtons(container, category, selectedId, onSelect) {
  container.innerHTML = "";

  const noneButton = document.createElement("button");
  noneButton.type = "button";
  noneButton.className = `optionButton${selectedId ? "" : " selected"}`;
  noneButton.textContent = "なし";
  noneButton.addEventListener("pointerup", (event) => {
    stopEvent(event);
    onSelect(null);
  });
  container.appendChild(noneButton);

  for (const item of getUnlockedItems(category)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `optionButton${selectedId === item.id ? " selected" : ""}`;
    button.textContent = item.label;
    button.addEventListener("pointerup", (event) => {
      stopEvent(event);
      onSelect(item.id);
    });
    container.appendChild(button);
  }
}

function renderSelections() {
  renderOptionButtons(faceAccessoryOptions, "faceAccessory", state.selectedFaceAccessoryId, (itemId) => {
    state.selectedFaceAccessoryId = itemId;
    saveState();
    renderSelections();
  });

  renderOptionButtons(characterOptions, "character", state.selectedCharacterId, (itemId) => {
    state.selectedCharacterId = itemId;
    state.characterPlacement = itemId ? defaultCharacterPlacement(itemId) : null;
    saveState();
    renderSelections();
  });

  renderOptionButtons(frameOptions, "frame", state.selectedFrameId, (itemId) => {
    state.selectedFrameId = itemId;
    saveState();
    renderSelections();
  });
}

function defaultCharacterPlacement(itemId) {
  const item = ITEM_MAP.get(itemId);
  if (!item) {
    return null;
  }
  return { x: item.defaultX ?? 0.5, y: item.defaultY ?? 0.86 };
}

function updateCameraModeUi() {
  const mirrored = currentFacingMode === "user";
  video.classList.toggle("mirror", mirrored);
  canvas.classList.toggle("mirror", mirrored);
  const label = mirrored ? "うしろカメラに切り替える" : "まえカメラに切り替える";
  switchButton.setAttribute("aria-label", label);
  switchButton.setAttribute("title", label);
}

function processAssetToCanvas(image, removeDarkPixels = true) {
  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  offscreenCanvas.width = image.naturalWidth || image.videoWidth;
  offscreenCanvas.height = image.naturalHeight || image.videoHeight;
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  offscreenCtx.drawImage(image, 0, 0);

  if (removeDarkPixels) {
    const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 20 && data[i + 1] < 20 && data[i + 2] < 20) {
        data[i + 3] = 0;
      }
    }
    offscreenCtx.putImageData(imageData, 0, 0);
  }

  return offscreenCanvas;
}

function loadImage(item) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = item.src;
  });
}

async function loadRenderableAssets() {
  for (const item of ITEM_DEFS) {
    const image = await loadImage(item);
    if (!image) {
      continue;
    }
    loadedAssets.set(item.id, {
      ...item,
      canvas: processAssetToCanvas(image, item.category !== "frame"),
      width: image.naturalWidth,
      height: image.naturalHeight
    });
  }
}

function getSelectedAsset(category, selectedId) {
  if (!selectedId) {
    return null;
  }
  const item = loadedAssets.get(selectedId);
  if (!item || item.category !== category) {
    return null;
  }
  return item;
}

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults((results) => {
  canvas.width = video.videoWidth || canvas.width;
  canvas.height = video.videoHeight || canvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  facePose = null;

  if (results.multiFaceLandmarks?.length) {
    const landmarks = results.multiFaceLandmarks[0];
    facePose = computeFacePose(landmarks);
    drawFaceAccessoryLayer(facePose);
  }

  drawCharacterLayer();
  drawFrameLayer();
});

function computeFacePose(landmarks) {
  const leftTemple = landmarks[234];
  const rightTemple = landmarks[454];
  const forehead = landmarks[10];
  const chin = landmarks[152];
  const leftX = leftTemple.x * canvas.width;
  const leftY = leftTemple.y * canvas.height;
  const rightX = rightTemple.x * canvas.width;
  const rightY = rightTemple.y * canvas.height;
  const foreheadX = forehead.x * canvas.width;
  const foreheadY = forehead.y * canvas.height;
  const chinY = chin.y * canvas.height;
  const dx = rightX - leftX;
  const dy = rightY - leftY;
  const headWidth = Math.hypot(dx, dy);
  const headHeight = Math.max(chinY - foreheadY, headWidth * 0.9);
  const angle = Math.atan2(dy, dx);
  return { foreheadX, foreheadY, headWidth, headHeight, angle };
}

function drawFaceAccessoryLayer(pose) {
  const asset = getSelectedAsset("faceAccessory", state.selectedFaceAccessoryId);
  if (!asset || !pose) {
    return;
  }
  const baseWidth = pose.headWidth * 2.35;
  const width = baseWidth * (asset.scale ?? 1);
  const height = width * ((asset.height / asset.width) || 0.68);
  const centerX = pose.foreheadX + pose.headWidth * (asset.offsetX ?? 0);
  const centerY = pose.foreheadY - pose.headHeight * (0.48 + (asset.offsetY ?? 0));

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((pose.angle * (asset.angleScale ?? 1)) + (asset.angleOffset ?? 0));
  ctx.drawImage(asset.canvas, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawCharacterLayer() {
  const asset = getSelectedAsset("character", state.selectedCharacterId);
  if (!asset) {
    return;
  }
  if (!state.characterPlacement) {
    state.characterPlacement = defaultCharacterPlacement(asset.id);
    saveState();
  }
  const width = canvas.width * (asset.defaultScale ?? 0.28);
  const height = width * (asset.height / asset.width);
  const x = state.characterPlacement.x * canvas.width;
  const y = state.characterPlacement.y * canvas.height;
  ctx.drawImage(asset.canvas, x - width / 2, y - height, width, height);
}

function drawFrameLayer() {
  const asset = getSelectedAsset("frame", state.selectedFrameId);
  if (!asset) {
    return;
  }
  ctx.drawImage(asset.canvas, 0, 0, canvas.width, canvas.height);
}

async function renderLoop() {
  if (video.readyState >= 2 && !isSending) {
    isSending = true;
    try {
      await faceMesh.send({ image: video });
    } finally {
      isSending = false;
    }
  }
  animationFrameId = requestAnimationFrame(renderLoop);
}

function stopArLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function stopStream(stream) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

async function startArCamera(mode = currentFacingMode) {
  currentFacingMode = mode;
  updateCameraModeUi();
  showStatus("カメラをつけています…");
  stopArLoop();
  stopStream(currentStream);
  currentStream = null;

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: mode }, width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false
    });
    video.srcObject = currentStream;
    await video.play();
    hideStatus();
    toggleControls(true);
    animationFrameId = requestAnimationFrame(renderLoop);
  } catch {
    toggleControls(false);
    showStatus("カメラをつけられませんでした。ブラウザの設定を確認してください。");
  }
}

function getCanvasPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.changedTouches ? event.changedTouches[0] : event;
  let x = ((source.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((source.clientY - rect.top) / rect.height) * canvas.height;
  if (currentFacingMode === "user") {
    x = canvas.width - x;
  }
  return { x, y };
}

function getCharacterBounds() {
  const asset = getSelectedAsset("character", state.selectedCharacterId);
  if (!asset || !state.characterPlacement) {
    return null;
  }
  const width = canvas.width * (asset.defaultScale ?? 0.28);
  const height = width * (asset.height / asset.width);
  const x = state.characterPlacement.x * canvas.width;
  const y = state.characterPlacement.y * canvas.height;
  return { left: x - width / 2, right: x + width / 2, top: y - height, bottom: y };
}

function isInsideBounds(point, bounds) {
  return point.x >= bounds.left && point.x <= bounds.right && point.y >= bounds.top && point.y <= bounds.bottom;
}

function beginCharacterDrag(event) {
  const bounds = getCharacterBounds();
  if (!bounds) {
    return;
  }
  const point = getCanvasPointFromEvent(event);
  if (!isInsideBounds(point, bounds)) {
    return;
  }
  const centerX = state.characterPlacement.x * canvas.width;
  const bottomY = state.characterPlacement.y * canvas.height;
  dragState = {
    offsetX: point.x - centerX,
    offsetY: point.y - bottomY
  };
  stopEvent(event);
}

function moveCharacter(event) {
  if (!dragState || !state.selectedCharacterId) {
    return;
  }
  const point = getCanvasPointFromEvent(event);
  state.characterPlacement = {
    x: clamp((point.x - dragState.offsetX) / canvas.width, 0.12, 0.88),
    y: clamp((point.y - dragState.offsetY) / canvas.height, 0.26, 0.96)
  };
  saveState();
}

function endCharacterDrag() {
  dragState = null;
}

function savePhoto() {
  if (!canvas.width || !canvas.height) {
    return;
  }
  const imageUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = imageUrl;
  link.download = `kodomomarche-ar-${timestamp}.png`;
  link.click();
  showToast("しゃしんを ほぞんしました");
}

function unlockItems(itemIds) {
  const newlyUnlocked = [];
  for (const itemId of itemIds) {
    const item = ITEM_MAP.get(itemId);
    if (!item || state.unlockedItemIds.includes(itemId)) {
      continue;
    }
    state.unlockedItemIds.push(itemId);
    newlyUnlocked.push(item.label);
  }
  if (!newlyUnlocked.length) {
    return;
  }
  saveState();
  renderSelections();
  showToast(`${newlyUnlocked.join(" / ")} をあつめたよ`);
}

function extractUnlockIds(rawValue) {
  if (!rawValue) {
    return [];
  }
  if (ITEM_MAP.has(rawValue)) {
    return [rawValue];
  }
  try {
    const url = new URL(rawValue);
    const ids = [];
    for (const value of url.searchParams.getAll("unlock")) {
      for (const itemId of value.split(",")) {
        if (ITEM_MAP.has(itemId)) {
          ids.push(itemId);
        }
      }
    }
    return ids;
  } catch {
    return [];
  }
}

function handleUnlockFromUrl() {
  const url = new URL(window.location.href);
  const ids = [];
  for (const value of url.searchParams.getAll("unlock")) {
    for (const itemId of value.split(",")) {
      if (ITEM_MAP.has(itemId)) {
        ids.push(itemId);
      }
    }
  }
  if (!ids.length) {
    return;
  }
  unlockItems(ids);
  url.searchParams.delete("unlock");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function ensureBarcodeDetector() {
  if (!("BarcodeDetector" in window)) {
    return null;
  }
  if (!barcodeDetector) {
    barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
  }
  return barcodeDetector;
}

async function startQrMode() {
  const detector = ensureBarcodeDetector();
  if (!detector) {
    showToast("このブラウザでは ページ内QR読み取りが使えません");
    return;
  }

  closePickerPanel();
  stopArLoop();
  stopStream(currentStream);
  currentStream = null;

  qrPanel.classList.remove("hiddenPanel");
  qrPanel.setAttribute("aria-hidden", "false");
  qrStatus.textContent = "QRをよみとり中…";

  try {
    qrStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    qrVideo.srcObject = qrStream;
    await qrVideo.play();
    scanQrLoop();
  } catch {
    qrStatus.textContent = "QRカメラをつけられませんでした";
  }
}

function stopQrMode() {
  if (qrFrameId) {
    cancelAnimationFrame(qrFrameId);
    qrFrameId = null;
  }
  stopStream(qrStream);
  qrStream = null;
  qrVideo.srcObject = null;
  qrPanel.classList.add("hiddenPanel");
  qrPanel.setAttribute("aria-hidden", "true");
  startArCamera(currentFacingMode);
}

async function scanQrLoop() {
  const detector = ensureBarcodeDetector();
  if (!detector || !qrStream) {
    return;
  }
  try {
    const barcodes = await detector.detect(qrVideo);
    if (barcodes.length) {
      const ids = extractUnlockIds(barcodes[0].rawValue);
      if (ids.length) {
        unlockItems(ids);
        stopQrMode();
        return;
      }
      qrStatus.textContent = "このQRではアイテムを解放できません";
    }
  } catch {
    qrStatus.textContent = "QRをよみとれませんでした";
  }
  qrFrameId = requestAnimationFrame(scanQrLoop);
}

function shouldIgnoreCanvasPointer(target) {
  return Boolean(target.closest("#status, #pickerPanel, #menuButton, #qrButton, #switchButton, #captureButton, #closePickerButton, #closeQrButton"));
}

async function init() {
  await loadRenderableAssets();
  renderSelections();
  handleUnlockFromUrl();
  renderSelections();
  updateCameraModeUi();
  toggleControls(false);
}

startButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  startArCamera();
});

menuButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  if (pickerPanel.classList.contains("hiddenPanel")) {
    openPickerPanel();
  } else {
    closePickerPanel();
  }
});

closePickerButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  closePickerPanel();
});

qrButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  startQrMode();
});

closeQrButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  stopQrMode();
});

switchButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  const nextMode = currentFacingMode === "user" ? "environment" : "user";
  startArCamera(nextMode);
});

captureButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  savePhoto();
});

canvas.addEventListener("pointerdown", (event) => {
  if (shouldIgnoreCanvasPointer(event.target)) {
    return;
  }
  beginCharacterDrag(event);
});

window.addEventListener("pointermove", (event) => {
  moveCharacter(event);
});

window.addEventListener("pointerup", () => {
  endCharacterDrag();
});

init();
