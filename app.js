const STORAGE_KEYS = {
  unlocked: "kodomoMarcheUnlockedItems",
  readQrs: "kodomoMarcheReadQrIds",
  savedFrame: "kodomoMarcheSavedFrame"
};

const ITEM_DEFS = [
  { id: "face_usamimi_01", category: "faceAccessory", label: "うさみみ", src: "assets/face/face_usamimi_01.png", unlockedByDefault: true, slot: "head", scale: 1, offsetX: 0, offsetY: 0, angleScale: 1, angleOffset: 0 },
  { id: "face_usamimi_02", category: "faceAccessory", label: "おともだち", src: "assets/face/face_usamimi_02.png", unlockedByDefault: true, slot: "head", scale: 1.24, offsetX: -0.02, offsetY: -0.16, angleScale: 0.2, angleOffset: 0.12 },
  { id: "face_usamimi_03", category: "faceAccessory", label: "つばさ", src: "assets/face/face_usamimi_03.png", unlockedByDefault: true, slot: "head", scale: 0.9, offsetX: 0, offsetY: -0.22, angleScale: 1, angleOffset: 0 },
  { id: "face_usamimi_04", category: "faceAccessory", label: "カラフル", src: "assets/face/face_usamimi_04.png", unlockedByDefault: true, slot: "head", scale: 1.12, offsetX: 0, offsetY: -0.12, angleScale: 1, angleOffset: 0 },
  { id: "face_headband_easter_01", category: "faceAccessory", label: "イースター", src: "assets/face/face_headband_easter_01.png", unlockedByDefault: false, slot: "head", scale: 0.98, offsetX: 0, offsetY: -0.06, angleScale: 1, angleOffset: 0 },
  { id: "face_earring_flower_01", category: "faceAccessory", label: "はないやリング", unlockedByDefault: false, slot: "earPair", leftSrc: "assets/face/face_earring_flower_left_01.png", rightSrc: "assets/face/face_earring_flower_right_01.png", scale: 0.46, leftOffsetX: 0.012, rightOffsetX: 0.012, offsetY: 0.045, angleScale: 0.22, angleOffset: 0 },
  { id: "character_molddoll_01", category: "character", label: "モールドール", src: "assets/character/character_molddoll_01.svg", unlockedByDefault: true, defaultX: 0.5, defaultY: 0.78, defaultScale: 0.28 },
  { id: "character_jelly_01", category: "character", label: "ゼリー", src: "assets/character/character_jelly_01.png", unlockedByDefault: false, defaultX: 0.46, defaultY: 0.78, defaultScale: 0.24 },
  { id: "character_chick_01", category: "character", label: "ひよこ", src: "assets/character/character_chick_01.png", unlockedByDefault: true, defaultX: 0.54, defaultY: 0.78, defaultScale: 0.2 },
  { id: "character_chick_02", category: "character", label: "ひよこリボン", src: "assets/character/character_chick_02.png", unlockedByDefault: false, defaultX: 0.54, defaultY: 0.78, defaultScale: 0.2 },
  { id: "frame_kodomomarche_01", category: "frame", label: "マルシェフレーム", src: "assets/frame/frame_kodomomarche_01.svg", unlockedByDefault: true },
  { id: "frame_flower_soft_01", category: "frame", label: "おはなフレーム", src: "assets/frame/frame_flower_soft_01.png", unlockedByDefault: false },
  { id: "background_venue_01", category: "background", label: "かいじょう背景", src: "assets/background/background_venue_01.png", unlockedByDefault: false },
  { id: "stamp_kodomomarche_01", category: "stamp", label: "こどもマルシェ", src: "assets/stamp/stamp_kodomomarche_01.png", unlockedByDefault: false, defaultX: 0.5, defaultY: 0.2, defaultScale: 0.34 }
];

const QR_DEFS = [
  { qrId: "qr_easter_01", label: "イースター", unlockItemIds: ["face_headband_easter_01"] },
  { qrId: "qr_flower_01", label: "はないやリング", unlockItemIds: ["face_earring_flower_01"] },
  { qrId: "qr_jelly_01", label: "ゼリー", unlockItemIds: ["character_jelly_01"] },
  { qrId: "qr_chick_01", label: "ひよこリボン", unlockItemIds: ["character_chick_02"] },
  { qrId: "qr_photo_01", label: "きせかえセット", unlockItemIds: ["frame_flower_soft_01", "background_venue_01", "stamp_kodomomarche_01"] }
];

const CATEGORY_LABELS = {
  faceAccessory: "顔アクセ",
  character: "キャラ",
  frame: "フレーム",
  background: "背景",
  stamp: "スタンプ"
};

const ITEM_MAP = new Map(ITEM_DEFS.map((item) => [item.id, item]));
const QR_MAP = new Map(QR_DEFS.map((qr) => [qr.qrId, qr]));
const PLACEMENT_CATEGORIES = new Set(["character", "stamp"]);

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const homeScreen = document.getElementById("homeScreen");
const builderScreen = document.getElementById("builderScreen");
const startQrButton = document.getElementById("startQrButton");
const openBuilderButton = document.getElementById("openBuilderButton");
const openCameraButton = document.getElementById("openCameraButton");
const openCollectionButton = document.getElementById("openCollectionButton");
const homeProgressText = document.getElementById("homeProgressText");
const homeProgressFill = document.getElementById("homeProgressFill");
const homeButton = document.getElementById("homeButton");
const menuButton = document.getElementById("menuButton");
const qrButton = document.getElementById("qrButton");
const switchButton = document.getElementById("switchButton");
const captureButton = document.getElementById("captureButton");
const closeBuilderButton = document.getElementById("closeBuilderButton");
const saveFrameButton = document.getElementById("saveFrameButton");
const builderStage = document.getElementById("builderStage");
const builderBackgroundImage = document.getElementById("builderBackgroundImage");
const builderFrameImage = document.getElementById("builderFrameImage");
const builderPlacements = document.getElementById("builderPlacements");
const builderFaceBadge = document.getElementById("builderFaceBadge");
const builderFaceButton = document.getElementById("builderFaceButton");
const builderBackgroundButton = document.getElementById("builderBackgroundButton");
const builderFrameButton = document.getElementById("builderFrameButton");
const builderCharacterButton = document.getElementById("builderCharacterButton");
const builderStampButton = document.getElementById("builderStampButton");
const deletePlacementButton = document.getElementById("deletePlacementButton");
const pickerPanel = document.getElementById("pickerPanel");
const closePickerButton = document.getElementById("closePickerButton");
const pickerTitle = document.getElementById("pickerTitle");
const pickerSubtitle = document.getElementById("pickerSubtitle");
const pickerHint = document.getElementById("pickerHint");
const pickerOptions = document.getElementById("pickerOptions");
const collectionPanel = document.getElementById("collectionPanel");
const closeCollectionButton = document.getElementById("closeCollectionButton");
const collectionSummary = document.getElementById("collectionSummary");
const collectionList = document.getElementById("collectionList");
const toast = document.getElementById("toast");
const rewardOverlay = document.getElementById("rewardOverlay");
const rewardTitle = document.getElementById("rewardTitle");
const rewardText = document.getElementById("rewardText");
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
let rewardTimeoutId = null;
let facePose = null;
let barcodeDetector = null;
let currentMode = "home";
let previousModeBeforeQr = "home";
let pickerCategory = null;
let builderDragState = null;
let selectedPlacementId = null;

const state = {
  unlockedItemIds: loadUnlockedItemIds(),
  readQrIds: loadReadQrIds(),
  savedFrame: loadSavedFrame()
};

let builderDraft = createInitialBuilderDraft();

function defaultUnlockedIds() {
  return ITEM_DEFS.filter((item) => item.unlockedByDefault).map((item) => item.id);
}

function emptyFrame() {
  return {
    backgroundId: null,
    faceAccessoryId: null,
    frameId: null,
    placements: []
  };
}

function cloneFrame(frame) {
  return JSON.parse(JSON.stringify(frame));
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

function loadReadQrIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.readQrs);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id) => QR_MAP.has(id));
  } catch {
    return [];
  }
}

function sanitizeFrame(frame) {
  if (!frame || typeof frame !== "object") {
    return emptyFrame();
  }
  const backgroundId = sanitizeSlotItem(frame.backgroundId, "background");
  const faceAccessoryId = sanitizeSlotItem(frame.faceAccessoryId, "faceAccessory");
  const frameId = sanitizeSlotItem(frame.frameId, "frame");
  const placements = Array.isArray(frame.placements)
    ? frame.placements.map(sanitizePlacement).filter(Boolean)
    : [];
  return { backgroundId, faceAccessoryId, frameId, placements };
}

function sanitizeSlotItem(itemId, category) {
  if (!itemId) {
    return null;
  }
  const item = ITEM_MAP.get(itemId);
  if (!item || item.category !== category) {
    return null;
  }
  return state.unlockedItemIds.includes(itemId) ? itemId : null;
}

function sanitizePlacement(placement) {
  if (!placement || typeof placement !== "object") {
    return null;
  }
  const item = ITEM_MAP.get(placement.itemId);
  if (!item || !PLACEMENT_CATEGORIES.has(item.category)) {
    return null;
  }
  if (!state.unlockedItemIds.includes(item.id)) {
    return null;
  }
  return {
    instanceId: typeof placement.instanceId === "string" ? placement.instanceId : `${item.id}-${Date.now()}`,
    itemId: item.id,
    category: item.category,
    x: clamp(typeof placement.x === "number" ? placement.x : item.defaultX ?? 0.5, 0.08, 0.92),
    y: clamp(typeof placement.y === "number" ? placement.y : item.defaultY ?? 0.6, 0.08, 0.92),
    scale: clamp(typeof placement.scale === "number" ? placement.scale : item.defaultScale ?? 0.24, 0.12, 0.6),
    rotation: typeof placement.rotation === "number" ? placement.rotation : 0
  };
}

function loadSavedFrame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedFrame);
    if (!raw) {
      return null;
    }
    return sanitizeFrame(JSON.parse(raw));
  } catch {
    return null;
  }
}

function savePersistentState() {
  localStorage.setItem(STORAGE_KEYS.unlocked, JSON.stringify(state.unlockedItemIds));
  localStorage.setItem(STORAGE_KEYS.readQrs, JSON.stringify(state.readQrIds));
  if (state.savedFrame) {
    localStorage.setItem(STORAGE_KEYS.savedFrame, JSON.stringify(state.savedFrame));
  } else {
    localStorage.removeItem(STORAGE_KEYS.savedFrame);
  }
}

function createInitialBuilderDraft() {
  return state.savedFrame ? cloneFrame(state.savedFrame) : emptyFrame();
}

function resetBuilderDraft() {
  builderDraft = createInitialBuilderDraft();
  selectedPlacementId = null;
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

function showReward(title, message) {
  rewardTitle.textContent = title;
  rewardText.textContent = message;
  rewardOverlay.classList.remove("hiddenPanel");
  if (rewardTimeoutId) {
    clearTimeout(rewardTimeoutId);
  }
  rewardTimeoutId = setTimeout(() => {
    rewardOverlay.classList.add("hiddenPanel");
    rewardTimeoutId = null;
  }, 1700);
}

function setMode(mode) {
  currentMode = mode;
  homeScreen.classList.toggle("hiddenPanel", mode !== "home");
  builderScreen.classList.toggle("hiddenPanel", mode !== "builder");
  collectionPanel.classList.toggle("hiddenPanel", mode !== "collection");
  collectionPanel.setAttribute("aria-hidden", String(mode !== "collection"));
  for (const element of [homeButton, menuButton, qrButton, switchButton, captureButton]) {
    const visible = mode === "photo";
    element.classList.toggle("hiddenControl", !visible);
  }
}

function getUnlockedItems(category) {
  return ITEM_DEFS.filter((item) => item.category === category && state.unlockedItemIds.includes(item.id));
}

function updateHomeProgress() {
  const total = QR_DEFS.length;
  const found = state.readQrIds.length;
  homeProgressText.textContent = `${found} / ${total}`;
  homeProgressFill.style.width = `${total ? (found / total) * 100 : 0}%`;
}

function getAssetPreviewSrc(item) {
  if (item.src) {
    return item.src;
  }
  if (item.leftSrc) {
    return item.leftSrc;
  }
  return "";
}

function renderCollection() {
  const unlockedCount = state.unlockedItemIds.length;
  collectionSummary.textContent = `見つけたQR ${state.readQrIds.length} / ${QR_DEFS.length} ・ あつめたアイテム ${unlockedCount} / ${ITEM_DEFS.length}`;
  collectionList.innerHTML = "";

  for (const item of ITEM_DEFS) {
    const unlocked = state.unlockedItemIds.includes(item.id);
    const card = document.createElement("article");
    card.className = `collectionCard${unlocked ? "" : " isLocked"}`;
    const preview = unlocked
      ? `<div class="collectionCardPreview"><img src="${getAssetPreviewSrc(item)}" alt=""></div>`
      : '<div class="collectionCardPreview"><div class="collectionLockedMark">?</div></div>';
    card.innerHTML = `
      ${preview}
      <div class="collectionCardTop">
        <div class="collectionCardTitle">${unlocked ? item.label : "？？？"}</div>
        <div class="collectionBadge${unlocked ? " isDone" : ""}">${unlocked ? "GET" : "まだ"}</div>
      </div>
      <div class="collectionMeta">${CATEGORY_LABELS[item.category]}</div>
    `;
    collectionList.appendChild(card);
  }
}

function closePickerPanel() {
  pickerCategory = null;
  pickerPanel.classList.add("hiddenPanel");
  pickerPanel.setAttribute("aria-hidden", "true");
}

function openPickerPanel(category) {
  pickerCategory = category;
  renderPickerOptions();
  pickerPanel.classList.remove("hiddenPanel");
  pickerPanel.setAttribute("aria-hidden", "false");
}

function renderPickerOptions() {
  if (!pickerCategory) {
    return;
  }
  pickerTitle.textContent = `${CATEGORY_LABELS[pickerCategory]} をえらぶ`;
  pickerSubtitle.textContent = pickerCategory === "character" || pickerCategory === "stamp"
    ? "えらぶと ステージに追加されるよ"
    : "えらぶと フレームに反映されるよ";
  pickerHint.textContent = pickerCategory === "character" || pickerCategory === "stamp"
    ? "追加したいものをタップしてね"
    : "ひとつ選んでね";
  pickerOptions.innerHTML = "";

  if (!PLACEMENT_CATEGORIES.has(pickerCategory)) {
    const noneButton = document.createElement("button");
    noneButton.type = "button";
    noneButton.className = `optionButton${!getDraftSlotValue(pickerCategory) ? " selected" : ""}`;
    noneButton.textContent = "なし";
    noneButton.addEventListener("pointerup", (event) => {
      stopEvent(event);
      applyPickerSelection(null);
    });
    pickerOptions.appendChild(noneButton);
  }

  for (const item of getUnlockedItems(pickerCategory)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "optionButton";
    button.textContent = item.label;
    if (!PLACEMENT_CATEGORIES.has(pickerCategory) && getDraftSlotValue(pickerCategory) === item.id) {
      button.classList.add("selected");
    }
    button.addEventListener("pointerup", (event) => {
      stopEvent(event);
      applyPickerSelection(item.id);
    });
    pickerOptions.appendChild(button);
  }
}

function getDraftSlotValue(category) {
  if (category === "faceAccessory") {
    return builderDraft.faceAccessoryId;
  }
  if (category === "background") {
    return builderDraft.backgroundId;
  }
  if (category === "frame") {
    return builderDraft.frameId;
  }
  return null;
}

function applyPickerSelection(itemId) {
  if (!pickerCategory) {
    return;
  }
  if (pickerCategory === "faceAccessory") {
    builderDraft.faceAccessoryId = itemId;
  } else if (pickerCategory === "background") {
    builderDraft.backgroundId = itemId;
  } else if (pickerCategory === "frame") {
    builderDraft.frameId = itemId;
  } else {
    addPlacement(itemId);
  }
  renderBuilderDraft();
  closePickerPanel();
}

function createPlacementFromItem(itemId) {
  const item = ITEM_MAP.get(itemId);
  if (!item || !PLACEMENT_CATEGORIES.has(item.category)) {
    return null;
  }
  return {
    instanceId: `${item.id}-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`,
    itemId: item.id,
    category: item.category,
    x: item.defaultX ?? 0.5,
    y: item.defaultY ?? (item.category === "stamp" ? 0.25 : 0.74),
    scale: item.defaultScale ?? 0.24,
    rotation: 0
  };
}

function addPlacement(itemId) {
  const placement = createPlacementFromItem(itemId);
  if (!placement) {
    return;
  }
  builderDraft.placements.push(placement);
  selectedPlacementId = placement.instanceId;
}

function renderBuilderDraft() {
  const backgroundAsset = getAssetById(builderDraft.backgroundId);
  builderBackgroundImage.classList.toggle("hiddenPanel", !backgroundAsset);
  if (backgroundAsset) {
    builderBackgroundImage.src = backgroundAsset.src;
  }

  const frameAsset = getAssetById(builderDraft.frameId);
  builderFrameImage.classList.toggle("hiddenPanel", !frameAsset);
  if (frameAsset) {
    builderFrameImage.src = frameAsset.src;
  }

  const faceItem = ITEM_MAP.get(builderDraft.faceAccessoryId);
  builderFaceBadge.textContent = `顔アクセ: ${faceItem ? faceItem.label : "なし"}`;
  builderPlacements.innerHTML = "";

  for (const placement of builderDraft.placements) {
    const item = ITEM_MAP.get(placement.itemId);
    if (!item) {
      continue;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = `builderPlacement${selectedPlacementId === placement.instanceId ? " isSelected" : ""}`;
    button.dataset.instanceId = placement.instanceId;
    button.style.left = `${placement.x * 100}%`;
    button.style.top = `${placement.y * 100}%`;
    button.style.transform = `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.scale / 0.24})`;
    button.innerHTML = `<img src="${item.src}" alt="${item.label}">`;
    button.addEventListener("pointerdown", beginBuilderDrag);
    button.addEventListener("pointerup", (event) => {
      stopEvent(event);
      selectedPlacementId = placement.instanceId;
      renderBuilderDraft();
    });
    builderPlacements.appendChild(button);
  }

  deletePlacementButton.disabled = !selectedPlacementId;
}

function beginBuilderDrag(event) {
  const placementButton = event.currentTarget;
  const instanceId = placementButton.dataset.instanceId;
  const placement = builderDraft.placements.find((entry) => entry.instanceId === instanceId);
  if (!placement) {
    return;
  }
  const rect = builderStage.getBoundingClientRect();
  builderDragState = {
    instanceId,
    offsetX: ((event.clientX - rect.left) / rect.width) - placement.x,
    offsetY: ((event.clientY - rect.top) / rect.height) - placement.y
  };
  selectedPlacementId = instanceId;
  renderBuilderDraft();
  stopEvent(event);
}

function moveBuilderPlacement(event) {
  if (!builderDragState || currentMode !== "builder") {
    return;
  }
  const placement = builderDraft.placements.find((entry) => entry.instanceId === builderDragState.instanceId);
  if (!placement) {
    return;
  }
  const rect = builderStage.getBoundingClientRect();
  placement.x = clamp(((event.clientX - rect.left) / rect.width) - builderDragState.offsetX, 0.1, 0.9);
  placement.y = clamp(((event.clientY - rect.top) / rect.height) - builderDragState.offsetY, 0.12, 0.9);
  renderBuilderDraft();
}

function endBuilderDrag() {
  builderDragState = null;
}

function deleteSelectedPlacement() {
  if (!selectedPlacementId) {
    return;
  }
  builderDraft.placements = builderDraft.placements.filter((placement) => placement.instanceId !== selectedPlacementId);
  selectedPlacementId = null;
  renderBuilderDraft();
}

function saveBuilderFrame() {
  state.savedFrame = sanitizeFrame(builderDraft);
  savePersistentState();
  showToast("フレームを ほぞんしました");
}

function getAssetById(itemId) {
  if (!itemId) {
    return null;
  }
  return loadedAssets.get(itemId) || null;
}

function updateCameraModeUi() {
  const mirrored = currentFacingMode === "user";
  video.classList.toggle("mirror", mirrored);
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
    if (item.leftSrc && item.rightSrc) {
      const leftImage = await loadImage({ src: item.leftSrc });
      const rightImage = await loadImage({ src: item.rightSrc });
      if (!leftImage || !rightImage) {
        continue;
      }
      loadedAssets.set(item.id, {
        ...item,
        leftCanvas: processAssetToCanvas(leftImage, true),
        rightCanvas: processAssetToCanvas(rightImage, true),
        leftWidth: leftImage.naturalWidth,
        leftHeight: leftImage.naturalHeight,
        rightWidth: rightImage.naturalWidth,
        rightHeight: rightImage.naturalHeight
      });
      continue;
    }

    const image = await loadImage({ src: item.src });
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
  const activeFrame = state.savedFrame;
  const photoRect = getPhotoRect(activeFrame);
  drawBackgroundLayer(activeFrame);
  drawCameraLayer(results.image, photoRect, activeFrame);
  facePose = null;

  if (results.multiFaceLandmarks?.length && activeFrame?.faceAccessoryId) {
    const landmarks = results.multiFaceLandmarks[0];
    facePose = computeFacePose(landmarks, photoRect);
    drawFaceAccessoryLayer(facePose, activeFrame.faceAccessoryId);
  }

  drawPlacementLayer(activeFrame, photoRect);
  drawFrameLayer(activeFrame);
});

function getPhotoRect(frameData) {
  if (!frameData?.backgroundId) {
    return { left: 0, top: 0, width: canvas.width, height: canvas.height };
  }

  const horizontalPadding = canvas.width * 0.08;
  const topPadding = canvas.height * 0.1;
  const bottomPadding = canvas.height * 0.2;
  return {
    left: horizontalPadding,
    top: topPadding,
    width: canvas.width - (horizontalPadding * 2),
    height: canvas.height - topPadding - bottomPadding
  };
}

function drawImageCover(image, left, top, width, height, mirrored = false) {
  const sourceWidth = image.videoWidth || image.naturalWidth || image.width;
  const sourceHeight = image.videoHeight || image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) {
    return;
  }

  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const dx = left + ((width - drawWidth) / 2);
  const dy = top + ((height - drawHeight) / 2);

  if (mirrored) {
    ctx.save();
    ctx.translate((left * 2) + width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
    ctx.restore();
    return;
  }

  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
}

function drawBackgroundLayer(frameData) {
  const asset = getAssetById(frameData?.backgroundId);
  if (!asset) {
    return;
  }
  drawImageCover(asset.canvas, 0, 0, canvas.width, canvas.height, false);
}

function drawCameraLayer(image, rect, frameData) {
  if (!frameData?.backgroundId) {
    drawImageCover(image, 0, 0, canvas.width, canvas.height, currentFacingMode === "user");
    return;
  }

  const radius = Math.min(rect.width, rect.height) * 0.06;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(rect.left + radius, rect.top);
  ctx.lineTo(rect.left + rect.width - radius, rect.top);
  ctx.quadraticCurveTo(rect.left + rect.width, rect.top, rect.left + rect.width, rect.top + radius);
  ctx.lineTo(rect.left + rect.width, rect.top + rect.height - radius);
  ctx.quadraticCurveTo(rect.left + rect.width, rect.top + rect.height, rect.left + rect.width - radius, rect.top + rect.height);
  ctx.lineTo(rect.left + radius, rect.top + rect.height);
  ctx.quadraticCurveTo(rect.left, rect.top + rect.height, rect.left, rect.top + rect.height - radius);
  ctx.lineTo(rect.left, rect.top + radius);
  ctx.quadraticCurveTo(rect.left, rect.top, rect.left + radius, rect.top);
  ctx.closePath();
  ctx.clip();
  drawImageCover(image, rect.left, rect.top, rect.width, rect.height, currentFacingMode === "user");
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = Math.max(4, canvas.width * 0.008);
  ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(rect.left + radius, rect.top);
  ctx.lineTo(rect.left + rect.width - radius, rect.top);
  ctx.quadraticCurveTo(rect.left + rect.width, rect.top, rect.left + rect.width, rect.top + radius);
  ctx.lineTo(rect.left + rect.width, rect.top + rect.height - radius);
  ctx.quadraticCurveTo(rect.left + rect.width, rect.top + rect.height, rect.left + rect.width - radius, rect.top + rect.height);
  ctx.lineTo(rect.left + radius, rect.top + rect.height);
  ctx.quadraticCurveTo(rect.left, rect.top + rect.height, rect.left, rect.top + rect.height - radius);
  ctx.lineTo(rect.left, rect.top + radius);
  ctx.quadraticCurveTo(rect.left, rect.top, rect.left + radius, rect.top);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function computeFacePose(landmarks, rect) {
  const leftTemple = landmarks[234];
  const rightTemple = landmarks[454];
  const forehead = landmarks[10];
  const chin = landmarks[152];
  const leftCheek = landmarks[177];
  const rightCheek = landmarks[401];
  const leftXRaw = rect.left + (leftTemple.x * rect.width);
  const leftY = rect.top + (leftTemple.y * rect.height);
  const rightXRaw = rect.left + (rightTemple.x * rect.width);
  const rightY = rect.top + (rightTemple.y * rect.height);
  const foreheadXRaw = rect.left + (forehead.x * rect.width);
  const foreheadY = rect.top + (forehead.y * rect.height);
  const chinY = rect.top + (chin.y * rect.height);
  const leftEarXRaw = rect.left + (((leftTemple.x * 0.58) + (leftCheek.x * 0.42)) * rect.width);
  const leftEarY = rect.top + (((leftTemple.y * 0.35) + (leftCheek.y * 0.65)) * rect.height);
  const rightEarXRaw = rect.left + (((rightTemple.x * 0.58) + (rightCheek.x * 0.42)) * rect.width);
  const rightEarY = rect.top + (((rightTemple.y * 0.35) + (rightCheek.y * 0.65)) * rect.height);
  const dx = rightXRaw - leftXRaw;
  const dy = rightY - leftY;
  const headWidth = Math.hypot(dx, dy);
  const headHeight = Math.max(chinY - foreheadY, headWidth * 0.9);
  const mirrored = currentFacingMode === "user";
  const projectX = mirrored ? (value) => rect.left + rect.width - (value - rect.left) : (value) => value;
  const angle = mirrored ? -Math.atan2(dy, dx) : Math.atan2(dy, dx);

  return {
    foreheadX: projectX(foreheadXRaw),
    foreheadY,
    headWidth,
    headHeight,
    angle,
    leftEarX: projectX(leftEarXRaw),
    leftEarY,
    rightEarX: projectX(rightEarXRaw),
    rightEarY
  };
}

function drawFaceAccessoryLayer(pose, accessoryId) {
  const asset = getAssetById(accessoryId);
  if (!asset || !pose) {
    return;
  }
  if (asset.slot === "earPair") {
    drawEarPairAccessoryLayer(asset, pose);
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

function drawEarPairAccessoryLayer(asset, pose) {
  const baseWidth = pose.headWidth * (asset.scale ?? 0.34);
  const rotation = (pose.angle * (asset.angleScale ?? 0.35)) + (asset.angleOffset ?? 0);
  const verticalOffset = pose.headHeight * (asset.offsetY ?? 0);
  const leftWidth = baseWidth * (asset.leftScale ?? 1);
  const leftHeight = leftWidth * (asset.leftHeight / asset.leftWidth);
  const rightWidth = baseWidth * (asset.rightScale ?? 1);
  const rightHeight = rightWidth * (asset.rightHeight / asset.rightWidth);
  const leftX = pose.leftEarX - (pose.headWidth * (asset.leftOffsetX ?? 0));
  const rightX = pose.rightEarX + (pose.headWidth * (asset.rightOffsetX ?? 0));

  ctx.save();
  ctx.translate(leftX, pose.leftEarY + verticalOffset);
  ctx.rotate(rotation + (asset.leftAngleOffset ?? 0));
  ctx.drawImage(asset.leftCanvas, -leftWidth / 2, -leftHeight / 2, leftWidth, leftHeight);
  ctx.restore();

  ctx.save();
  ctx.translate(rightX, pose.rightEarY + verticalOffset);
  ctx.rotate(rotation + (asset.rightAngleOffset ?? 0));
  ctx.drawImage(asset.rightCanvas, -rightWidth / 2, -rightHeight / 2, rightWidth, rightHeight);
  ctx.restore();
}

function drawPlacementLayer(frameData, photoRect) {
  if (!frameData?.placements?.length) {
    return;
  }
  const baseWidth = frameData.backgroundId ? photoRect.width : canvas.width;
  for (const placement of frameData.placements) {
    const asset = getAssetById(placement.itemId);
    if (!asset) {
      continue;
    }
    const width = baseWidth * placement.scale;
    const height = width * (asset.height / asset.width);
    const x = frameData.backgroundId ? photoRect.left + (placement.x * photoRect.width) : placement.x * canvas.width;
    const y = frameData.backgroundId ? photoRect.top + (placement.y * photoRect.height) : placement.y * canvas.height;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((placement.rotation || 0) * (Math.PI / 180));
    ctx.drawImage(asset.canvas, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
}

function drawFrameLayer(frameData) {
  const asset = getAssetById(frameData?.frameId);
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

function stopPhotoCamera() {
  stopArLoop();
  stopStream(currentStream);
  currentStream = null;
  video.srcObject = null;
}

async function startPhotoCamera(mode = currentFacingMode) {
  currentFacingMode = mode;
  updateCameraModeUi();
  stopPhotoCamera();

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: mode },
        width: { ideal: 640 },
        height: { ideal: 480 },
        aspectRatio: { ideal: 4 / 3 }
      },
      audio: false
    });
    video.srcObject = currentStream;
    await video.play();
    animationFrameId = requestAnimationFrame(renderLoop);
  } catch {
    showToast("カメラをつけられませんでした");
    switchToHomeMode();
  }
}

function switchToHomeMode() {
  closePickerPanel();
  stopPhotoCamera();
  setMode("home");
}

function switchToBuilderMode() {
  closePickerPanel();
  stopPhotoCamera();
  resetBuilderDraft();
  renderBuilderDraft();
  setMode("builder");
}

async function switchToPhotoMode() {
  closePickerPanel();
  if (!state.savedFrame) {
    showToast("先に フレームを作ってね");
    switchToBuilderMode();
    return;
  }
  setMode("photo");
  await startPhotoCamera(currentFacingMode);
}

function switchToCollectionMode() {
  closePickerPanel();
  stopPhotoCamera();
  renderCollection();
  setMode("collection");
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
  savePersistentState();
  renderCollection();
  return newlyUnlocked;
}

function handleQrRewards(qrIds) {
  const newQrIds = [];
  const itemIds = [];

  for (const qrId of qrIds) {
    const qr = QR_MAP.get(qrId);
    if (!qr) {
      continue;
    }
    if (!state.readQrIds.includes(qrId)) {
      state.readQrIds.push(qrId);
      newQrIds.push(qrId);
    }
    itemIds.push(...qr.unlockItemIds);
  }

  const newlyUnlocked = unlockItems(itemIds);

  if (newQrIds.length) {
    savePersistentState();
    updateHomeProgress();
  }

  if (newQrIds.length || newlyUnlocked.length) {
    const rewardNames = newlyUnlocked.length
      ? newlyUnlocked.join(" / ")
      : newQrIds.map((qrId) => QR_MAP.get(qrId)?.label).filter(Boolean).join(" / ");
    showReward("アイテムGET!", rewardNames);
  } else {
    showReward("もうみつけた！", "このQRは もう読んでいるよ");
  }
}

function extractQrIds(rawValue) {
  if (!rawValue) {
    return [];
  }
  if (QR_MAP.has(rawValue)) {
    return [rawValue];
  }
  try {
    const url = new URL(rawValue);
    const ids = [];
    for (const value of url.searchParams.getAll("qr")) {
      for (const qrId of value.split(",")) {
        if (QR_MAP.has(qrId)) {
          ids.push(qrId);
        }
      }
    }
    return ids;
  } catch {
    return [];
  }
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
  const qrIds = [];
  const itemIds = [];

  for (const value of url.searchParams.getAll("qr")) {
    for (const qrId of value.split(",")) {
      if (QR_MAP.has(qrId)) {
        qrIds.push(qrId);
      }
    }
  }

  for (const value of url.searchParams.getAll("unlock")) {
    for (const itemId of value.split(",")) {
      if (ITEM_MAP.has(itemId)) {
        itemIds.push(itemId);
      }
    }
  }

  if (qrIds.length) {
    handleQrRewards(qrIds);
  }
  if (itemIds.length) {
    const newlyUnlocked = unlockItems(itemIds);
    if (newlyUnlocked.length) {
      showReward("アイテムGET!", newlyUnlocked.join(" / "));
    }
  }

  if (!qrIds.length && !itemIds.length) {
    return;
  }

  url.searchParams.delete("qr");
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

async function startQrMode(fromMode = currentMode) {
  const detector = ensureBarcodeDetector();
  if (!detector) {
    showToast("このブラウザでは ページ内QR読み取りが使えません");
    return;
  }

  previousModeBeforeQr = fromMode;
  closePickerPanel();
  stopPhotoCamera();
  setMode("qr");

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

async function stopQrMode() {
  if (qrFrameId) {
    cancelAnimationFrame(qrFrameId);
    qrFrameId = null;
  }
  stopStream(qrStream);
  qrStream = null;
  qrVideo.srcObject = null;
  qrPanel.classList.add("hiddenPanel");
  qrPanel.setAttribute("aria-hidden", "true");

  if (previousModeBeforeQr === "photo") {
    await switchToPhotoMode();
    return;
  }
  if (previousModeBeforeQr === "builder") {
    setMode("builder");
    return;
  }
  switchToHomeMode();
}

async function scanQrLoop() {
  const detector = ensureBarcodeDetector();
  if (!detector || !qrStream) {
    return;
  }
  try {
    const barcodes = await detector.detect(qrVideo);
    if (barcodes.length) {
      const qrIds = extractQrIds(barcodes[0].rawValue);
      if (qrIds.length) {
        handleQrRewards(qrIds);
        await stopQrMode();
        return;
      }
      const itemIds = extractUnlockIds(barcodes[0].rawValue);
      if (itemIds.length) {
        const newlyUnlocked = unlockItems(itemIds);
        if (newlyUnlocked.length) {
          showReward("アイテムGET!", newlyUnlocked.join(" / "));
        } else {
          showReward("もうもってるよ！", "このアイテムは もうGETしているよ");
        }
        await stopQrMode();
        return;
      }
      qrStatus.textContent = "このQRではアイテムを解放できません";
    }
  } catch {
    qrStatus.textContent = "QRをよみとれませんでした";
  }
  qrFrameId = requestAnimationFrame(scanQrLoop);
}

async function init() {
  await loadRenderableAssets();
  handleUnlockFromUrl();
  renderCollection();
  renderBuilderDraft();
  updateHomeProgress();
  updateCameraModeUi();
  setMode("home");
}

startQrButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  startQrMode("home");
});

openBuilderButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  switchToBuilderMode();
});

openCameraButton.addEventListener("pointerup", async (event) => {
  stopEvent(event);
  await switchToPhotoMode();
});

openCollectionButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  switchToCollectionMode();
});

closeBuilderButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  switchToHomeMode();
});

saveFrameButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  saveBuilderFrame();
});

builderFaceButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  openPickerPanel("faceAccessory");
});

builderBackgroundButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  openPickerPanel("background");
});

builderFrameButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  openPickerPanel("frame");
});

builderCharacterButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  openPickerPanel("character");
});

builderStampButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  openPickerPanel("stamp");
});

deletePlacementButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  deleteSelectedPlacement();
});

closePickerButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  closePickerPanel();
});

closeCollectionButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  switchToHomeMode();
});

homeButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  switchToHomeMode();
});

menuButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  switchToBuilderMode();
});

qrButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  startQrMode("photo");
});

closeQrButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  stopQrMode();
});

switchButton.addEventListener("pointerup", async (event) => {
  stopEvent(event);
  const nextMode = currentFacingMode === "user" ? "environment" : "user";
  await startPhotoCamera(nextMode);
});

captureButton.addEventListener("pointerup", (event) => {
  stopEvent(event);
  savePhoto();
});

builderStage.addEventListener("pointerdown", (event) => {
  if (event.target === builderStage || event.target.classList.contains("builderPhotoWindow")) {
    selectedPlacementId = null;
    renderBuilderDraft();
    return;
  }
});

window.addEventListener("pointermove", moveBuilderPlacement);
window.addEventListener("pointerup", endBuilderDrag);

init();
