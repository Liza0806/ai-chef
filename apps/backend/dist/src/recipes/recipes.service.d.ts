export declare class RecipesService {
    getRecipes(ingredients: string[]): {
        recipes: {
            title: string;
            missing: string[];
        }[];
    };
}
