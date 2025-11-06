import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создаём ингредиенты
  const eggs = await prisma.ingredient.upsert({
    where: { name: 'eggs' },
    update: {},
    create: { name: 'eggs' },
  });

  const cheese = await prisma.ingredient.upsert({
    where: { name: 'cheese' },
    update: {},
    create: { name: 'cheese' },
  });

  // Создаём рецепт
  const omelet = await prisma.recipe.create({
    data: {
      title: 'Омлет с сыром',
      instructions: 'Взбей яйца, добавь сыр, обжарь на сковороде',
      ingredients: {
        create: [
          { ingredientId: eggs.id, quantity: '2 шт' },
          { ingredientId: cheese.id, quantity: '50 г' },
        ],
      },
    },
  });

  // Создаём пользователя
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      telegramId: '123456789',
      recipes: {
        create: [
          { recipeId: omelet.id },
        ],
      },
    },
  });

  console.log('✅ Seed finished', { user, omelet });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
