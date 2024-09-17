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

export const sendQuestion = (msg: Message, current: number) => {
  const currentQuestion = quiz[current];
  const shuffledOptions = shuffleArray(currentQuestion.options);
  const labels = ["A", "B", "C", "D"];

  // Create the message with shuffled options and labels
  let messageText = `${currentQuestion.question}\n\n`;
  shuffledOptions.forEach((option, index) => {
    messageText += `${labels[index]}. ${option}\n`;
  });

  const options = [];
  for (let i = 0; i < labels.length; i += 2) {
    const row = [
      {
        text: labels[i],
        callback_data: JSON.stringify({
          command: "answer",
          questionIndex: current,
          selectedOption: i,
        }),
      },
    ];

    if (labels[i + 1]) {
      row.push({
        text: labels[i + 1],
        callback_data: JSON.stringify({
          command: "answer",
          questionIndex: current,
          selectedOption: i + 1,
        }),
      });
    }

    options.push(row);
  }

  return bot.sendMessage(msg.chat.id, formatText(messageText), {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: options,
    },
  });
};

export const handleAnswer = (msg: Message, data: any) => {
  let scores = 0;
  const chatId = msg?.chat.id;
  const { questionIndex, selectedOption } = JSON.parse(data || "{}");

  if (selectedOption === quiz[questionIndex].correct) {
    scores++;
    bot.sendMessage(chatId, "Correct! 🎉");
  } else {
    bot.sendMessage(chatId, "Oops, wrong answer.");
  }

  const nextQuestionIndex = questionIndex + 1;
  if (nextQuestionIndex < quiz.length) {
    sendQuestion(msg, nextQuestionIndex);
  } else {
    bot.sendMessage(chatId, "Quiz finished! ");
  }
};
