import 'dotenv/config';
import { Bot } from 'grammy';
import startCmd from './commands/start';
import scanCmd from './commands/scan';


const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);


bot.use(startCmd);
bot.use(scanCmd);


bot.start();
console.log('Bot started');