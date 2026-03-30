import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Plus, Trash2 } from 'lucide-react';
import { useCalculatorStore } from '../store/calculator';

export const RecipeSelector: React.FC = () => {
  const recipes = useCalculatorStore((state) => state.recipes);
  const selectedRecipeId = useCalculatorStore((state) => state.selectedRecipeId);
  const setSelectedRecipe = useCalculatorStore((state) => state.setSelectedRecipe);
  const deleteRecipe = useCalculatorStore((state) => state.deleteRecipe);
  const addRecipe = useCalculatorStore((state) => state.addRecipe);
  const materials = useCalculatorStore((state) => state.materials);

  const [showNewRecipe, setShowNewRecipe] = React.useState(false);
  const [newRecipe, setNewRecipe] = React.useState<{ name: string; ingredients: Array<{ materialId: string; quantity: number }> }>({
    name: '',
    ingredients: [{ materialId: materials[0]?.id || '', quantity: 1 }],
  });

  const handleAddRecipe = () => {
    if (newRecipe.name && newRecipe.ingredients.length > 0) {
      addRecipe({
        name: newRecipe.name,
        ingredients: newRecipe.ingredients,
      });
      setNewRecipe({
        name: '',
        ingredients: [{ materialId: materials[0]?.id || '', quantity: 1 }],
      });
      setShowNewRecipe(false);
    }
  };

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <ChefHat size={28} className="text-donut-orange" />
        <h2 className="text-2xl font-bold text-donut-dark dark:text-white">
          Rezepte
        </h2>
      </div>

      <div className="grid gap-3 mb-6">
        {recipes.map((recipe) => (
          <motion.button
            key={recipe.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRecipe(recipe.id)}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedRecipeId === recipe.id
                ? 'bg-donut-orange text-white shadow-soft-md'
                : 'bg-gray-50 text-donut-dark hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            }`}
          >
            <div className="font-semibold">{recipe.name}</div>
            <div className={`text-sm ${selectedRecipeId === recipe.id ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {recipe.ingredients.length} Zutat{recipe.ingredients.length !== 1 ? 'en' : ''}
            </div>
          </motion.button>
        ))}
      </div>

      {selectedRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-semibold text-donut-dark dark:text-white mb-3">
            Zutaten für {selectedRecipe.name}:
          </h3>
          <div className="space-y-2">
            {selectedRecipe.ingredients.map((ingredient, idx) => {
              const material = materials.find((m) => m.id === ingredient.materialId);
              return (
                <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    {material?.name || 'Unknown'} × {ingredient.quantity}
                  </span>
                  <span className="font-semibold">
                    💰 {(material?.price || 0) * ingredient.quantity}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {showNewRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6"
        >
          <input
            type="text"
            value={newRecipe.name}
            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            placeholder="Rezept Name"
            className="input-field mb-4"
          />
          <div className="space-y-3 mb-4">
            {newRecipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex gap-3">
                <select
                  value={ingredient.materialId}
                  onChange={(e) => {
                    const newIngredients = [...newRecipe.ingredients];
                    newIngredients[idx].materialId = e.target.value;
                    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                  }}
                  className="input-field flex-1"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const newIngredients = [...newRecipe.ingredients];
                    newIngredients[idx].quantity = parseInt(e.target.value) || 1;
                    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
                  }}
                  className="input-field w-20"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRecipe}
              className="btn-primary flex-1"
            >
              Speichern
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewRecipe(false)}
              className="btn-secondary flex-1"
            >
              Abbrechen
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700 pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewRecipe(!showNewRecipe)}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Neues Rezept
        </motion.button>
        {selectedRecipeId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              deleteRecipe(selectedRecipeId);
              setSelectedRecipe(recipes[0]?.id || null);
            }}
            className="p-3 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900"
          >
            <Trash2 size={20} className="text-red-500" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
