import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";

export const start = (msg: Message) => {
  bot.sendMessage(
    msg.chat.id,
    formatText("Hey welcome to this quiz about stacks blockchain we all like"),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: " ⏰ With timer",
              callback_data: JSON.stringify({
                command: "start",
                option: "with_timer",
              }),
            },
          ],
          [
            {
              text: "Without timer",
              callback_data: JSON.stringify({
                command: "start",
                option: "without_timer",
              }),
            },
          ],
        ],
      },
      parse_mode: "HTML",
    },
  );
};
