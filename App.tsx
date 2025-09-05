
import React, { useState, useCallback, useEffect } from 'react';
import type { Recipe } from './types';
import { generateRecipe } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import IngredientList from './components/IngredientList';
import RecipeDisplay from './components/RecipeDisplay';
import Footer from './components/Footer';
import TermsAndPrivacy from './components/TermsAndPrivacy';
import CustomSelect from './components/CustomSelect';
import SavedRecipes from './components/SavedRecipes';
import RecipeHistory from './components/RecipeHistory';
import Settings from './components/Settings';
import Account from './components/Account';
import Blog from './components/Blog';
import About from './components/About';
import { NewspaperIcon } from './components/icons/NewspaperIcon';
import { XIcon } from './components/icons/XIcon';
import HowToUse from './components/HowToUse';
import Shop from './components/Shop';

export type Page = 'main' | 'terms' | 'saved' | 'history' | 'settings' | 'account' | 'blog' | 'about' | 'how-to-use' | 'shop';

const dietOptions = ['Any', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto'];
const cuisineOptions = ['Any', 'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Mediterranean', 'American', 'Thai'];
const calorieOptions = ['Any', 'Under 400 kcal', '400-600 kcal', '600-800 kcal', 'Over 800 kcal'];
const cookingTimeOptions = ['Any', 'Under 15 min', '15-30 min', '30-60 min', 'Over 60 min'];

// --- Blog Notification Component ---
interface BlogNotificationProps {
  onNavigate: () => void;
  onClose: () => void;
}

const BlogNotification: React.FC<BlogNotificationProps> = ({ onNavigate, onClose }) => {
  const latestPostTitle = '5 Tips for Reducing Food Waste in Your Kitchen';

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed bottom-5 right-5 w-80 max-w-[90%] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 animate-slide-in-up cursor-pointer transform-gpu no-print"
      onClick={onNavigate}
      role="alert"
      aria-live="polite"
    >
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 bg-emerald-100 p-2 rounded-full mt-0.5">
            <NewspaperIcon className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-grow pr-6">
            <p className="text-sm font-semibold text-emerald-800">New on the Blog</p>
            <p className="text-sm text-stone-700 font-medium mt-1">{latestPostTitle}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          aria-label="Dismiss notification"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};


function App() {
  const [ingredients, setIngredients] = useState<string[]>(['Tomatoes', 'Chicken Breast', 'Garlic']);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('main');
  const [showBlogNotification, setShowBlogNotification] = useState(false);
  const [recipeForShopping, setRecipeForShopping] = useState<Recipe | null>(null);
  
  const [dietaryPreference, setDietaryPreference] = useState<string>('Any');
  const [cuisine, setCuisine] = useState<string>('Any');
  const [calorieTarget, setCalorieTarget] = useState<string>('Any');
  const [cookingTime, setCookingTime] = useState<string>('Any');

  useEffect(() => {
    if (page === 'main') {
      const notificationDismissedTimestamp = localStorage.getItem('blogNotificationDismissedTimestamp');
      const sixHours = 6 * 60 * 60 * 1000;
      
      const shouldShowNotification = !notificationDismissedTimestamp || (Date.now() - parseInt(notificationDismissedTimestamp, 10)) > sixHours;

      if (shouldShowNotification) {
        const timer = setTimeout(() => {
          setShowBlogNotification(true);
        }, 3000); // 3-second delay
        return () => clearTimeout(timer);
      }
    } else {
      setShowBlogNotification(false);
    }
  }, [page]);

  const handleCloseNotification = () => {
    setShowBlogNotification(false);
    localStorage.setItem('blogNotificationDismissedTimestamp', Date.now().toString());
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleGenerateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const generatedRecipe = await generateRecipe(ingredients, dietaryPreference, cuisine, calorieTarget, cookingTime);
      setRecipe(generatedRecipe);
      
      const history: Recipe[] = JSON.parse(localStorage.getItem('recipe-history') || '[]');
      if (!history.some(r => r.title === generatedRecipe.title)) {
        const newHistory = [generatedRecipe, ...history].slice(0, 50); 
        localStorage.setItem('recipe-history', JSON.stringify(newHistory));
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, dietaryPreference, cuisine, calorieTarget, cookingTime]);

  const navigateTo = (page: Page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  const handleNavigateToShop = (recipeToShop: Recipe) => {
    setRecipeForShopping(recipeToShop);
    navigateTo('shop');
  };

  const renderPage = () => {
    switch(page) {
      case 'main':
        return (
          <div className="max-w-3xl mx-auto">
            <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 no-print">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-emerald-800 mb-2">What's in your pantry?</h2>
              <p className="text-center text-stone-600 mb-6">Add your ingredients and let our AI chef whip up a recipe for you!</p>
              
              <IngredientInput onAddIngredient={addIngredient} />
              <IngredientList ingredients={ingredients} onRemoveIngredient={removeIngredient} />
              
              <div className="mt-8 border-t border-stone-200 pt-6">
                <h3 className="text-lg font-semibold text-center text-emerald-700 mb-4">Customize Your Recipe</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <CustomSelect 
                    id="diet"
                    label="Dietary Preference"
                    options={dietOptions}
                    value={dietaryPreference}
                    onChange={setDietaryPreference}
                  />
                  <CustomSelect 
                    id="cuisine"
                    label="Cuisine"
                    options={cuisineOptions}
                    value={cuisine}
                    onChange={setCuisine}
                  />
                  <CustomSelect 
                    id="calories"
                    label="Calorie Target"
                    options={calorieOptions}
                    value={calorieTarget}
                    onChange={setCalorieTarget}
                  />
                  <CustomSelect 
                    id="cookingTime"
                    label="Cooking Time"
                    options={cookingTimeOptions}
                    value={cookingTime}
                    onChange={setCookingTime}
                  />
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={handleGenerateRecipe}
                  disabled={isLoading || ingredients.length === 0}
                  className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-emerald-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? 'Crafting Recipe...' : 'Generate Recipe'}
                </button>
              </div>
            </section>

            <RecipeDisplay recipe={recipe} isLoading={isLoading} error={error} onShopIngredients={handleNavigateToShop} />
          </div>
        );
      case 'saved':
        return <SavedRecipes onNavigateBack={() => navigateTo('main')} onShopIngredients={handleNavigateToShop} />;
      case 'history':
        return <RecipeHistory onNavigateBack={() => navigateTo('main')} onShopIngredients={handleNavigateToShop} />;
      case 'shop':
        return <Shop onNavigateBack={() => navigateTo('main')} recipe={recipeForShopping} />;
      case 'settings':
        return <Settings onNavigateBack={() => navigateTo('main')} />;
      case 'account':
        return <Account onNavigateBack={() => navigateTo('main')} />;
      case 'blog':
        return <Blog onNavigateBack={() => navigateTo('main')} />;
      case 'terms':
        return <TermsAndPrivacy onNavigateBack={() => navigateTo('main')} />;
      case 'about':
        return <About onNavigateBack={() => navigateTo('main')} />;
      case 'how-to-use':
        return <HowToUse onNavigateBack={() => navigateTo('main')} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 flex flex-col">
      <Header onNavigate={navigateTo} className="no-print" />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} className="no-print" />
      {showBlogNotification && (
        <BlogNotification
          onNavigate={() => navigateTo('blog')}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}

export default App;
