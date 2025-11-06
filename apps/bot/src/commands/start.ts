import { Composer } from 'grammy';
const composer = new Composer();
composer.command('start', ctx => ctx.reply('Привет! Я — твой AI-повар. Пришли фото или воспользуйся /scan'));
export default composer;