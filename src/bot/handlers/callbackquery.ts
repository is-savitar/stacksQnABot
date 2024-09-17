import TelegramBot from "node-telegram-bot-api";
import { bot } from "../bot";
import logger from "../../utils/logger";
import { handleAnswer, sendQuestion } from "../commands/start";
import { quiz } from "../../services/quiz";

export const handleCallbackQuery = (
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const { message, data } = callbackQuery;
  const chatId = message?.chat.id;
  const { command, option } = JSON.parse(data || "{}");

  if (command === "start") {
    if (option === "with_timer") {
      sendQuestion(message!, 0);
    } else if (option === "without_timer") {
      bot.sendMessage(chatId as number, "Without timer selected");
    }
  } else if (command === "answer") {
    // const { questionIndex, selectedOption } = JSON.parse(data || "{}");
    handleAnswer(message!, data);
  }
  logger.info(data);
};
