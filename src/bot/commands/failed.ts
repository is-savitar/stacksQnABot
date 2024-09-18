import { Message } from "node-telegram-bot-api";
import { activeQuizzes, failedQuestions } from "./start";
import { bot } from "../bot";
import { quiz } from "../../services/quiz";

export const userFailed = (msg: Message) => {
  const chatId = msg?.chat.id;
  const failedQuestionsList = failedQuestions.get(chatId) || [];

  if (activeQuizzes.has(chatId)) {
    bot.sendMessage(
      chatId,
      "Finish the quiz to see the questions you failed for the round.",
    );
  } else if (failedQuestionsList.length === 0) {
    bot.sendMessage(chatId, "You didn't fail any questions.");
  } else {
    let failedQuestionsText = "You failed the following questions:\n";
    failedQuestionsList.forEach((questionIndex) => {
      const question = quiz[questionIndex];
      const correctAnswer = question.options[question.correct];

      failedQuestionsText += `Question ${questionIndex + 1}:\n`;
      failedQuestionsText += `Question: ${question.question}\n`;
      failedQuestionsText += `Correct Answer: ${correctAnswer}\n\n`;
    });
    bot.sendMessage(chatId, failedQuestionsText);
  }
};
