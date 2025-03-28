import React from 'react';
import './Keyboard.css';

const Keyboard = ({ onKeyPress, keyStatus }) => {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
    ];

    const getKeyStatus = (key) => {
        if (key === 'Enter' || key === 'Backspace') return '';
        return keyStatus[key.toLowerCase()] || '';
    };

    return (
        <div className="keyboard-container">
            <div className="keyboard">
                {keys.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {row.map((key, index) => {
                            const status = getKeyStatus(key);
                            return (
                                <button
                                    key={index}
                                    className={`key ${key === 'Enter' || key === 'Backspace' ? 'large-key' : ''} ${status}`}
                                    onClick={() => onKeyPress(key)}
                                >
                                    {key === 'Backspace' ? '⌫' : key}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Keyboard;