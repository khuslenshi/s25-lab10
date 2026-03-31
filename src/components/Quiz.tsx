import React, { useRef, useState } from 'react';
import './Quiz.css';
import QuizCore from '../core/QuizCore';
import QuizQuestion from '../core/QuizQuestion';

interface QuizState {
  currentQuestion: QuizQuestion | null;
  selectedAnswer: string | null;
  score: number;
  totalQuestions: number;
  isFinished: boolean;
}

const Quiz: React.FC = () => {
  const quizCoreRef = useRef<QuizCore>(new QuizCore());
  const quizCore = quizCoreRef.current;

  const [state, setState] = useState<QuizState>({
    currentQuestion: quizCore.getCurrentQuestion(),
    selectedAnswer: null,
    score: 0,
    totalQuestions: quizCore.getTotalQuestions(),
    isFinished: false,
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({
      ...prevState,
      selectedAnswer: option,
    }));
  };

  const handleButtonClick = (): void => {
    if (state.selectedAnswer === null || state.currentQuestion === null) {
      return;
    }

    quizCore.answerQuestion(state.selectedAnswer);

    if (quizCore.hasNextQuestion()) {
      quizCore.nextQuestion();

      setState({
        currentQuestion: quizCore.getCurrentQuestion(),
        selectedAnswer: null,
        score: quizCore.getScore(),
        totalQuestions: quizCore.getTotalQuestions(),
        isFinished: false,
      });
    } else {
      setState({
        currentQuestion: null,
        selectedAnswer: null,
        score: quizCore.getScore(),
        totalQuestions: quizCore.getTotalQuestions(),
        isFinished: true,
      });
    }
  };

  if (state.isFinished || state.currentQuestion === null) {
    return (
      <div className="quiz-container">
        <h2>Quiz Completed</h2>
        <p>
          Final Score: {state.score} / {state.totalQuestions}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Quiz Question</h2>
      <p className="question-text">{state.currentQuestion.question}</p>

      <h3>Answer Options</h3>
      <ul className="options-list">
        {state.currentQuestion.options.map((option) => (
          <li
            key={option}
            className={`option ${state.selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>

      <button
        onClick={handleButtonClick}
        disabled={state.selectedAnswer === null}
      >
        {quizCore.hasNextQuestion() ? 'Next Question' : 'Submit'}
      </button>
    </div>
  );
};

export default Quiz;