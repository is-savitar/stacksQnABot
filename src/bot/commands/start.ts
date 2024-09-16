import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";

export const start = (msg: Message) => {
  bot.sendMessage(msg.chat.id, "Hello");
};
