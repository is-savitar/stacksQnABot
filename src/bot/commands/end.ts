import { Message } from "node-telegram-bot-api";
import { activeQuizzes } from "./start";
import { bot } from "../bot";

export const endQuiz = (msg: Message) => {
  const chatId = msg?.chat.id;

  if (activeQuizzes.has(chatId)) {
    activeQuizzes.delete(chatId);
    bot.sendMessage(chatId, "Ended quiz");
  } else {
    bot.sendMessage(chatId, "No active quiz");
  }
};
