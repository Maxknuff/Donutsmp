/* ====================================================================
   DONUTSMP PROFIT CALCULATOR — app.js
   ==================================================================== */

// ─── Initial Data ───────────────────────────────────────────────────
const DEFAULT_MATERIALS = [
  { id: 'redstone',      name: 'Redstone',         emoji: '🔴', price: 5    },
  { id: 'redstone_block',name: 'Redstone-Block',   emoji: '🟥', price: 45,   linkedTo: 'redstone', linkRatio: 9 },
  { id: 'stone',         name: 'Stein',             emoji: '🪨', price: 0.5  },
  { id: 'iron',          name: 'Eisenbarren',       emoji: '⚙️', price: 20   },
  { id: 'iron_block',    name: 'Eisenblock',        emoji: '🧊', price: 180,  linkedTo: 'iron', linkRatio: 9 },
  { id: 'gold',          name: 'Goldbarren',        emoji: '🟡', price: 40   },
  { id: 'gold_block',    name: 'Goldblock',         emoji: '🟨', price: 360,  linkedTo: 'gold', linkRatio: 9 },
  { id: 'diamond',       name: 'Diamant',           emoji: '💎', price: 200  },
  { id: 'diamond_block', name: 'Diamantblock',      emoji: '💠', price: 1800, linkedTo: 'diamond', linkRatio: 9 },
  { id: 'wood',          name: 'Holz',              emoji: '🪵', price: 1    },
  { id: 'coal',          name: 'Kohle',             emoji: '⬛', price: 2    },
  { id: 'coal_block',    name: 'Kohleblock',        emoji: '⬛', price: 18,   linkedTo: 'coal', linkRatio: 9 },
  { id: 'torch',         name: 'Fackel',            emoji: '🔦', price: 1.5  },
  { id: 'quartz',        name: 'Quarz',             emoji: '🪨', price: 8    },
  { id: 'quartz_block',  name: 'Quarzblock',        emoji: '⬜', price: 32,   linkedTo: 'quartz', linkRatio: 4 },
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
  recipePrices: {}, // { 'repeater': 50, 'piston': 30 }
  qty: 1,
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
    localStorage.setItem('donutsmp_materials_v2', JSON.stringify(state.materials));
    localStorage.setItem('donutsmp_recipes_v2',   JSON.stringify(state.recipes));
    localStorage.setItem('donutsmp_recipe_prices', JSON.stringify(state.recipePrices));
    localStorage.setItem('donutsmp_theme',     state.darkMode ? '1' : '0');
  } catch(e) { /* ignore */ }
}

function loadState() {
  try {
    const mats = localStorage.getItem('donutsmp_materials_v2');
    const recs = localStorage.getItem('donutsmp_recipes_v2');
    const rPrices = localStorage.getItem('donutsmp_recipe_prices');
    const theme = localStorage.getItem('donutsmp_theme');
    
    if (mats) state.materials = JSON.parse(mats);
    else state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
    
    if (recs) state.recipes = JSON.parse(recs);
    else state.recipes = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
    
    if (rPrices) state.recipePrices = JSON.parse(rPrices);
    else state.recipePrices = {};
    
    if (theme === '1') state.darkMode = true;
  } catch(e) {
    state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
    state.recipes   = JSON.parse(JSON.stringify(DEFAULT_RECIPES));
    state.recipePrices = {};
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

// ─── Collapsible Panel ──────────────────────────────────────────────
function toggleMaterials() {
  const wrapper = document.getElementById('materials-list-wrapper');
  const btn = document.getElementById('btn-toggle-materials');
  wrapper.classList.toggle('collapsed');
  btn.classList.toggle('collapsed');
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
      
      // Update linked materials
      if (mat.linkedTo) {
        // Mat is a block, update its base
        const parent = getMaterial(mat.linkedTo);
        if (parent && mat.linkRatio) {
          parent.price = val / mat.linkRatio;
          const pInput = document.getElementById(`mat-price-${parent.id}`);
          if (pInput) pInput.value = parseFloat(parent.price).toFixed(2);
        }
      } else {
        // Mat might be a base, update any derived blocks
        state.materials.forEach(child => {
          if (child.linkedTo === mat.id && child.linkRatio) {
            child.price = val * child.linkRatio;
            const cInput = document.getElementById(`mat-price-${child.id}`);
            if (cInput) cInput.value = parseFloat(child.price).toFixed(2);
          }
        });
      }
      
      saveState();
      renderRecipes(); // Cost changes
      recalculate(); // Best trade changes
    });

    // Delete
    item.querySelector('.mat-delete').addEventListener('click', () => {
      state.materials = state.materials.filter(m => m.id !== mat.id);
      saveState();
      renderMaterials();
      renderRecipes();
      recalculate();
      showToast(`🗑️ ${mat.name} entfernt`);
    });
  });

  lucide.createIcons();
}

// ─── Render: Recipes List ──────────────────────────────────────────
function renderRecipes() {
  const container = document.getElementById('recipes-list');
  container.innerHTML = '';
  
  state.recipes.forEach(r => {
    const sellP = state.recipePrices[r.id] || 0;
    
    // calculate cost for UI
    let cost = 0;
    r.ingredients.forEach(i => {
       const m = getMaterial(i.materialId);
       if (m) cost += m.price * i.amount;
    });
    cost = cost / r.yield;
    
    // global qty applied just for checking visual profit indicator logic
    const gCost = cost * state.qty;
    const gRev  = sellP * state.qty;
    const gProfit = gRev - gCost;
    
    const profitStr = sellP > 0 ? (gProfit >= 0 ? '+' : '') + fmtPrice(gProfit) : '–';
    const profitClass = sellP > 0 ? (gProfit >= 0 ? 'positive' : 'negative') : 'neutral';
    
    const div = document.createElement('div');
    div.className = 'recipe-list-item';
    
    div.innerHTML = `
      <span class="rl-emoji">${r.emoji}</span>
      <div class="rl-info">
        <div class="rl-name">${r.name}</div>
        <div class="rl-cost">Kostet ${fmtPrice(cost)} / Stück</div>
      </div>
      <div class="rl-inputs">
        <input type="number" class="rl-price-input" placeholder="VK-Preis" value="${sellP > 0 ? sellP : ''}" step="0.01" min="0" />
        <div class="rl-profit-label ${profitClass}">${profitStr}</div>
      </div>
    `;
    
    div.querySelector('.rl-price-input').addEventListener('input', e => {
       state.recipePrices[r.id] = parseFloat(e.target.value) || 0;
       saveState();
       renderRecipes(); // Render self for local updates
       recalculate();   // Run best trade logic
    });
    
    container.appendChild(div);
  });
}

// ─── Calculation: Best Trade ────────────────────────────────────────
function recalculate() {
  let bestRecipe = null;
  let bestProfit = -Infinity;
  let bestData = null;
  
  const qty = state.qty;

  // Find the most profitable trade
  state.recipes.forEach(r => {
    const sellPrice = state.recipePrices[r.id] || 0;
    if (sellPrice <= 0) return; // ignore items without sell price
    
    let totalCostPerCraft = 0;
    let valid = true;
    const breakdown = [];
    
    r.ingredients.forEach(ing => {
      const mat = getMaterial(ing.materialId);
      if (mat) {
        const cost = mat.price * ing.amount;
        totalCostPerCraft += cost;
        breakdown.push({ emoji: mat.emoji, name: mat.name, amount: ing.amount, price: mat.price, total: cost * qty });
      } else {
        valid = false;
        breakdown.push({ emoji: '❓', name: ing.materialId, amount: ing.amount, price: null, total: null });
      }
    });

    if (valid) {
      const costPerItem = totalCostPerCraft / r.yield;
      const totalCost   = costPerItem * qty;
      const revenue     = sellPrice * qty;
      const profit      = revenue - totalCost;
      const margin      = revenue > 0 ? (profit / revenue) * 100 : 0;
      
      // We look for highest absolute profit
      if (profit > bestProfit) {
        bestProfit = profit;
        bestRecipe = r;
        bestData = { totalCost, revenue, profit, margin, breakdown };
      }
    }
  });

  const pdDisplay   = document.getElementById('profit-display');
  const titleVal    = document.getElementById('best-trade-title');
  const nameVal     = document.getElementById('best-trade-name');
  const profitVal   = document.getElementById('profit-value');
  const profitLbl   = document.getElementById('profit-label');
  const profitBadge = document.getElementById('profit-badge');
  const profitEmoji = document.getElementById('profit-emoji');
  
  const resCost    = document.getElementById('res-cost');
  const resRev     = document.getElementById('res-revenue');
  const resMarg    = document.getElementById('res-margin');
  const resProfit  = document.getElementById('res-profit-total');
  const mbList     = document.getElementById('material-breakdown-list');

  // Pulse animation trigger
  profitVal.classList.remove('pulse');
  void profitVal.offsetWidth;
  profitVal.classList.add('pulse');

  if (!bestRecipe || bestProfit < 0) { // NO profitable trade found
    titleVal.textContent     = 'Momentan bester Trade';
    nameVal.textContent      = bestRecipe && bestProfit < 0 ? 'Nur Miese machbar' : 'Keine profitablen Trades';
    profitVal.textContent    = '–';
    profitVal.className      = 'profit-value';
    pdDisplay.className      = 'profit-display';
    profitEmoji.textContent  = '💤';
    profitLbl.textContent    = 'Verkaufspreise eintragen';
    
    resCost.textContent = '–'; resRev.textContent = '–';
    resMarg.textContent = '–'; resProfit.textContent = '–';
    resCost.className = 'breakdown-val'; resRev.className = 'breakdown-val'; resMarg.className = 'breakdown-val'; resProfit.className = 'breakdown-val';
    mbList.innerHTML = '';
    return;
  }

  // --- Show best trade ---
  pdDisplay.className      = 'profit-display ' + (bestData.profit >= 0 ? 'positive' : 'negative');
  profitVal.className      = 'profit-value ' + (bestData.profit >= 0 ? 'positive' : 'negative');
  profitEmoji.textContent  = bestData.profit > 0 ? '🏆' : '😐';
  profitLbl.textContent    = bestData.profit >= 0 ? `Gewinn (für ${qty}x)` : 'Verlust';
  titleVal.textContent     = '🏆 Bester Trade 🏆';
  nameVal.textContent      = `${bestRecipe.emoji} ${bestRecipe.name}`;
  profitVal.textContent    = fmtPrice(bestData.profit);

  resCost.textContent = fmtPrice(bestData.totalCost);
  resCost.className = 'breakdown-val';

  resRev.textContent = fmtPrice(bestData.revenue);
  resRev.className = 'breakdown-val';

  resMarg.textContent = `${bestData.margin.toFixed(1)} %`;
  resMarg.className = 'breakdown-val ' + (bestData.margin >= 0 ? 'positive' : 'negative');

  resProfit.textContent = fmtPrice(bestData.profit);
  resProfit.className = 'breakdown-val ' + (bestData.profit >= 0 ? 'positive' : 'negative');

  // Material breakdown
  mbList.innerHTML = '';
  bestData.breakdown.forEach(b => {
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
  renderRecipes();
  recalculate();

  // ── Toggle Materials
  document.getElementById('btn-toggle-materials').addEventListener('click', toggleMaterials);

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
      state.recipePrices = {};
      state.qty = 1;
      document.getElementById('craft-qty').value = 1;
      saveState();
      renderMaterials();
      renderRecipes();
      recalculate();
      showToast('↩️ Zurückgesetzt');
    }
  });

  // ── Qty
  const qtyInput = document.getElementById('craft-qty');

  document.getElementById('qty-minus').addEventListener('click', () => {
    state.qty = Math.max(1, state.qty - 1);
    qtyInput.value = state.qty;
    renderRecipes();
    recalculate();
  });

  document.getElementById('qty-plus').addEventListener('click', () => {
    state.qty = Math.min(9999, state.qty + 1);
    qtyInput.value = state.qty;
    renderRecipes();
    recalculate();
  });

  qtyInput.addEventListener('input', e => {
    state.qty = Math.max(1, parseInt(e.target.value) || 1);
    renderRecipes();
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
    renderRecipes();
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
    saveState();
    renderRecipes();
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
