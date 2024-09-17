import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
import { quiz } from "../../services/quiz";
import { shuffleArray } from "../../utils/shuffle";
import logger from "../../utils/logger";

const messageIdStore = new Map<number, number>();
export const activeQuizzes = new Set<number>();
export const failedQuestions = new Map<number, number[]>();

export const start = (msg: Message) => {
  const chatId = msg?.chat.id;
  if (activeQuizzes.has(chatId)) {
    bot.sendMessage(chatId, "You are already in an ongoing quiz");
    return;
  }
  activeQuizzes.add(chatId);
  failedQuestions.clear();

  bot.sendMessage(
    chatId,
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
  const chatId = msg?.chat.id;

  // Create a map of original indices to shuffled indices
  const optionIndexMap = new Map<number, number>();
  shuffledOptions.forEach((option, index) => {
    optionIndexMap.set(currentQuestion.options.indexOf(option), index);
  });

  // Determine the correct answer index based on shuffled options
  const correctShuffledIndex = optionIndexMap.get(currentQuestion.correct);

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

  bot
    .sendMessage(chatId, formatText(messageText), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: options,
      },
    })
    .then((sentMessage) => {
      const prevMsgId = messageIdStore.get(chatId);
      if (prevMsgId) {
        bot.deleteMessage(chatId, prevMsgId).catch((err) => {
          logger.error(`Failed to delete the message: ${err}`);
        });
      }
      messageIdStore.set(chatId, sentMessage.message_id);

      // Store the correct answer index in the message's data
      bot.sendMessage(chatId, JSON.stringify({ correctShuffledIndex }), {
        reply_markup: { inline_keyboard: [] },
      });
    })
    .catch((err) => {
      logger.error(`Failed to send message: ${err}`);
    });
};

export const handleAnswer = (msg: Message, data: any) => {
  let scores = 0;
  const chatId = msg?.chat.id;
  const { questionIndex, selectedOption } = JSON.parse(data || "{}");

  if (!failedQuestions.has(chatId)) {
    failedQuestions.set(chatId, []);
  }

  const failedQuestionsList = failedQuestions.get(chatId) || [];

  const currentQuestion = quiz[questionIndex];
  const shuffledOptions = shuffleArray(currentQuestion.options);

  // Find the correct option index based on shuffled options
  const optionIndexMap = new Map<number, number>();
  shuffledOptions.forEach((option, index) => {
    optionIndexMap.set(currentQuestion.options.indexOf(option), index);
  });

  const correctShuffledIndex = optionIndexMap.get(currentQuestion.correct);

  if (selectedOption === correctShuffledIndex) {
    scores++;
    bot.sendMessage(chatId, "Correct! 🎉");
  } else {
    bot.sendMessage(chatId, "Oops, wrong answer.");
    failedQuestionsList.push(questionIndex);
    failedQuestions.set(chatId, failedQuestionsList);
  }

  bot
    .editMessageReplyMarkup(
      { inline_keyboard: [] },
      {
        chat_id: chatId,
        message_id: msg?.message_id,
      },
    )
    .catch((err) => {
      logger.error(`Failed to update message markup: ${err}`);
    });

  const nextQuestionIndex = questionIndex + 1;
  if (nextQuestionIndex < quiz.length) {
    sendQuestion(msg, nextQuestionIndex);
  } else {
    bot.sendMessage(
      chatId,
      "Quiz finished! You can use /failed to see the questions you failed.",
    );
    activeQuizzes.delete(chatId);
  }
};
