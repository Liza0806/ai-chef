import { RecipesService } from './recipes.service';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    getRecipes(ingredientsQuery: string): {
        recipes: {
            title: string;
            missing: string[];
        }[];
    };
}
