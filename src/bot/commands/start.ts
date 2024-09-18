import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
import { quiz } from "../../services/quiz";
import logger from "../../utils/logger";

const messageIdStore = new Map<number, number>();
export const activeQuizzes = new Set<number>();
export const failedQuestions = new Map<number, number[]>();
const scoresMap = new Map<number, number>();
type BunTimer = ReturnType<typeof setTimeout>;

const timerMap = new Map<number, BunTimer>();

export const start = (msg: Message) => {
  const chatId = msg?.chat.id;
  if (activeQuizzes.has(chatId)) {
    bot.sendMessage(chatId, "You are already in an ongoing quiz");
    return;
  }
  activeQuizzes.add(chatId);
  failedQuestions.delete(chatId);
  scoresMap.set(chatId, 0);
  const quizDuration = 2 * 60 * 1000;

  const timer: BunTimer = setTimeout(() => {
    finishQuiz(chatId, msg);
  }, quizDuration);
  timerMap.set(chatId, timer);

  bot.sendMessage(
    chatId,
    formatText("Hey welcome to this quiz about stacks blockchain we all like"),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: " ⏰ With timer (2min)",
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
  const labels = ["A", "B", "C", "D"];
  const chatId = msg?.chat.id;

  let messageText = `${currentQuestion.question}\n\n`;
  currentQuestion.options.forEach((option, index) => {
    messageText += `${labels[index]}. ${option}\n`;
  });

  const options = currentQuestion.options.map((option, index) => ({
    text: labels[index],
    callback_data: JSON.stringify({
      command: "answer",
      questionIndex: current,
      selectedOption: index,
    }),
  }));

  const inlineKeyboard = [];
  for (let i = 0; i < options.length; i += 2) {
    // @ts-ignore
    inlineKeyboard.push(options.slice(i, i + 2));
  }

  bot
    .sendMessage(chatId, formatText(messageText), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
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
    })
    .catch((err) => {
      logger.error(`Failed to send message: ${err}`);
    });
};

export const handleAnswer = (msg: Message, data: any) => {
  const chatId = msg?.chat.id;
  const { questionIndex, selectedOption } = JSON.parse(data || "{}");

  if (!failedQuestions.has(chatId)) {
    failedQuestions.set(chatId, []);
  }

  if (!scoresMap.has(chatId)) {
    scoresMap.set(chatId, 0);
  }

  const failedQuestionsList = failedQuestions.get(chatId) || [];
  const currentScore = scoresMap.get(chatId) || 0;
  const currentQuestion = quiz[questionIndex];

  if (selectedOption === currentQuestion.correct) {
    scoresMap.set(chatId, currentScore + 1);
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
    finishQuiz(chatId, msg);
    // bot.sendMessage(
    //   chatId,
    //   `Quiz finished! You can use /failed to see the questions you failed.\nFailed: ${failedQuestionsList.length}\n Score: ${scoresMap.get(chatId)}`,
    // );
    // activeQuizzes.delete(chatId);
    // scoresMap.delete(chatId);
  }
};

export const finishQuiz = (chatId: number, msg: Message) => {
  const failedQuestionsList = failedQuestions.get(chatId) || [];
  const score = scoresMap.get(chatId) || 0;

  bot.sendMessage(
    chatId,
    `Time's up! Quiz finished! You can use /failed to see the questions you missed.\nFailed: ${failedQuestionsList.length}\n Score: ${score}`,
  );

  // Clean up
  activeQuizzes.delete(chatId);
  scoresMap.delete(chatId);
  failedQuestions.delete(chatId);

  // Clear the timer if it's still running
  const timer = timerMap.get(chatId);
  if (timer) {
    clearTimeout(timer);
    timerMap.delete(chatId);
  }
};
