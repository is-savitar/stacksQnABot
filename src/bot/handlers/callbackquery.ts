import TelegramBot from "node-telegram-bot-api";
import { bot } from "../bot";
import logger from "../../utils/logger";
import { sendQuesion } from "../commands/start";

export const handleCallbackQuery = (
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const { message, data } = callbackQuery;
  const chatId = message?.chat.id;
  const { command, option } = JSON.parse(data || "{}");

  if (command === "start") {
    if (option === "with_timer") {
      bot.sendMessage(chatId as number, "With timer selected");
      sendQuesion(message!, 0);
    } else if (option === "without_timer") {
      bot.sendMessage(chatId as number, "Without timer selected");
    }
  }
  logger.info(data);
};
