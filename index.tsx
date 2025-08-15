// --- CONFIGURATION ---
const DEVICE_ASPECT_RATIOS = {
  desktop: '16:9',
  tablet: '4:3',
  phone: '9:16',
};
const ASPECT_RATIO_CLASSES = {
  desktop: 'aspect-16-9',
  tablet: 'aspect-4-3',
  phone: 'aspect-9-16',
};
const INSPIRATION_PROMPTS = [
    "A serene Japanese garden with cherry blossoms under a full moon",
    "Minimalist mountain landscape with pastel sunset colors",
    "Futuristic neon cityscape with flying cars and holographic displays",
    "Abstract geometric patterns in vibrant blues and purples",
    "A majestic wolf howling at a galaxy-filled sky",
    "Cozy enchanted forest library with glowing mushrooms",
];


// --- DOM ELEMENTS ---
const form = document.getElementById('prompt-form') as HTMLFormElement;
const promptTextarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const deviceSelector = document.getElementById('device-selector') as HTMLElement;
const deviceButtons = deviceSelector.querySelectorAll('.device-btn');
const inspirationList = document.getElementById('inspiration-list') as HTMLElement;

const loadingSkeleton = document.getElementById('loading-skeleton') as HTMLElement;
const errorMessageEl = document.getElementById('error-message') as HTMLElement;
const placeholder = document.getElementById('placeholder') as HTMLElement;
const resultContainer = document.getElementById('result-container') as HTMLElement;
const resultImage = document.getElementById('result-image') as HTMLImageElement;
const downloadBtn = document.getElementById('download-btn') as HTMLAnchorElement;
const imageDisplayContainer = document.getElementById('image-display-container') as HTMLElement;

// --- STATE ---
let state = {
  prompt: '',
  device: 'desktop',
  isLoading: false,
  error: null as string | null,
  imageUrl: null as string | null,
};

// --- API SERVICE ---
async function callGenerateImage(prompt: string, aspectRatio: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, aspectRatio }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.imageUrl) {
      return data.imageUrl;
    } else {
      throw new Error('Invalid response from server.');
    }
  } catch (error) {
    console.error('Error calling generation API:', error);
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred.');
  }
}


// --- UI RENDERING & LOGIC ---

const ICONS = {
    SPARKLES: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z"></path></svg>`,
    LOADING: `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`
};

function render() {
  // Update Button State
  generateBtn.disabled = state.isLoading || !state.prompt.trim();
  if (state.isLoading) {
    generateBtn.innerHTML = `${ICONS.LOADING} Generating Wallpaper...`;
  } else {
    generateBtn.innerHTML = `${ICONS.SPARKLES} Generate Wallpaper`;
  }

  // Update visibility of display sections
  loadingSkeleton.classList.toggle('hidden', !state.isLoading);
  resultContainer.classList.toggle('hidden', state.isLoading || !state.imageUrl);
  errorMessageEl.classList.toggle('hidden', state.isLoading || !state.error);
  placeholder.classList.toggle('hidden', !!(state.isLoading || state.imageUrl || state.error));

  // Update content
  if (state.error) {
    errorMessageEl.innerHTML = `<p class="font-semibold">Generation Failed</p><p class="text-sm mt-1">${state.error}</p>`;
  }
  if (state.imageUrl) {
    resultImage.src = state.imageUrl;
    downloadBtn.href = state.imageUrl;
  }
}

function updateAspectContainer(device: string) {
    const newClass = ASPECT_RATIO_CLASSES[device];
    [loadingSkeleton, placeholder, resultContainer].forEach(el => {
        if (el) {
          Object.values(ASPECT_RATIO_CLASSES).forEach(cls => el.classList.remove(cls));
          el.classList.add(newClass);
        }
    });
}

function populateInspiration() {
    if (!inspirationList) return;
    inspirationList.innerHTML = ''; // Clear existing
    INSPIRATION_PROMPTS.forEach(prompt => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `"${prompt}"`;
        link.dataset.prompt = prompt;
        link.className = 'text-sm text-purple-600 hover:underline';
        inspirationList.appendChild(link);
    });
}

// --- EVENT HANDLERS ---
promptTextarea.addEventListener('input', (e) => {
  state.prompt = (e.target as HTMLTextAreaElement).value;
  render();
});

deviceButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (state.isLoading) return;
    
    state.device = (button as HTMLElement).dataset.device;
    deviceButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    updateAspectContainer(state.device);
  });
});

inspirationList.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.dataset.prompt) {
        promptTextarea.value = target.dataset.prompt;
        state.prompt = target.dataset.prompt;
        render();
        promptTextarea.focus();
    }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (state.isLoading || !state.prompt.trim()) return;

  state = { ...state, isLoading: true, error: null, imageUrl: null };
  render();
  
  try {
    const aspectRatio = DEVICE_ASPECT_RATIOS[state.device];
    const newImageUrl = await callGenerateImage(state.prompt, aspectRatio);
    state.imageUrl = newImageUrl;
  } catch (err) {
    state.error = err.message;
  } finally {
    state.isLoading = false;
    render();
  }
});

// --- INITIALIZATION ---
function init() {
  populateInspiration();
  updateAspectContainer(state.device);
  render();
}

init();