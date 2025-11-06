import { Controller, Get, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes') // все роуты начинаются с /recipes
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getRecipes(@Query('ingredients') ingredientsQuery: string) {
    const ingredients = (ingredientsQuery || '').split(',').filter(Boolean);
    return this.recipesService.getRecipes(ingredients);
  }
}
//export default RecipesController;