
import React from 'react';

interface AboutProps {
  onNavigateBack: () => void;
}

const About: React.FC<AboutProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center text-emerald-800 mb-6">About Spoonbot AI</h2>
      
      <div className="prose max-w-none text-stone-700 space-y-4">
        <p className="lead text-lg text-center">
          Turning your pantry's potential into delicious reality. We're here to solve the age-old question: "What's for dinner?"
        </p>

        <div>
            <h3 className="text-xl font-semibold text-stone-800 font-serif">Our Mission</h3>
            <p>At Spoonbot AI, our mission is to make home cooking more accessible, sustainable, and exciting. We believe that a great meal shouldn't require a trip to the grocery store. By using the ingredients you already have, we help you reduce food waste, save money, and discover amazing new recipes you might never have thought of.</p>
        </div>

        <div>
            <h3 className="mt-8 text-xl font-semibold text-stone-800 font-serif">How It Works</h3>
            <p>The process is as simple as 1-2-3:</p>
            <ol>
                <li><strong>List Your Ingredients:</strong> Tell us what you have in your fridge and pantry. The more you add, the more creative our AI chef can be!</li>
                <li><strong>Customize Your Meal:</strong> Specify any dietary needs, preferred cuisines, or calorie targets to tailor the recipe perfectly to your taste.</li>
                <li><strong>Get Your Recipe:</strong> In seconds, our AI generates a unique, step-by-step recipe complete with nutritional information, chef's tips, and more.</li>
            </ol>
        </div>

        <div>
            <h3 className="mt-8 text-xl font-semibold text-stone-800 font-serif">The Magic Behind the Meals</h3>
            <p>Spoonbot AI is powered by Google's state-of-the-art <strong>Gemini API</strong>. This advanced artificial intelligence understands the complex relationships between ingredients, flavors, and cooking techniques. It's not just following a database of recipes; it's genuinely creating new, coherent, and delicious meal ideas from scratch, just like a seasoned chef would.</p>
        </div>

      </div>
      
      <div className="text-center mt-8">
        <button
          onClick={onNavigateBack}
          className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-emerald-700 transition-all duration-300"
        >
          &larr; Back to App
        </button>
      </div>
    </div>
  );
};

export default About;