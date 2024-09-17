import TelegramBot from "node-telegram-bot-api";
import { settings } from "../config/constants";
import logger from "../utils/logger";
import { start } from "./commands/start";
import { handleCallbackQuery } from "./handlers/callbackquery";
import { userFailed } from "./commands/failed";
import { endQuiz } from "./commands/end";

console.log(settings);
export const bot = new TelegramBot(settings.token!, { polling: true });
logger.info("Bot started");
bot.onText(/\/start/, start);
bot.onText(/\/failed/, userFailed);
bot.onText(/\/end/, endQuiz);

bot.on("callback_query", handleCallbackQuery);
