/* ====================================================================
   DONUTSMP PROFIT CALCULATOR — app.js
   ==================================================================== */

// ─── Initial Data ───────────────────────────────────────────────────
const DEFAULT_MATERIALS = [
  { id: 'redstone',      name: 'Redstone',         emoji: '🔴', price: 5    },
  { id: 'stone',         name: 'Stein',             emoji: '🪨', price: 0.5  },
  { id: 'iron',          name: 'Eisenbarren',       emoji: '⚙️', price: 20   },
  { id: 'gold',          name: 'Goldbarren',        emoji: '🟡', price: 40   },
  { id: 'diamond',       name: 'Diamant',           emoji: '💎', price: 200  },
  { id: 'wood',          name: 'Holz',              emoji: '🪵', price: 1    },
  { id: 'coal',          name: 'Kohle',             emoji: '⬛', price: 2    },
  { id: 'torch',         name: 'Fackel',            emoji: '🔦', price: 1.5  },
  { id: 'quartz',        name: 'Quarz',             emoji: '🪨', price: 8    },
  { id: 'cobblestone',   name: 'Kopfsteinpflaster', emoji: '🪨', price: 0.2  },
  { id: 'r_torch',       name: 'Redstone-Fackel',   emoji: '🕯️', price: 7    },
];

const DEFAULT_RECIPES = [
  {
    id: 'repeater',
    name: 'Repeater',
    emoji: '↩️',
    yield: 1,
    ingredients: [
      { materialId: 'stone',  amount: 3 },
      { materialId: 'redstone', amount: 2 },
      { materialId: 'r_torch', amount: 1 },
    ]
  },
  {
    id: 'comparator',
    name: 'Komparator',
    emoji: '🔁',
    yield: 1,
    ingredients: [
      { materialId: 'stone',   amount: 3 },
      { materialId: 'redstone', amount: 3 },
      { materialId: 'r_torch', amount: 1 },
    ]
  },
  {
    id: 'piston',
    name: 'Piston',
    emoji: '🔧',
    yield: 1,
    ingredients: [
      { materialId: 'wood',        amount: 3 },
      { materialId: 'cobblestone', amount: 4 },
      { materialId: 'iron',        amount: 1 },
      { materialId: 'redstone',    amount: 1 },
    ]
  },
  {
    id: 'furnace',
    name: 'Ofen',
    emoji: '🔥',
    yield: 1,
    ingredients: [
      { materialId: 'cobblestone', amount: 8 },
    ]
  },
  {
    id: 'chest',
    name: 'Truhe',
    emoji: '📦',
    yield: 1,
    ingredients: [
      { materialId: 'wood', amount: 8 },
    ]
  },
  {
    id: 'gold_sword',
    name: 'Goldschwert',
    emoji: '⚔️',
    yield: 1,
    ingredients: [
      { materialId: 'gold', amount: 2 },
      { materialId: 'wood', amount: 1 },
    ]
  },
  {
    id: 'iron_sword',
    name: 'Eisenschwert',
    emoji: '🗡️',
    yield: 1,
    ingredients: [
      { materialId: 'iron', amount: 2 },
      { materialId: 'wood', amount: 1 },
    ]
  },
  {
    id: 'hopper',
    name: 'Trichter',
    emoji: '🪣',
    yield: 1,
    ingredients: [
      { materialId: 'iron',  amount: 5 },
      { materialId: 'chest', amount: 1 },
    ]
  },
];

// ─── State ──────────────────────────────────────────────────────────
let state = {
  materials: [],
  recipes:   [],
  selectedRecipeId: null,
  qty: 1,
  sellPrice: 0,
  darkMode: false,
};

// ─── Helpers ────────────────────────────────────────────────────────
function fmtPrice(n) {
  if (n === null || n === undefined || isNaN(n)) return '–';
  const rounded = Math.round(n * 100) / 100;
  return `$${rounded.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function genId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function getMaterial(id) {
  return state.materials.find(m => m.id === id);
}

function getRecipe(id) {
  return state.recipes.find(r => r.id === id);
}

// ─── Persistence ────────────────────────────────────────────────────
function saveState() {
  try {
    localStorage.setItem('donutsmp_materials', JSON.stringify(state.materials));
    localStorage.setItem('donutsmp_recipes',   JSON.stringify(state.recipes));
    localStorage.setItem('donutsmp_theme',     state.darkMode ? '1' : '0');
  } catch(e) { /* ignore */ }
}

function loadState() {
  try {
    const mats = localStorage.getItem('donutsmp_materials');
    const recs = localStorage.getItem('donutsmp_recipes');
    const theme = localStorage.getItem('donutsmp_theme');
    if (mats) state.materials = JSON.parse(mats);
    else state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
    if (recs) state.recipes = JSON.parse(recs);
    else state.recipes = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
    if (theme === '1') state.darkMode = true;
  } catch(e) {
    state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
    state.recipes   = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
  }
}

// ─── Toast ──────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ─── Theme ──────────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : '');
  const icon = document.querySelector('#btn-theme i');
  icon.setAttribute('data-lucide', state.darkMode ? 'moon' : 'sun');
  lucide.createIcons();
}

// ─── Render: Materials ──────────────────────────────────────────────
function renderMaterials() {
  const list = document.getElementById('materials-list');
  list.innerHTML = '';

  state.materials.forEach(mat => {
    const item = document.createElement('div');
    item.className = 'material-item';
    item.dataset.id = mat.id;
    item.innerHTML = `
      <span class="mat-emoji">${mat.emoji}</span>
      <div class="mat-info">
        <div class="mat-name">${mat.name}</div>
        <div class="mat-price-wrap">
          <span class="mat-price-symbol">$</span>
          <input
            class="mat-price-input"
            type="number"
            value="${mat.price}"
            min="0"
            step="0.01"
            aria-label="Preis für ${mat.name}"
            id="mat-price-${mat.id}"
          />
        </div>
      </div>
      <button class="mat-delete" title="${mat.name} entfernen" aria-label="${mat.name} entfernen">
        <i data-lucide="trash-2"></i>
      </button>
    `;
    list.appendChild(item);

    // Price change
    item.querySelector('.mat-price-input').addEventListener('input', e => {
      const val = parseFloat(e.target.value) || 0;
      mat.price = val;
      saveState();
      recalculate();
    });

    // Delete
    item.querySelector('.mat-delete').addEventListener('click', () => {
      state.materials = state.materials.filter(m => m.id !== mat.id);
      saveState();
      renderMaterials();
      renderRecipeSelect();
      renderRecipeCard();
      recalculate();
      showToast(`🗑️ ${mat.name} entfernt`);
    });
  });

  lucide.createIcons();
}

// ─── Render: Recipe Select ──────────────────────────────────────────
function renderRecipeSelect() {
  const sel = document.getElementById('recipe-select');
  const currentVal = sel.value;
  sel.innerHTML = '';

  state.recipes.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.emoji} ${r.name}`;
    sel.appendChild(opt);
  });

  // Try to restore selection
  if (state.selectedRecipeId && state.recipes.find(r => r.id === state.selectedRecipeId)) {
    sel.value = state.selectedRecipeId;
  } else if (state.recipes.length) {
    state.selectedRecipeId = state.recipes[0].id;
    sel.value = state.selectedRecipeId;
  }
}

// ─── Render: Recipe Card ────────────────────────────────────────────
function renderRecipeCard() {
  const card = document.getElementById('recipe-card');
  const recipe = getRecipe(state.selectedRecipeId);

  if (!recipe) {
    card.innerHTML = `<div class="no-recipe">Kein Rezept ausgewählt</div>`;
    return;
  }

  const yieldText = recipe.yield > 1 ? `Ertrag: ${recipe.yield}x` : '1 Item pro Craft';

  card.innerHTML = `
    <div class="recipe-header">
      <span class="recipe-emoji">${recipe.emoji}</span>
      <div class="recipe-meta">
        <h3>${recipe.name}</h3>
        <p>${yieldText}</p>
      </div>
    </div>
    <div class="recipe-ingredients">
      ${recipe.ingredients.map(ing => {
        const mat = getMaterial(ing.materialId);
        const emoji = mat ? mat.emoji : '❓';
        const name  = mat ? mat.name  : ing.materialId;
        return `
          <div class="ingredient-row" title="${name}: $${mat ? mat.price : '?'} / Stück">
            <div class="ingredient-left">
              <span class="ing-emoji">${emoji}</span>
              <span class="ing-name">${name}</span>
            </div>
            <span class="ing-amount">×${ing.amount}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ─── Calculation ────────────────────────────────────────────────────
function recalculate() {
  const recipe = getRecipe(state.selectedRecipeId);
  const qty = state.qty;

  const pdDisplay = document.getElementById('profit-display');
  const profitVal  = document.getElementById('profit-value');
  const profitLbl  = document.getElementById('profit-label');
  const profitBadge = document.getElementById('profit-badge');
  const profitEmoji = document.getElementById('profit-emoji');
  const resCost    = document.getElementById('res-cost');
  const resRev     = document.getElementById('res-revenue');
  const resMarg    = document.getElementById('res-margin');
  const resProfit  = document.getElementById('res-profit-total');
  const mbList     = document.getElementById('material-breakdown-list');

  if (!recipe) {
    profitVal.textContent = '–';
    resCost.textContent = '–'; resRev.textContent = '–';
    resMarg.textContent = '–'; resProfit.textContent = '–';
    mbList.innerHTML = '';
    return;
  }

  // Calculate costs
  let totalCostPerCraft = 0;
  let allPricesKnown = true;
  const breakdown = [];

  for (const ing of recipe.ingredients) {
    const mat = getMaterial(ing.materialId);
    if (mat) {
      const cost = mat.price * ing.amount;
      totalCostPerCraft += cost;
      breakdown.push({ emoji: mat.emoji, name: mat.name, amount: ing.amount, price: mat.price, total: cost * qty });
    } else {
      allPricesKnown = false;
      breakdown.push({ emoji: '❓', name: ing.materialId, amount: ing.amount, price: null, total: null });
    }
  }

  // Per craft cost (accounting for recipe yield)
  const costPerItem = totalCostPerCraft / recipe.yield;
  const totalCost   = costPerItem * qty;
  const revenue     = state.sellPrice * qty;
  const profit      = revenue - totalCost;
  const margin      = revenue > 0 ? (profit / revenue) * 100 : null;

  // Animate number change
  profitVal.classList.remove('pulse');
  void profitVal.offsetWidth; // reflow
  profitVal.classList.add('pulse');

  // Set profit display
  if (state.sellPrice === 0) {
    profitVal.textContent = '–';
    profitVal.className = 'profit-value';
    pdDisplay.className = 'profit-display';
    profitEmoji.textContent = '💰';
    profitLbl.textContent = 'Gewinn (Verkaufspreis eingeben)';
  } else {
    profitVal.textContent = fmtPrice(profit);
    pdDisplay.className = 'profit-display ' + (profit >= 0 ? 'positive' : 'negative');
    profitVal.className = 'profit-value ' + (profit >= 0 ? 'positive' : 'negative');
    profitEmoji.textContent = profit > 0 ? '🤑' : profit === 0 ? '😐' : '📉';
    profitLbl.textContent = profit >= 0 ? 'Gewinn' : 'Verlust';
  }

  resCost.textContent = fmtPrice(totalCost);
  resCost.className = 'breakdown-val';

  resRev.textContent = state.sellPrice > 0 ? fmtPrice(revenue) : '–';
  resRev.className = 'breakdown-val';

  if (margin !== null) {
    resMarg.textContent = `${margin.toFixed(1)} %`;
    resMarg.className = 'breakdown-val ' + (margin >= 0 ? 'positive' : 'negative');
  } else {
    resMarg.textContent = '–';
    resMarg.className = 'breakdown-val';
  }

  if (state.sellPrice > 0) {
    resProfit.textContent = fmtPrice(profit);
    resProfit.className = 'breakdown-val ' + (profit >= 0 ? 'positive' : 'negative');
  } else {
    resProfit.textContent = '–';
    resProfit.className = 'breakdown-val';
  }

  // Material breakdown
  mbList.innerHTML = '';
  breakdown.forEach(b => {
    const row = document.createElement('div');
    row.className = 'mat-breakdown-row';
    row.innerHTML = `
      <div class="mat-breakdown-left">
        <span>${b.emoji}</span>
        <span>${b.name} ×${b.amount * qty}</span>
      </div>
      <div class="mat-breakdown-right">
        ${b.total !== null
          ? fmtPrice(b.total)
          : '<span class="mbd-missing">Preis fehlt</span>'}
      </div>
    `;
    mbList.appendChild(row);
  });
}

// ─── Modal Helpers ──────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ─── Init ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyTheme();

  // Initial render
  renderMaterials();
  renderRecipeSelect();
  renderRecipeCard();
  recalculate();

  // ── Theme toggle
  document.getElementById('btn-theme').addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    applyTheme();
    saveState();
  });

  // ── Reset
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Alle Daten zurücksetzen?')) {
      state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
      state.recipes   = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
      state.qty = 1;
      state.sellPrice = 0;
      state.selectedRecipeId = state.recipes[0].id;
      document.getElementById('craft-qty').value = 1;
      document.getElementById('sell-price').value = '';
      saveState();
      renderMaterials();
      renderRecipeSelect();
      renderRecipeCard();
      recalculate();
      showToast('↩️ Zurückgesetzt');
    }
  });

  // ── Recipe select
  document.getElementById('recipe-select').addEventListener('change', e => {
    state.selectedRecipeId = e.target.value;
    renderRecipeCard();
    recalculate();
  });

  // ── Qty
  const qtyInput = document.getElementById('craft-qty');

  document.getElementById('qty-minus').addEventListener('click', () => {
    state.qty = Math.max(1, state.qty - 1);
    qtyInput.value = state.qty;
    recalculate();
  });

  document.getElementById('qty-plus').addEventListener('click', () => {
    state.qty = Math.min(9999, state.qty + 1);
    qtyInput.value = state.qty;
    recalculate();
  });

  qtyInput.addEventListener('input', e => {
    state.qty = Math.max(1, parseInt(e.target.value) || 1);
    recalculate();
  });

  // ── Sell price
  document.getElementById('sell-price').addEventListener('input', e => {
    state.sellPrice = parseFloat(e.target.value) || 0;
    recalculate();
  });

  // ────────────────────────────────────────────────────────────────
  //  MODAL: Add Material
  // ────────────────────────────────────────────────────────────────
  document.getElementById('btn-add-material').addEventListener('click', () => {
    document.getElementById('new-mat-name').value  = '';
    document.getElementById('new-mat-emoji').value = '📦';
    document.getElementById('new-mat-price').value = '';
    openModal('modal-material');
    setTimeout(() => document.getElementById('new-mat-name').focus(), 100);
  });

  document.getElementById('btn-save-material').addEventListener('click', () => {
    const name  = document.getElementById('new-mat-name').value.trim();
    const emoji = document.getElementById('new-mat-emoji').value.trim() || '📦';
    const price = parseFloat(document.getElementById('new-mat-price').value) || 0;

    if (!name) { showToast('⚠️ Bitte einen Namen eingeben'); return; }

    const mat = { id: genId(), name, emoji, price };
    state.materials.push(mat);
    saveState();
    renderMaterials();
    closeModal('modal-material');
    showToast(`✅ ${emoji} ${name} hinzugefügt`);
  });

  // ────────────────────────────────────────────────────────────────
  //  MODAL: Add Recipe
  // ────────────────────────────────────────────────────────────────
  document.getElementById('btn-add-recipe').addEventListener('click', () => {
    document.getElementById('new-rec-name').value  = '';
    document.getElementById('new-rec-emoji').value = '🧪';
    document.getElementById('new-rec-yield').value = '1';
    document.getElementById('new-rec-ingredients').innerHTML = '';
    openModal('modal-recipe');
    addIngredientRow(); // start with one row
    setTimeout(() => document.getElementById('new-rec-name').focus(), 100);
  });

  document.getElementById('btn-add-ingredient').addEventListener('click', addIngredientRow);

  document.getElementById('btn-save-recipe').addEventListener('click', () => {
    const name  = document.getElementById('new-rec-name').value.trim();
    const emoji = document.getElementById('new-rec-emoji').value.trim() || '🧪';
    const yld   = parseInt(document.getElementById('new-rec-yield').value) || 1;

    if (!name) { showToast('⚠️ Item-Name fehlt'); return; }

    const rows = document.querySelectorAll('.ingredient-row-modal');
    const ingredients = [];
    let valid = true;

    rows.forEach(row => {
      const matId  = row.querySelector('select').value;
      const amount = parseInt(row.querySelector('input').value) || 0;
      if (!matId || amount <= 0) { valid = false; return; }
      ingredients.push({ materialId: matId, amount });
    });

    if (!valid || ingredients.length === 0) {
      showToast('⚠️ Mindestens eine gültige Zutat erforderlich');
      return;
    }

    const recipe = { id: genId(), name, emoji, yield: yld, ingredients };
    state.recipes.push(recipe);
    state.selectedRecipeId = recipe.id;
    saveState();
    renderRecipeSelect();
    renderRecipeCard();
    recalculate();
    closeModal('modal-recipe');
    showToast(`✅ ${emoji} ${name} gespeichert`);
  });

  // ── Close modals
  document.querySelectorAll('.modal-close, .btn-secondary[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Keyboard: Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
  });

  // ── Lucide icons init
  lucide.createIcons();
});

// ─── Add Ingredient Row ──────────────────────────────────────────────
function addIngredientRow() {
  const container = document.getElementById('new-rec-ingredients');
  const row = document.createElement('div');
  row.className = 'ingredient-row-modal';

  // Build material options
  const options = state.materials.map(m =>
    `<option value="${m.id}">${m.emoji} ${m.name}</option>`
  ).join('');

  row.innerHTML = `
    <select aria-label="Material auswählen">
      <option value="">— Material —</option>
      ${options}
    </select>
    <input type="number" placeholder="Menge" min="1" value="1" aria-label="Menge" />
    <button class="ing-delete" title="Entfernen" aria-label="Zutat entfernen">
      <i data-lucide="x"></i>
    </button>
  `;

  row.querySelector('.ing-delete').addEventListener('click', () => row.remove());
  container.appendChild(row);
  lucide.createIcons();
}
