import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Material {
  id: string;
  name: string;
  price: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: {
    materialId: string;
    quantity: number;
  }[];
}

export interface CalculatorState {
  materials: Material[];
  recipes: Recipe[];
  selectedRecipeId: string | null;
  sellPrice: number;
  darkMode: boolean;

  // Material actions
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  // Recipe actions
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  setSelectedRecipe: (id: string | null) => void;

  // Other actions
  setSellPrice: (price: number) => void;
  toggleDarkMode: () => void;

  // Data persistence
  exportData: () => string;
  importData: (data: string) => void;
  resetData: () => void;
}

const defaultMaterials: Material[] = [
  { id: '1', name: 'Redstone', price: 10 },
  { id: '2', name: 'Stein', price: 5 },
  { id: '3', name: 'Eisen', price: 20 },
  { id: '4', name: 'Gold', price: 30 },
  { id: '5', name: 'Diamant', price: 100 },
  { id: '6', name: 'Kupfer', price: 15 },
];

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Repeater',
    ingredients: [
      { materialId: '2', quantity: 3 },
      { materialId: '1', quantity: 2 },
    ],
  },
  {
    id: '2',
    name: 'Comparator',
    ingredients: [
      { materialId: '2', quantity: 3 },
      { materialId: '1', quantity: 3 },
      { materialId: '3', quantity: 1 },
    ],
  },
  {
    id: '3',
    name: 'Hopper',
    ingredients: [
      { materialId: '3', quantity: 5 },
      { materialId: '1', quantity: 1 },
    ],
  },
  {
    id: '4',
    name: 'Piston',
    ingredients: [
      { materialId: '2', quantity: 3 },
      { materialId: '1', quantity: 4 },
      { materialId: '3', quantity: 1 },
    ],
  },
];

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      materials: defaultMaterials,
      recipes: defaultRecipes,
      selectedRecipeId: '1',
      sellPrice: 100,
      darkMode: false,

      addMaterial: (material) =>
        set((state) => ({
          materials: [
            ...state.materials,
            { ...material, id: Date.now().toString() },
          ],
        })),

      updateMaterial: (id, material) =>
        set((state) => ({
          materials: state.materials.map((m) =>
            m.id === id ? { ...m, ...material } : m
          ),
        })),

      deleteMaterial: (id) =>
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== id),
        })),

      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [...state.recipes, { ...recipe, id: Date.now().toString() }],
        })),

      updateRecipe: (id, recipe) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...recipe } : r
          ),
        })),

      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
          selectedRecipeId: state.selectedRecipeId === id ? null : state.selectedRecipeId,
        })),

      setSelectedRecipe: (id) =>
        set(() => ({
          selectedRecipeId: id,
        })),

      setSellPrice: (price) =>
        set(() => ({
          sellPrice: price,
        })),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            materials: state.materials,
            recipes: state.recipes,
          },
          null,
          2
        );
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            materials: parsed.materials || defaultMaterials,
            recipes: parsed.recipes || defaultRecipes,
          });
        } catch (error) {
          console.error('Invalid JSON data', error);
        }
      },

      resetData: () =>
        set(() => ({
          materials: defaultMaterials,
          recipes: defaultRecipes,
          selectedRecipeId: '1',
          sellPrice: 100,
        })),
    }),
    {
      name: 'donutsmp-calculator-store',
      version: 1,
    }
  )
);
