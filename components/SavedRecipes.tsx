
import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import RecipeDisplay from './RecipeDisplay';
import { TrashIcon } from './icons/TrashIcon';


interface SavedRecipesProps {
  onNavigateBack: () => void;
  onShopIngredients: (recipe: Recipe) => void;
}

const SavedRecipes: React.FC<SavedRecipesProps> = ({ onNavigateBack, onShopIngredients }) => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const recipesFromStorage = JSON.parse(localStorage.getItem('saved-recipes') || '[]');
    setSavedRecipes(recipesFromStorage);
  }, []);

  const handleUnsave = (e: React.MouseEvent, recipeTitle: string) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    const updatedRecipes = savedRecipes.filter(r => r.title !== recipeTitle);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('saved-recipes', JSON.stringify(updatedRecipes));
    if (selectedRecipe?.title === recipeTitle) {
      setSelectedRecipe(null);
    }
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    window.scrollTo(0, 0);
  }

  if (selectedRecipe) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="mb-6 bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-emerald-700 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Saved Recipes
        </button>
        <RecipeDisplay recipe={selectedRecipe} isLoading={false} error={null} onShopIngredients={onShopIngredients} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
        <h2 className="text-3xl font-bold text-emerald-800">My Saved Recipes</h2>
        <button
          onClick={onNavigateBack}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
        >
          &larr; Back to Generator
        </button>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="h-16 w-16 mx-auto text-stone-300" />
          <h3 className="text-xl font-serif text-emerald-800 mt-4">Your recipe book is empty!</h3>
          <p className="text-stone-500 mt-2">Generate a recipe and click the 'Save' button to add it to your collection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedRecipes.map(recipe => (
            <div 
              key={recipe.title} 
              className="p-4 border border-stone-200 rounded-lg flex justify-between items-center transition-all duration-300 hover:shadow-md hover:border-emerald-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleSelectRecipe(recipe)}
            >
              <div className="flex-grow overflow-hidden">
                <h3 className="font-bold text-stone-800 text-lg truncate">{recipe.title}</h3>
                <p className="text-sm text-stone-500 truncate">{recipe.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {recipe.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                <button 
                  onClick={(e) => handleUnsave(e, recipe.title)}
                  className="p-2 text-stone-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                  aria-label="Unsave Recipe"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Re-add BookmarkIcon for the empty state
const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);


export default SavedRecipes;
