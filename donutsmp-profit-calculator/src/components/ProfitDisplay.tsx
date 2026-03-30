import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useCalculatorStore } from '../store/calculator';

export const ProfitDisplay: React.FC = () => {
  const selectedRecipeId = useCalculatorStore((state) => state.selectedRecipeId);
  const recipes = useCalculatorStore((state) => state.recipes);
  const materials = useCalculatorStore((state) => state.materials);
  const sellPrice = useCalculatorStore((state) => state.sellPrice);
  const setSellPrice = useCalculatorStore((state) => state.setSellPrice);

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

  const totalCost = React.useMemo(() => {
    if (!selectedRecipe) return 0;
    return selectedRecipe.ingredients.reduce((sum, ingredient) => {
      const material = materials.find((m) => m.id === ingredient.materialId);
      return sum + (material?.price || 0) * ingredient.quantity;
    }, 0);
  }, [selectedRecipe, materials]);

  const profit = sellPrice - totalCost;
  const profitPercent = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(2) : '0.00';
  const isProfitable = profit >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-donut-orange border-opacity-20"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-donut-orange rounded-xl">
          <DollarSign size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-donut-dark dark:text-white">
          Gewinnrechnung
        </h2>
      </div>

      <div className="space-y-6">
        {/* Recipe Selection Info */}
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-donut-orange bg-opacity-10 rounded-xl border border-donut-orange border-opacity-30"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Aktuelles Rezept
            </p>
            <p className="text-lg font-semibold text-donut-orange">
              {selectedRecipe.name}
            </p>
          </motion.div>
        )}

        {/* Cost Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Produktionskosten
            </span>
            <motion.span
              key={totalCost}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-donut-dark dark:text-white"
            >
              💰 {totalCost.toFixed(2)}
            </motion.span>
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </motion.div>

        {/* Sell Price Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <label className="block text-gray-600 dark:text-gray-400 font-medium">
            Verkaufspreis eingeben
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
              💰
            </span>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
              className="input-field pl-12"
              placeholder="Verkaufspreis"
              step="0.01"
            />
          </div>
        </motion.div>

        {/* Profit Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border-2 ${
            isProfitable
              ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:bg-opacity-20 dark:border-green-800'
              : 'bg-red-50 border-red-300 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-800'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Gewinn
            </span>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
              {isProfitable ? (
                <TrendingUp
                  size={24}
                  className="text-green-500"
                />
              ) : (
                <TrendingDown size={24} className="text-red-500" />
              )}
            </div>
          </div>
          <motion.div
            key={profit}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-4xl font-bold ${
              isProfitable
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isProfitable ? '+' : ''} {profit.toFixed(2)}
          </motion.div>
          <motion.div
            key={profitPercent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm mt-2 font-semibold ${
              isProfitable
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {profitPercent}% Gewinnmarge
          </motion.div>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Kosten</span>
            <span className="font-semibold text-donut-dark dark:text-white">
              {totalCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Verkaufspreis</span>
            <span className="font-semibold text-donut-dark dark:text-white">
              {sellPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-donut-dark dark:text-white">
              Netto-Gewinn
            </span>
            <span
              className={`font-bold text-lg ${
                isProfitable
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isProfitable ? '+' : ''} {profit.toFixed(2)}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
