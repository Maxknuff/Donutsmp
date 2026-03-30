import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Material } from '../store/calculator';
import { useCalculatorStore } from '../store/calculator';

interface MaterialListProps {
  onMaterialChange?: (materials: Material[]) => void;
}

export const MaterialList: React.FC<MaterialListProps> = () => {
  const materials = useCalculatorStore((state) => state.materials);
  const updateMaterial = useCalculatorStore((state) => state.updateMaterial);
  const deleteMaterial = useCalculatorStore((state) => state.deleteMaterial);
  const addMaterial = useCalculatorStore((state) => state.addMaterial);

  const [newMaterial, setNewMaterial] = React.useState({ name: '', price: '' });

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.price) {
      addMaterial({
        name: newMaterial.name,
        price: parseFloat(newMaterial.price),
      });
      setNewMaterial({ name: '', price: '' });
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-donut-dark dark:text-white mb-6">
        Material Preise
      </h2>

      <div className="space-y-3 mb-6">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3 items-center"
          >
            <input
              type="text"
              value={material.name}
              onChange={(e) =>
                updateMaterial(material.id, { name: e.target.value })
              }
              className="input-field flex-1"
              placeholder="Material Name"
            />
            <div className="flex items-center gap-2">
              <span className="text-donut-dark dark:text-gray-300">💰</span>
              <input
                type="number"
                value={material.price}
                onChange={(e) =>
                  updateMaterial(material.id, {
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field w-24"
                placeholder="Preis"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => deleteMaterial(material.id)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900"
            >
              <Trash2 size={20} className="text-red-500" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700 pt-6">
        <input
          type="text"
          value={newMaterial.name}
          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
          className="input-field flex-1"
          placeholder="Neues Material"
        />
        <input
          type="number"
          value={newMaterial.price}
          onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
          className="input-field w-28"
          placeholder="Preis"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddMaterial}
          className="btn-primary"
        >
          Hinzufügen
        </motion.button>
      </div>
    </div>
  );
};
