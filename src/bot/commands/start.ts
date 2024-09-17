import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
import { quiz } from "../../services/quiz";
import { shuffleArray } from "../../utils/shuffle";
import { handleCallbackQuery } from "../handlers/callbackquery";

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

export const sendQuesion = (msg: Message, current: number) => {
  const currentQuestion = quiz[current];
  const shuffledOptions = shuffleArray(currentQuestion.options);
  const options = [];
  const labels = ["A", "B", "C", "D"];

  for (let i = 0; i < shuffledOptions.length; i += 2) {
    const row = [
      {
        text: `${labels[i]}. ${shuffledOptions[i]}`,
        callback_data: JSON.stringify({
          command: "answer",
          questionIndex: current,
          selectedOption: i,
        }),
      },
    ];

    if (shuffledOptions[i + 1]) {
      row.push({
        text: `${labels[i + 1]}. ${shuffledOptions[i + 1]}`,
        callback_data: JSON.stringify({
          command: "answer",
          questionIndex: current,
          selectedOption: i + 1,
        }),
      });
    }
    options.push(row);
  }

  return bot.sendMessage(msg.chat.id, formatText(currentQuestion.question), {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: options,
    },
  });
};
