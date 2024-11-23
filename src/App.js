import React, { useState, useEffect } from 'react';
import './App.css';

const defaultColors = ['red', 'blue', 'green', 'yellow'];

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [colors, setColors] = useState(defaultColors);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [currentFlashIndex, setCurrentFlashIndex] = useState(0);
  const [flashingColors, setFlashingColors] = useState([]); // To track which colors are flashing
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('highScore')) || 0);

  // Adjust colors based on difficulty
  useEffect(() => {
    if (difficulty === 'medium') {
      setColors(['red', 'blue', 'green', 'yellow', 'purple']);
    } else if (difficulty === 'hard') {
      setColors(['red', 'blue', 'green', 'yellow', 'purple', 'orange']);
    } else {
      setColors(defaultColors);
    }
  }, [difficulty]);

  const startGame = () => {
    setSequence([]);
    setUserInput([]);
    setScore(0);
    setMessage('');
    addNewColorToSequence();
    setIsGameStarted(true);
  };

  const addNewColorToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence(prevSequence => [...prevSequence, randomColor]);
    startFlashingSequence();
  };

  const startFlashingSequence = () => {
    setIsFlashing(true);
    setCurrentFlashIndex(0);
    setFlashingColors([]); // Reset the flashing colors
  };

  useEffect(() => {
    if (isFlashing && currentFlashIndex < sequence.length) {
      const colorToFlash = sequence[currentFlashIndex];
      setFlashingColors(prevFlashingColors => [...prevFlashingColors, colorToFlash]);

      const timeout = setTimeout(() => {
        setFlashingColors(prevFlashingColors => prevFlashingColors.filter(color => color !== colorToFlash));
        setCurrentFlashIndex(prevIndex => prevIndex + 1);
      }, 800); // Adjust the flashing duration

      return () => clearTimeout(timeout);
    } else if (currentFlashIndex === sequence.length) {
      setIsFlashing(false);
    }
  }, [isFlashing, currentFlashIndex, sequence.length]);

  const handleUserInput = (color) => {
    if (userInput.length < sequence.length) {
      const newInput = [...userInput, color];
      setUserInput(newInput);

      if (newInput[newInput.length - 1] === sequence[newInput.length - 1]) {
        if (newInput.length === sequence.length) {
          setMessage('Correct!');
          updateScore();
          setTimeout(() => {
            setUserInput([]);
            addNewColorToSequence();
          }, 2000);
        }
      } else {
        setMessage('Game Over!');
        setIsGameStarted(false);
        checkAndUpdateHighScore();
      }
    }
  };

  const updateScore = () => {
    const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    setScore(prevScore => prevScore + points);
  };

  const checkAndUpdateHighScore = () => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
    }
  };

  return (
    <div className="App min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center">
      <header className="App-header text-center space-y-8">
        <h1 className="text-4xl font-bold">Simon Memory Game</h1>

        {!isGameStarted && (
          <div className="space-y-4">
            <h2 className="text-2xl">Select Difficulty</h2>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setDifficulty('easy'); startGame(); }} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">Easy (4 colors)</button>
              <button onClick={() => { setDifficulty('medium'); startGame(); }} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg">Medium (5 colors)</button>
              <button onClick={() => { setDifficulty('hard'); startGame(); }} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">Hard (6 colors)</button>
            </div>
          </div>
        )}

        {isGameStarted && (
          <div>
            <h2 className="text-2xl">Memorize the sequence</h2>
            <div className="game-area flex gap-6 justify-center mt-6">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleUserInput(color)}
                  className={`w-24 h-24 rounded-full transition-all duration-200 ${color === 'red' && 'bg-red-500'} ${color === 'blue' && 'bg-blue-500'} ${color === 'green' && 'bg-green-500'} ${color === 'yellow' && 'bg-yellow-500'} ${color === 'purple' && 'bg-purple-500'} ${color === 'orange' && 'bg-orange-500'}
                  ${flashingColors.includes(color) ? 'opacity-100 scale-110' : 'opacity-30'} hover:opacity-100 hover:scale-110`}
                ></button>
              ))}
            </div>
            <p className="text-lg mt-4">Score: {score}</p>
          </div>
        )}

        {message && <p className="text-xl font-semibold">{message}</p>}
        <p className="text-xl font-semibold mt-4">High Score: {highScore}</p>
      </header>
    </div>
  );
}

export default App;
