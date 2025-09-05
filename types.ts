
export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  tags: string[];
  difficulty: string;
  servings: number;
  nutritionalInfo: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
  };
  allergyNote: string;
  seasonalSuggestion: string;
  chefTips: string[];
}