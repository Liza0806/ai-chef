import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipesService {
  getRecipes(ingredients: string[]) {
    const recipes = [];
    if (ingredients.includes('eggs') && ingredients.includes('cheese')) {
      recipes.push({ title: 'Омлет с сыром', missing: [] });
    } else {
      recipes.push({ title: 'Салат простой', missing: ['lettuce'] });
    }
    return { recipes };
  }
}
