import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import { categorizeIngredients } from '../services/geminiService';
import Spinner from './Spinner';

interface ShopProps {
  onNavigateBack: () => void;
  recipe: Recipe | null;
}

const groceryServices = [
  { name: 'Instacart', searchUrl: 'https://www.instacart.com/store/search/', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
  { name: 'Amazon Fresh', searchUrl: 'https://www.amazon.com/s?k=', color: 'bg-cyan-500', hoverColor: 'hover:bg-cyan-600' },
  { name: 'Walmart', searchUrl: 'https://www.walmart.com/search?q=', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
  { name: 'Thrive Market', searchUrl: 'https://thrivemarket.com/catalog?q=', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600' },
  { name: 'Kroger', searchUrl: 'https://www.kroger.com/search?query=', color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600' },
  { name: 'Whole Foods', searchUrl: 'https://www.amazon.com/s?k=', color: 'bg-teal-500', hoverColor: 'hover:bg-teal-600' },
];

const Shop: React.FC<ShopProps> = ({ onNavigateBack, recipe }) => {
  const [categorizedIngredients, setCategorizedIngredients] = useState<Record<string, string[]> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (recipe) {
      setIsLoading(true);
      setError(null);
      categorizeIngredients(recipe.ingredients)
        .then(data => {
          // Filter out empty categories
          const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value && value.length > 0) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, string[]>);
          setCategorizedIngredients(filteredData);
        })
        .catch(err => {
          console.error(err);
          setError(err instanceof Error ? err.message : "Could not categorize ingredients.");
        })
        .finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
    }
  }, [recipe]);

  const handleCheckItem = (ingredient: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredient)) {
        newSet.delete(ingredient);
      } else {
        newSet.add(ingredient);
      }
      return newSet;
    });
  };
  
  const shoppingQuery = recipe 
    ? recipe.ingredients
      .filter(ing => !checkedItems.has(ing))
      .map(ing => ing.split(',')[0].split('(')[0].replace(/(\d+\s*\d\/\d+|\d+\/\d+|\d+-\d+|\d+\.\d+|\d+)/, '').trim())
      .join(', ')
    : '';

  const generateShopURL = (baseURL: string, query: string) => {
    return `${baseURL}${encodeURIComponent(query)}`;
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <Spinner />
          <p className="mt-4 text-stone-600 font-serif">Categorizing your shopping list...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center py-12 bg-red-50 p-6 rounded-lg">
          <h3 className="text-xl font-serif text-red-800">Oops! Something went wrong.</h3>
          <p className="text-stone-600 mt-2">{error}</p>
        </div>
      );
    }
    
    if (!recipe || !categorizedIngredients) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-serif text-emerald-800">No Recipe Selected</h3>
          <p className="text-stone-500 mt-2">Go back and generate a recipe to create a shopping list.</p>
        </div>
      );
    }

    return (
       <>
          <h3 className="text-xl font-semibold text-center text-stone-700 mb-2">Shopping List for:</h3>
          <p className="text-2xl font-bold text-center text-emerald-700 mb-6 font-serif">{recipe.title}</p>
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-6 mb-8 space-y-4">
            {Object.entries(categorizedIngredients).map(([category, items]) => (
                <div key={category}>
                    <h4 className="font-bold text-emerald-800 text-lg mb-2 border-b-2 border-emerald-200 pb-1">{category}</h4>
                    <ul className="space-y-2">
                        {items.map(ingredient => (
                            <li key={ingredient}>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        checked={checkedItems.has(ingredient)}
                                        onChange={() => handleCheckItem(ingredient)}
                                        className="h-5 w-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className={`text-stone-800 ${checkedItems.has(ingredient) ? 'line-through text-stone-400' : ''} group-hover:text-emerald-700 transition-colors`}>
                                      {ingredient}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>
          <p className="text-center text-stone-600 mb-8">
            Click a service below to shop for your <strong className="text-emerald-700">unchecked</strong> ingredients.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groceryServices.map((service) => (
              <a
                key={service.name}
                href={generateShopURL(service.searchUrl, shoppingQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-6 text-white text-center font-bold text-lg rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${service.color} ${service.hoverColor} ${!shoppingQuery ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => !shoppingQuery && e.preventDefault()}
              >
                {service.name}
              </a>
            ))}
          </div>
        </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
        <h2 className="text-3xl font-bold text-emerald-800">Shop for Ingredients</h2>
        <button
          onClick={onNavigateBack}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
        >
          &larr; Back to Generator
        </button>
      </div>
      
      {renderContent()}

       <p className="text-center text-xs text-stone-400 mt-8">
        Note: Spoonbot AI is not affiliated with any of these services. Clicking a link will open it in a new tab.
      </p>
    </div>
  );
};

export default Shop;
