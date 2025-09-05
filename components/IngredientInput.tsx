import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
}

const commonIngredients: string[] = [
  'Chicken Breast', 'Ground Beef', 'Bacon', 'Salmon', 'Tuna', 'Eggs',
  'Milk', 'Butter', 'Cheese', 'Cheddar Cheese', 'Mozzarella Cheese', 'Parmesan Cheese',
  'Yogurt', 'Cream', 'Sour Cream',
  'Onion', 'Garlic', 'Carrot', 'Celery', 'Bell Pepper', 'Tomato', 'Potato',
  'Broccoli', 'Spinach', 'Lettuce', 'Cucumber', 'Zucchini', 'Mushroom',
  'Avocado', 'Lemon', 'Lime', 'Apple', 'Banana', 'Orange', 'Berries',
  'Rice', 'Pasta', 'Bread', 'Flour', 'Sugar', 'Brown Sugar', 'Honey', 'Maple Syrup',
  'Olive Oil', 'Vegetable Oil', 'Coconut Oil', 'Vinegar', 'Balsamic Vinegar',
  'Soy Sauce', 'Ketchup', 'Mustard', 'Mayonnaise', 'Hot Sauce',
  'Salt', 'Black Pepper', 'Paprika', 'Cumin', 'Oregano', 'Basil', 'Thyme', 'Rosemary',
  'Chili Powder', 'Cinnamon', 'Nutmeg', 'Ginger',
  'Beans', 'Black Beans', 'Kidney Beans', 'Chickpeas', 'Lentils', 'Nuts',
  'Almonds', 'Walnuts', 'Peanuts', 'Peanut Butter', 'Chocolate', 'Cocoa Powder',
  'Coffee', 'Tea', 'Oats', 'Quinoa'
];

const IngredientInput: React.FC<IngredientInputProps> = ({ onAddIngredient }) => {
  const [ingredient, setIngredient] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIngredient(value);
    if (value.trim().length > 1) {
      const filtered = commonIngredients
        .filter(item => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Limit suggestions to 5
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    onAddIngredient(suggestion);
    setIngredient('');
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      onAddIngredient(ingredient.trim());
      setIngredient('');
      setSuggestions([]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={ingredient}
          onChange={handleChange}
          placeholder="e.g., Chicken, Onion, Bell Pepper"
          className="flex-grow p-3 bg-amber-100/60 border border-amber-300 text-stone-700 placeholder:text-stone-500 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors flex-shrink-0 shadow transform hover:scale-105"
          aria-label="Add Ingredient"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </form>
       {suggestions.length > 0 && (
        <ul className="absolute z-20 w-[calc(100%-4rem)] -mt-3 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in-down">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-emerald-50 text-stone-800"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientInput;