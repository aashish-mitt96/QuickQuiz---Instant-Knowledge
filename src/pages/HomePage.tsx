import React, { useEffect, useState } from "react";
import { QuestionFromAPI, QuizQuestion } from "../types/quiz";
import { formatQuestions } from "../utils/formatQuestions";
import { Signal, Wifi } from "lucide-react";
import Lottie from 'lottie-react'; 
import animationData from "../assets/animation.json";

const API_URL = "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple";

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const formatted = formatQuestions(data.results as QuestionFromAPI[]);
        setQuestions(formatted);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      fetchQuestions();
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12; 
      if (hours === 0) hours = 12; 
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
      setTime(formattedTime);
    };
    updateClock(); 
    const interval = setInterval(updateClock, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleOptionClick = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    if (option === questions[currentQIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setCurrentQIndex((prev) => prev + 1);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-[475px]  bg-white p-4 rounded-[2rem] border-4 border-black shadow-2xl flex flex-col">
        <Lottie animationData={animationData} loop={true} className="w-full h-30 rounded-md" />
        <p className="text-center text-xl text-black">Quiz questions coming...</p>
      </div>
    </div>
  );
  
  if (error) return <p className="flex justify-center items-center mt-10 text-red-600">Something went wrong.</p>;

  if (currentQIndex >= questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-[775px] bg-white p-4 rounded-[2rem] border-4 border-black shadow-2xl flex flex-col">
          <Lottie animationData={animationData} loop={true} className="w-full h-30 rounded-md" />
          <div className="text-center mt-4">
            <h2 className="text-3xl text-black font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl text-black mb-2">Your Score: {score} / {questions.length}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const progress = ((currentQIndex) / questions.length) * 100; 

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-[375px] h-[667px] bg-white p-4 rounded-[2rem] border-4 border-black shadow-2xl flex flex-col">

        {/* Status Bar */}
        <div className="flex justify-between items-center text-xs text-gray-600 font-bold px-2 mb-2">
          <span>{time}</span>
          <div className="flex gap-1 items-center text-black">
            <Wifi size={18} strokeWidth={2.5} />
            <span className="text-[10px]">5G</span>
            <Signal size={18} strokeWidth={2.5} />
          </div>
        </div>

        {/* Animation */}
        <div className="mb-4 mt-2">
          <Lottie animationData={animationData} loop={true} className="w-full h-30 rounded-md" />
        </div>

        {/* App Header */}
        <div className="text-center border-b pb-2 mb-4">
          <h1 className="text-xl font-bold text-black">Quiz App</h1>
          <p className="text-sm text-gray-600">
            Question {currentQIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-lg font-medium mb-4 text-black">
            Q{currentQIndex + 1}: {currentQ.question}
          </h2>
          <ul className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isCorrect = option === currentQ.correctAnswer;
              const isSelected = selectedOption === option;

              return (
                <li
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`p-2 border rounded cursor-pointer transition-all duration-200 
                    ${showAnswer
                      ? isCorrect
                        ? "bg-green-300 text-white border-green-600"
                        : isSelected
                        ? "bg-red-300 text-white border-red-600"
                        : "bg-gray-200 text-black"
                      : "bg-white hover:bg-blue-100 text-black"} 
                    ${isSelected ? "shadow-md" : ""}`}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Next Button */}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {currentQIndex + 1 === questions.length ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
