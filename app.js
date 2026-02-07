// ============================================
// UTILITY FUNCTIONS
// ============================================

// Toast notification system
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Text analysis function
function analyzeText(text) {
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const numbers = (text.match(/[0-9]/g) || []).length;
  const special = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  
  return { words, letters, numbers, special };
}

// Update statistics display
function updateStats(elementPrefix, stats) {
  document.getElementById(`${elementPrefix}Words`).textContent = stats.words;
  document.getElementById(`${elementPrefix}Letters`).textContent = stats.letters;
  document.getElementById(`${elementPrefix}Numbers`).textContent = stats.numbers;
  document.getElementById(`${elementPrefix}Special`).textContent = stats.special;
}

// Copy to clipboard function
async function copyToClipboard(text, source) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${source} copied to clipboard! ✓`);
  } catch (err) {
    showToast('Failed to copy text', 2000);
  }
}

// Local storage functions
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

function loadFromLocalStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch (err) {
    console.error('Error loading from localStorage:', err);
    return '';
  }
}

// ============================================
// CHARACTER INPUT HANDLER
// ============================================

let charInput = document.querySelector("#charInput");
let charLabel = document.querySelector("#charLabel");
let charBadge = document.querySelector("#charBadge");
let charStats = document.querySelector("#charStats");
let charCopyBtn = document.querySelector("#charCopy");
let charClearBtn = document.querySelector("#charClear");

// Load saved text from localStorage
charInput.value = loadFromLocalStorage('charInputText');
if (charInput.value.length > 0) {
  updateCharInput();
}

charInput.addEventListener("input", () => {
  updateCharInput();
  saveToLocalStorage('charInputText', charInput.value);
});

function updateCharInput() {
  const length = charInput.value.length;
  
  if (length === 0) {
    charLabel.innerHTML = '<i class="fas fa-text-width"></i> Enter Your Text';
    charBadge.textContent = "0";
    charBadge.className = "counter-badge";
    charStats.classList.remove('active');
  } else {
    charLabel.innerHTML = `<i class="fas fa-check-circle"></i> You Entered ${length} Character${length > 1 ? 's' : ''}`;
    charBadge.textContent = length;
    charBadge.className = "counter-badge success";
    charStats.classList.add('active');
    
    // Update statistics
    const stats = analyzeText(charInput.value);
    updateStats('char', stats);
    
    // Add subtle animation on update
    charBadge.style.transform = "scale(1.1)";
    setTimeout(() => {
      charBadge.style.transform = "scale(1)";
    }, 200);
  }
}

// Copy button handler
charCopyBtn.addEventListener('click', () => {
  if (charInput.value.trim() === '') {
    showToast('Nothing to copy!', 2000);
    return;
  }
  copyToClipboard(charInput.value, 'Text');
});

// Clear button handler
charClearBtn.addEventListener('click', () => {
  if (charInput.value.trim() === '') {
    showToast('Already empty!', 2000);
    return;
  }
  charInput.value = '';
  updateCharInput();
  saveToLocalStorage('charInputText', '');
  showToast('Text cleared! 🗑️');
});

// ============================================
// MESSAGE INPUT HANDLER
// ============================================

let msgInput = document.querySelector("#msgInput");
let msgLabel = document.querySelector("#msgLabel");
let msgBadge = document.querySelector("#msgBadge");
let progressBar = document.querySelector("#progressBar");
let msgStats = document.querySelector("#msgStats");
let msgCopyBtn = document.querySelector("#msgCopy");
let msgClearBtn = document.querySelector("#msgClear");

const maxLength = 100;

// Load saved message from localStorage
msgInput.value = loadFromLocalStorage('msgInputText');
if (msgInput.value.length > 0) {
  updateMsgInput();
}

msgInput.addEventListener("input", () => {
  updateMsgInput();
  saveToLocalStorage('msgInputText', msgInput.value);
});

function updateMsgInput() {
  const length = msgInput.value.length;
  const remaining = maxLength - length;
  const percentage = (length / maxLength) * 100;

  // Update progress bar
  progressBar.style.width = `${percentage}%`;

  if (length === 0) {
    msgLabel.innerHTML = '<i class="fas fa-comment-dots"></i> Express Your Thoughts';
    msgBadge.textContent = "0 / 100";
    msgBadge.className = "counter-badge success";
    progressBar.className = "progress-bar";
    msgStats.classList.remove('active');
  } 
  else if (remaining >= 20) {
    msgLabel.innerHTML = `<i class="fas fa-pen"></i> Keep Writing...`;
    msgBadge.textContent = `${length} / 100`;
    msgBadge.className = "counter-badge success";
    progressBar.className = "progress-bar";
    msgStats.classList.add('active');
  }
  else if (remaining > 0) {
    msgLabel.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Almost There!`;
    msgBadge.textContent = `${length} / 100`;
    msgBadge.className = "counter-badge warning";
    progressBar.className = "progress-bar warning";
    msgStats.classList.add('active');
  } 
  else {
    msgLabel.innerHTML = '<i class="fas fa-ban"></i> Limit Reached!';
    msgBadge.textContent = "100 / 100";
    msgBadge.className = "counter-badge warning";
    progressBar.className = "progress-bar warning";
    msgStats.classList.add('active');
  }

  // Update statistics if text exists
  if (length > 0) {
    const stats = analyzeText(msgInput.value);
    updateStats('msg', stats);
  }

  // Add subtle animation on update
  msgBadge.style.transform = "scale(1.1)";
  setTimeout(() => {
    msgBadge.style.transform = "scale(1)";
  }, 200);
}

// Copy button handler
msgCopyBtn.addEventListener('click', () => {
  if (msgInput.value.trim() === '') {
    showToast('Nothing to copy!', 2000);
    return;
  }
  copyToClipboard(msgInput.value, 'Message');
});

// Clear button handler
msgClearBtn.addEventListener('click', () => {
  if (msgInput.value.trim() === '') {
    showToast('Already empty!', 2000);
    return;
  }
  msgInput.value = '';
  updateMsgInput();
  saveToLocalStorage('msgInputText', '');
  showToast('Message cleared! 🗑️');
});

// ============================================
// DARK MODE TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = loadFromLocalStorage('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    saveToLocalStorage('theme', 'dark');
    showToast('Dark mode activated! 🌙');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    saveToLocalStorage('theme', 'light');
    showToast('Light mode activated! ☀️');
  }
});

// ============================================
// VISUAL FEEDBACK ON TYPING
// ============================================

charInput.addEventListener("keydown", () => {
  charInput.style.transform = "scale(0.995)";
});

charInput.addEventListener("keyup", () => {
  charInput.style.transform = "scale(1)";
});

msgInput.addEventListener("keydown", () => {
  msgInput.style.transform = "scale(0.995)";
});

msgInput.addEventListener("keyup", () => {
  msgInput.style.transform = "scale(1)";
});
