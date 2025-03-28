import { forwardRef } from "react";
import "./box.css";

const Box = forwardRef(({ disabled, change, name, status, value, onKeyDown, onFocus }, ref) => {
    const getBackgroundColor = () => {
        switch (status) {
            case 'correct-position': return 'green';
            case 'correct-letter': return 'yellow';
            case 'incorrect': return 'red';
            default: return 'white';
        }
    };

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase();
        if (value.length <= 1 && /^[A-Z]?$/.test(value)) {
            change(e);
        }
    };

    return (
        <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            maxLength={1}
            className="wordle-input"
            disabled={disabled}
            style={{
                backgroundColor: getBackgroundColor(),
                color: status ? 'white' : 'black',
                borderColor: status ? getBackgroundColor() : '#d3d6da',
                fontWeight: 'bold',
                resize: "none",
                width: "50px",
                height: "50px",
                textAlign: "center",
                fontSize: "24px",
                lineHeight: "50px",
                caretColor: "transparent"
            }}
        />
    );
});

export default Box;