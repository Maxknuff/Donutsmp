import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { MaterialList } from './components/MaterialList';
import { RecipeSelector } from './components/RecipeSelector';
import { ProfitDisplay } from './components/ProfitDisplay';
import { ControlPanel } from './components/ControlPanel';
import { useCalculatorStore } from './store/calculator';
import './index.css';

function App() {
  const darkMode = useCalculatorStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'dark bg-donut-dark' : 'bg-donut-light'
    }`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-donut-orange to-orange-600 rounded-2xl">
                <Zap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-donut-dark dark:text-white">
                  DonutSMP Profit Calculator
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Berechne deine Gewinne mit Präzision
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Materials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MaterialList />
          </motion.div>

          {/* Middle Column - Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RecipeSelector />
          </motion.div>

          {/* Right Column - Profit Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            <ProfitDisplay />
            <ControlPanel />
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-8 mt-8">
          <RecipeSelector />
          <ProfitDisplay />
          <ControlPanel />
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8 text-center text-gray-500 dark:text-gray-400"
      >
        <p>
          Erstellt mit ❤️ für die DonutSMP Community | © 2026
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
