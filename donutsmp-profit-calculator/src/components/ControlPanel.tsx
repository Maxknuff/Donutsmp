import React from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, RotateCcw, Moon, Sun } from 'lucide-react';
import { useCalculatorStore } from '../store/calculator';

export const ControlPanel: React.FC = () => {
  const darkMode = useCalculatorStore((state) => state.darkMode);
  const toggleDarkMode = useCalculatorStore((state) => state.toggleDarkMode);
  const exportData = useCalculatorStore((state) => state.exportData);
  const importData = useCalculatorStore((state) => state.importData);
  const resetData = useCalculatorStore((state) => state.resetData);

  const handleExport = () => {
    const data = exportData();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
    );
    element.setAttribute(
      'download',
      `donutsmp-calculator-${new Date().toISOString().split('T')[0]}.json`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const content = event.target.result;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-bold text-donut-dark dark:text-white mb-4">
        Einstellungen
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            toggleDarkMode();
            if (darkMode) {
              document.documentElement.classList.remove('dark');
            } else {
              document.documentElement.classList.add('dark');
            }
          }}
          className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? (
            <>
              <Sun size={18} className="text-donut-orange" />
              <span className="text-sm font-medium text-donut-dark dark:text-white">
                Hell
              </span>
            </>
          ) : (
            <>
              <Moon size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-donut-dark dark:text-white">
                Dunkel
              </span>
            </>
          )}
        </motion.button>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="flex items-center justify-center gap-2 p-3 bg-donut-orange text-white rounded-xl hover:bg-orange-600 transition-colors"
        >
          <Download size={18} />
          <span className="text-sm font-medium">Export</span>
        </motion.button>

        {/* Import Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImport}
          className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Upload size={18} className="text-donut-dark dark:text-white" />
          <span className="text-sm font-medium text-donut-dark dark:text-white">
            Import
          </span>
        </motion.button>

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (confirm('Alle Daten zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) {
              resetData();
            }
          }}
          className="flex items-center justify-center gap-2 p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 rounded-xl hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
        >
          <RotateCcw size={18} className="text-red-600" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Reset
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};
