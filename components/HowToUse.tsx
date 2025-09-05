import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';

interface HowToUseProps {
  onNavigateBack: () => void;
}

const Step = ({ icon, title, description, stepNumber }: { icon: React.ReactNode, title: string, description: string, stepNumber: number }) => (
    <div className="flex items-start gap-6">
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 border-4 border-white shadow-md">
                {icon}
            </div>
            {stepNumber < 4 && <div className="w-0.5 h-20 bg-emerald-200 mt-4"></div>}
        </div>
        <div className="pt-3">
            <h3 className="text-xl font-bold text-stone-800 font-serif mb-1">
                <span className="text-emerald-600">Step {stepNumber}:</span> {title}
            </h3>
            <p className="text-stone-600 leading-relaxed">{description}</p>
        </div>
    </div>
);


const HowToUse: React.FC<HowToUseProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center text-emerald-800 mb-8">How to Use Spoonbot AI</h2>
      
      <div className="space-y-4">
        <Step
          stepNumber={1}
          icon={<PlusIcon className="w-8 h-8" />}
          title="Add Your Ingredients"
          description="Start by typing in the ingredients you have available in your pantry, fridge, or countertop. Our smart suggestion system will help you add common items quickly."
        />
        <Step
          stepNumber={2}
          icon={<SettingsIcon className="w-8 h-8" />}
          title="Customize Your Recipe"
          description="Tailor the recipe to your needs. Select your dietary preferences (like Vegan or Gluten-Free), choose a cuisine style, set a calorie target, and even specify how much time you have to cook."
        />
        <Step
          stepNumber={3}
          icon={<SparklesIcon className="w-8 h-8" />}
          title="Generate with AI Magic"
          description="Click the 'Generate Recipe' button and let our AI chef get to work! In just a few moments, it will craft a unique, delicious recipe just for you, based on your inputs."
        />
        <Step
          stepNumber={4}
          icon={<ChefHatIcon className="w-8 h-8" />}
          title="Cook, Visualize & Enjoy!"
          description="Your complete recipe is ready! You can adjust serving sizes, visualize each cooking step with AI-generated images, print a clean version for your kitchen, and save your favorite recipes to your collection."
        />
      </div>
      
      <div className="text-center mt-12">
        <button
          onClick={onNavigateBack}
          className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-emerald-700 transition-all duration-300"
        >
          &larr; Start Cooking
        </button>
      </div>
    </div>
  );
};

export default HowToUse;