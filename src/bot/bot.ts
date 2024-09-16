import TelegramBot from "node-telegram-bot-api";
import { settings } from "../config/constants";
// import { handleMessage } from "./handlers/message_handler";
// import { handleCallbackQuery } from "./handlers/callbackquery_handler";
import logger from "../utils/logger";
import { start } from "./commands/start";

console.log(settings);
export const bot = new TelegramBot(settings.token!, { polling: true });
logger.info("Bot started");
bot.onText(/\/start/, start);

// bot.on("message", handleMessage);

// bot.on("callback_query", handleCallbackQuery);
