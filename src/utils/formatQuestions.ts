// The formatQuestions function takes the raw question data from the API, shuffles the options, and decodes any HTML entities, ensuring that the questions are formatted correctly and are ready to be displayed in the quiz app.

import { QuestionFromAPI, QuizQuestion } from "../types/quiz";

export const formatQuestions = (apiQuestions: QuestionFromAPI[]): QuizQuestion[] => {
  return apiQuestions.map((q) => {
    const allOptions = [...q.incorrect_answers, q.correct_answer];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    return {
      question: decodeHTML(q.question),
      options: shuffled.map(decodeHTML),
      correctAnswer: decodeHTML(q.correct_answer),
    };
  });
};

const decodeHTML = (html: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
