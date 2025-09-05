import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative and appealing name for the recipe."
    },
    description: {
      type: Type.STRING,
      description: "A short, enticing summary of the dish."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of all ingredients required, including quantities for the specified serving size."
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "Step-by-step cooking instructions."
    },
    prepTime: {
      type: Type.STRING,
      description: "Estimated preparation time, e.g., '15 minutes'."
    },
    cookTime: {
      type: Type.STRING,
      description: "Estimated cooking time, e.g., '30 minutes'."
    },
    tags: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of 3-5 relevant tags for the recipe, such as cuisine type (e.g., 'Italian'), dietary information (e.g., 'Vegan'), or meal type (e.g., 'Quick Dinner')."
    },
    difficulty: {
      type: Type.STRING,
      description: "The difficulty level of the recipe. Must be one of: 'Easy', 'Medium', or 'Hard'."
    },
    servings: {
      type: Type.INTEGER,
      description: "The number of servings this recipe makes, e.g., 4."
    },
    nutritionalInfo: {
        type: Type.OBJECT,
        description: "An object containing the nutritional information per serving.",
        properties: {
            calories: {
                type: Type.STRING,
                description: "Estimated calorie count for one serving, e.g., 'Approx. 550 kcal'."
            },
            protein: {
                type: Type.STRING,
                description: "Estimated protein content per serving, e.g., 'Approx. 30g'."
            },
            fat: {
                type: Type.STRING,
                description: "Estimated fat content per serving, e.g., 'Approx. 15g'."
            },
            carbs: {
                type: Type.STRING,
                description: "Estimated carbohydrate content per serving, e.g., 'Approx. 45g'."
            }
        },
        required: ["calories", "protein", "fat", "carbs"]
    },
    allergyNote: {
        type: Type.STRING,
        description: "A brief note about potential allergens, e.g., 'Contains gluten and nuts.' If no common allergens, state 'No common allergens.'"
    },
    seasonalSuggestion: {
        type: Type.STRING,
        description: "A suggestion for which season this dish is best suited for, e.g., 'Perfect for a summer barbecue.'"
    },
    chefTips: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING
        },
        description: "A list of 2-3 helpful tips, tricks, or variations for the recipe from a professional chef's perspective."
    }
  },
  required: ["title", "description", "ingredients", "instructions", "prepTime", "cookTime", "tags", "difficulty", "servings", "nutritionalInfo", "allergyNote", "seasonalSuggestion", "chefTips"],
};

export async function generateRecipe(ingredients: string[], dietaryPreference: string, cuisine: string, calorieTarget: string, cookingTime: string): Promise<Recipe> {
  let prompt = `You are a world-class chef. Create a delicious and creative recipe using primarily the following ingredients: ${ingredients.join(', ')}.`;

  if (dietaryPreference && dietaryPreference.toLowerCase() !== 'any') {
    prompt += ` The recipe must be ${dietaryPreference}.`;
  }
  if (cuisine && cuisine.toLowerCase() !== 'any') {
    prompt += ` The cuisine style should be inspired by ${cuisine} cuisine.`;
  }
  if (calorieTarget && calorieTarget.toLowerCase() !== 'any') {
    prompt += ` Aim for a calorie count of around ${calorieTarget} per serving.`;
  }
  if (cookingTime && cookingTime.toLowerCase() !== 'any') {
    prompt += ` The total cooking time (prep and cook time combined) should be ${cookingTime}.`;
  }

  prompt += `\n\nYou can assume common pantry staples like salt, pepper, oil, water, flour, sugar, and basic spices are available, but mention them in the ingredient list if used.
  The recipe should be practical for a home cook. Make the title unique and the description enticing. Provide the base number of servings the recipe is for. Provide an estimated calorie count, difficulty level (Easy, Medium, Hard), macronutrient estimates (protein, fat, carbs), a note about potential allergens, a seasonal suggestion, a few helpful chef tips, and relevant tags for the recipe.`;


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });
    
    const text = response.text.trim();
    const recipeData = JSON.parse(text);
    
    return recipeData as Recipe;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate a recipe from the AI. The chef might be on a break!");
  }
}

const ingredientCategories = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Pantry',
  'Bakery',
  'Frozen',
  'Spices & Seasonings',
  'Other'
];

const categorizeIngredientsSchema = {
    type: Type.OBJECT,
    properties: ingredientCategories.reduce((acc, category) => {
        acc[category] = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: `List of ingredients that fall under the '${category}' category.`
        };
        return acc;
    }, {} as Record<string, object>),
};

export async function categorizeIngredients(ingredients: string[]): Promise<Record<string, string[]>> {
    // Create a consistent key for caching by sorting ingredients
    const cacheKey = `categorized-ingredients-${ingredients.sort().join('-')}`;
    
    // Check local storage first
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        try {
            return JSON.parse(cachedData);
        } catch (e) {
            console.error("Failed to parse cached ingredients:", e);
            // If parsing fails, proceed to fetch from API
        }
    }

    const prompt = `You are a helpful grocery shopping assistant. Categorize the following list of ingredients into common grocery store aisles. The allowed categories are: ${ingredientCategories.join(', ')}.
    
    Ingredient list:
    - ${ingredients.join('\n- ')}
    
    Return the result as a JSON object where keys are the category names and values are arrays of the ingredients belonging to that category. If an ingredient doesn't fit a specific category, place it in 'Other'. Do not include categories that have no ingredients.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: categorizeIngredientsSchema,
            },
        });

        const text = response.text.trim();
        const result = JSON.parse(text) as Record<string, string[]>;
        
        // Save the successful response to local storage
        try {
            localStorage.setItem(cacheKey, JSON.stringify(result));
        } catch (e) {
            console.error("Failed to cache categorized ingredients:", e);
        }

        return result;

    } catch (error) {
        console.error("Error categorizing ingredients:", error);
        throw new Error("Failed to categorize ingredients. Please try again.");
    }
}