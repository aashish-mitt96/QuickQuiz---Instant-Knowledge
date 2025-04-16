export interface QuestionFromAPI {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}
