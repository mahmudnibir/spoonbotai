
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import type { Recipe } from '../types';
import Spinner from './Spinner';
import { TagIcon } from './icons/TagIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { LeafIcon } from './icons/LeafIcon';
import { FireIcon } from './icons/FireIcon';
import { BoltIcon } from './icons/BoltIcon';
import { DropletIcon } from './icons/DropletIcon';
import { CubeIcon } from './icons/CubeIcon';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { StarIcon } from './icons/StarIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';


interface RecipeDisplayProps {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  onShopIngredients: (recipe: Recipe) => void;
}

// Helper function to convert fraction strings to numbers
const parseFraction = (fraction: string): number => {
    if (fraction.includes('/')) {
        const parts = fraction.split('/');
        if (parts.length === 2) {
            return parseInt(parts[0], 10) / parseInt(parts[1], 10);
        }
    }
    return parseFloat(fraction);
};

// Helper function to scale ingredient quantities
const scaleIngredient = (ingredient: string, originalServings: number, newServings: number): string => {
  if (originalServings === newServings) {
    return ingredient;
  }
  
  return ingredient.replace(/(\d+\s*\d\/\d+|\d+\/\d+|\d+-\d+|\d+\.\d+|\d+)/g, (match) => {
    const scale = newServings / originalServings;
    
    // Handle ranges like "2-3"
    if (match.includes('-')) {
      const [start, end] = match.split('-').map(Number);
      const newStart = (start * scale).toFixed(1).replace(/\.0$/, '');
      const newEnd = (end * scale).toFixed(1).replace(/\.0$/, '');
      return `${newStart}-${newEnd}`;
    }

    // Handle mixed fractions like "1 1/2"
    let numValue = 0;
    if (match.includes(' ') && match.includes('/')) {
      const parts = match.split(' ');
      numValue = parseInt(parts[0], 10) + parseFraction(parts[1]);
    } else {
      numValue = parseFraction(match);
    }
    
    let scaledValue = numValue * scale;

    // A simple attempt to convert back to fraction for common cases
    if (scaledValue % 1 === 0.5) return `${Math.floor(scaledValue) || ''} 1/2`.trim();
    if (scaledValue % 1 === 0.25) return `${Math.floor(scaledValue) || ''} 1/4`.trim();
    if (scaledValue % 1 === 0.75) return `${Math.floor(scaledValue) || ''} 3/4`.trim();

    return scaledValue.toFixed(2).replace(/\.00$/, '').replace(/\.([1-9])0$/, '.$1');
  });
};


const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, isLoading, error, onShopIngredients }) => {
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const recipeId = useMemo(() => recipe ? recipe.title.replace(/\s+/g, '-') : '', [recipe]);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
      
      const savedFeedback = localStorage.getItem(`recipe-feedback-${recipeId}`);
      if (savedFeedback) {
        const { rating: savedRating, comment: savedComment } = JSON.parse(savedFeedback);
        setRating(savedRating);
        setComment(savedComment || '');
        setFeedbackSubmitted(true);
      } else {
        // Reset for new recipe
        setRating(0);
        setComment('');
        setFeedbackSubmitted(false);
      }

      // Check if recipe is saved
      const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem('saved-recipes') || '[]');
      const isAlreadySaved = savedRecipes.some(saved => saved.title === recipe.title);
      setIsSaved(isAlreadySaved);
    }
  }, [recipe, recipeId]);


  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
    // Don't submit here, wait for comment and explicit submit
  };

  const handleFeedbackSubmit = () => {
    const feedback = { rating, comment };
    localStorage.setItem(`recipe-feedback-${recipeId}`, JSON.stringify(feedback));
    setFeedbackSubmitted(true);
  };

  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSaveToggle = () => {
    if (!recipe) return;

    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem('saved-recipes') || '[]');
    
    if (isSaved) {
        // Remove the recipe
        const updatedRecipes = savedRecipes.filter(saved => saved.title !== recipe.title);
        localStorage.setItem('saved-recipes', JSON.stringify(updatedRecipes));
        setIsSaved(false);
    } else {
        // Add the recipe
        const updatedRecipes = [...savedRecipes, recipe];
        localStorage.setItem('saved-recipes', JSON.stringify(updatedRecipes));
        setIsSaved(true);
    }
  };

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map(ing => scaleIngredient(ing, recipe.servings, servings));
  }, [recipe, servings]);

  if (isLoading) {
    return (
      <div className="text-center p-8 mt-8">
        <Spinner />
        <p className="text-lg text-stone-600 mt-4 font-serif">Simmering up some ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
        <p className="font-bold">Oh no!</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
       <div className="text-center p-8 mt-8 bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-2xl">
         <h3 className="text-xl font-serif text-emerald-800">Your next favorite meal awaits!</h3>
         <p className="text-stone-600 mt-2">Enter your ingredients above and click "Generate Recipe" to begin.</p>
       </div>
    );
  }

  const ServingAdjuster = () => (
    <div className="flex items-center gap-2 no-print">
      <span className="text-sm font-medium text-stone-600">Servings:</span>
      <div className="flex items-center gap-1 bg-stone-100 rounded-full p-0.5">
        <button 
          onClick={() => setServings(s => Math.max(1, s - 1))}
          className="p-1.5 rounded-full bg-white shadow-sm hover:bg-stone-50"
          aria-label="Decrease servings"
        >
          <MinusIcon className="h-4 w-4 text-stone-600"/>
        </button>
        <span className="font-bold text-stone-800 w-8 text-center">{servings}</span>
        <button 
          onClick={() => setServings(s => s + 1)}
          className="p-1.5 rounded-full bg-white shadow-sm hover:bg-stone-50"
          aria-label="Increase servings"
        >
          <PlusIcon className="h-4 w-4 text-stone-600"/>
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-stone-200 animate-fade-in-up printable-area">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center sm:text-left text-emerald-800 flex-grow">{recipe.title}</h2>
        <div className="flex-shrink-0 self-center sm:self-auto flex items-center gap-2 no-print">
            <button
              onClick={() => onShopIngredients(recipe)}
              className="flex items-center gap-2 font-semibold py-2 px-3 sm:px-4 rounded-full text-sm shadow-sm transition-all duration-300 transform hover:scale-105 bg-amber-500 text-white hover:bg-amber-600"
              aria-label="Shop for Ingredients"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Shop Ingredients</span>
            </button>
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 font-semibold py-2 px-3 sm:px-4 rounded-full text-sm shadow-sm transition-all duration-300 transform hover:scale-105 ${
                isSaved 
                ? 'bg-emerald-600 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800'
              }`}
              aria-label={isSaved ? "Unsave Recipe" : "Save Recipe"}
            >
              <BookmarkIcon className={`h-5 w-5 transition-all ${isSaved ? 'fill-white' : 'fill-none'}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
        </div>
      </div>
      
      <p className="text-center text-stone-600 mb-6 italic">"{recipe.description}"</p>
      
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full"
            >
              <TagIcon className="h-4 w-4 mr-1.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Key Information */}
      <div className="border-y border-stone-200 py-4 my-8">
        <div className="flex flex-wrap justify-center items-center text-center divide-x divide-stone-200">
          <div className="px-4 sm:px-6 py-2">
            <p className="text-sm font-medium text-stone-500">Difficulty</p>
            <p className="text-lg font-bold text-emerald-600">{recipe.difficulty}</p>
          </div>
          <div className="px-4 sm:px-6 py-2">
            <p className="text-sm font-medium text-stone-500">Prep Time</p>
            <p className="text-lg font-bold text-stone-700">{recipe.prepTime}</p>
          </div>
          <div className="px-4 sm:px-6 py-2">
            <p className="text-sm font-medium text-stone-500">Cook Time</p>
            <p className="text-lg font-bold text-stone-700">{recipe.cookTime}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 my-8">
        {recipe.seasonalSuggestion && (
          <div className="flex items-start gap-4 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <LeafIcon className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-emerald-800 mb-1">Seasonal Suggestion</h4>
              <p className="text-stone-700 leading-relaxed">{recipe.seasonalSuggestion}</p>
            </div>
          </div>
        )}
        {recipe.allergyNote && (
          <div className="flex items-start gap-4 p-4 bg-amber-50/70 rounded-xl border border-amber-200">
            <AlertTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-800 mb-1">Allergen Note</h4>
              <p className="text-stone-700 leading-relaxed">{recipe.allergyNote}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nutritional Info */}
      <div className="my-8">
        <h3 className="text-center text-2xl font-bold text-stone-800 font-serif mb-1">
          Nutritional Info
        </h3>
        <p className="text-center text-sm text-stone-500 mb-4">(per serving)</p>
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:px-8">
          <div className="flex flex-row justify-evenly items-start gap-4 text-center">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <FireIcon className="h-10 w-10 text-red-500 mb-2" />
              <p className="text-sm text-stone-600 font-medium">Calories</p>
              <p className="font-bold text-2xl text-red-600">{recipe.nutritionalInfo.calories.replace('Approx. ', '')}</p>
            </div>
             <div className="flex flex-col items-center flex-1 min-w-0">
              <BoltIcon className="h-10 w-10 text-sky-500 mb-2" />
              <p className="text-sm text-stone-600 font-medium">Protein</p>
              <p className="font-bold text-2xl text-sky-600">{recipe.nutritionalInfo.protein.replace('Approx. ', '')}</p>
            </div>
             <div className="flex flex-col items-center flex-1 min-w-0">
              <CubeIcon className="h-10 w-10 text-purple-500 mb-2" />
              <p className="text-sm text-stone-600 font-medium">Carbs</p>
              <p className="font-bold text-2xl text-purple-600">{recipe.nutritionalInfo.carbs.replace('Approx. ', '')}</p>
            </div>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <DropletIcon className="h-10 w-10 text-yellow-500 mb-2" />
              <p className="text-sm text-stone-600 font-medium">Fats</p>
              <p className="font-bold text-2xl text-yellow-600">{recipe.nutritionalInfo.fat.replace('Approx. ', '')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-x-8 gap-y-6 my-8">
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-stone-800 font-serif">Ingredients</h3>
            <ServingAdjuster />
          </div>
          <ul className="space-y-2 list-disc list-inside text-stone-700">
            {scaledIngredients.map((ingredient, index) => (
              <li key={index} className="pl-2">{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-2xl font-bold text-stone-800 mb-4 font-serif">Instructions</h3>
          <ol className="space-y-4 text-stone-700">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 flex-shrink-0 bg-emerald-600 text-white rounded-full h-7 w-7 flex items-center justify-center font-bold">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      
       {/* Chef Tips */}
       {recipe.chefTips && recipe.chefTips.length > 0 && (
         <div className="my-8">
           <div className="flex items-start gap-4 p-4 bg-sky-50/70 rounded-xl border border-sky-200">
            <LightbulbIcon className="h-6 w-6 text-sky-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-sky-800 mb-1">AI Chef's Tips</h4>
              <ul className="space-y-2 list-disc list-inside text-stone-700">
                {recipe.chefTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
         </div>
       )}

      <div className="border-t border-stone-200 pt-6 mt-8 text-center no-print">
        {feedbackSubmitted ? (
          <div className="text-center p-4 bg-emerald-50 rounded-lg animate-fade-in">
            <CheckCircleIcon className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-emerald-800 text-lg">Thank you for your feedback!</h4>
            <p className="text-stone-600 text-sm">Your rating has been saved.</p>
          </div>
        ) : (
          <>
            <h4 className="font-bold text-stone-700 mb-2">Did you like this recipe?</h4>
            <div 
              className="flex justify-center items-center gap-1"
              onMouseLeave={handleMouseLeave}
              role="radiogroup"
              aria-label="Recipe Rating"
            >
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-transform duration-200 ease-in-out transform hover:scale-125"
                    onClick={() => handleRatingClick(starValue)}
                    onMouseEnter={() => handleMouseEnter(starValue)}
                    onFocus={() => handleMouseEnter(starValue)}
                    aria-label={`Rate ${starValue} out of 5 stars`}
                  >
                    <StarIcon 
                      className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                        (hoverRating || rating) >= starValue 
                        ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]' 
                        : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <div className="mt-4 max-w-md mx-auto animate-fade-in-up">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Optional: Add a comment about your experience..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  rows={3}
                />
                <button
                  onClick={handleFeedbackSubmit}
                  className="mt-2 bg-emerald-600 text-white font-semibold py-2 px-5 rounded-full text-sm shadow-sm hover:bg-emerald-700 transition-all"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeDisplay;
