import Boxes from "./Comp/boxes.jsx";
import { useState, useEffect, useRef } from "react";
import { WordList } from "./Comp/wordlist.jsx";
import Keyboard from "./Comp/Keyboard.jsx";

export default function Wordguess() {
    const [currentWord, setCurrentWord] = useState('');
    const [activeRow, setActiveRow] = useState(1);
    const [allRowsData, setAllRowsData] = useState({});
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const [keyStatus, setKeyStatus] = useState({});
    const boxesRef = useRef();

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * WordList.length);
        setCurrentWord(WordList[randomIndex]);
    }, []);

    const checkLetters = (guess) => {
        const target = currentWord.toLowerCase();
        const result = Array(guess.length).fill(null);
        const targetLetters = target.split('');
        const guessLetters = guess.toLowerCase().split('');

        guessLetters.forEach((letter, i) => {
            if (letter === targetLetters[i]) {
                result[i] = { letter, status: 'correct-position' };
                targetLetters[i] = null;
            }
        });

        guessLetters.forEach((letter, i) => {
            if (!result[i] && targetLetters.includes(letter)) {
                result[i] = { letter, status: 'correct-letter' };
                targetLetters[targetLetters.indexOf(letter)] = null;
            } else if (!result[i]) {
                result[i] = { letter, status: 'incorrect' };
            }
        });

        return result;
    };

    const handleRowSubmit = (rowData) => {
        const rowLetters = Object.values(rowData).join('').toLowerCase();
        if (rowLetters.length !== currentWord.length) {
            setMessage("Please fill all letters!");
            return;
        }

        const letterStates = checkLetters(rowLetters);
        setAllRowsData(prev => ({
            ...prev,
            [activeRow]: { data: rowData, letterStates }
        }));

        const newKeyStatus = { ...keyStatus };
        letterStates.forEach(({ letter, status }) => {
            if (!newKeyStatus[letter] ||
                (status === 'correct-position') ||
                (status === 'correct-letter' && newKeyStatus[letter] !== 'correct-position')) {
                newKeyStatus[letter] = status;
            }
        });
        setKeyStatus(newKeyStatus);

        if (letterStates.every(letter => letter.status === 'correct-position')) {
            setMessage("Congratulations! You guessed the word!");
            setGameOver(true);
        } else if (activeRow >= 6) {
            setMessage(`Game over! The word was ${currentWord}`);
            setGameOver(true);
        } else {
            setActiveRow(prev => prev + 1);
            setMessage("");
        }
    };

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
            <h1>Word Guessing Game</h1>
            {message && <div style={{
                margin: '20px',
                padding: '10px',
                fontWeight: 'bold',
                color: message.includes('Congratulations') ? 'green' : 'red'
            }}>{message}</div>}

            {[1, 2, 3, 4, 5, 6].map(row => (
                <div key={row}>
                    <Boxes
                        disabled={activeRow !== row || gameOver}
                        letterStates={allRowsData[row]?.letterStates}
                        onSubmit={handleRowSubmit}
                        active={activeRow === row}
                        rowNumber={row}
                        ref={row === activeRow ? boxesRef : null}
                    />
                    <br />
                </div>
            ))}

            <Keyboard
                onKeyPress={(key) => {
                    if (boxesRef.current && !gameOver) {
                        boxesRef.current.handleKeyboardInput(key);
                    }
                }}
                keyStatus={keyStatus}
            />
        </div>
    );
}