import Box from "./Box.jsx";
import { useState, useEffect, useRef, forwardRef } from "react";

const Boxes = forwardRef(({ disabled, active, letterStates, onSubmit, rowNumber }, ref) => {
    const [feld, setFeld] = useState({
        1: "", 2: "", 3: "", 4: "", 5: "", 6: ""
    });
    const [activeBox, setActiveBox] = useState(1);
    const boxRefs = useRef([]);

    useEffect(() => {
        if (active) {
            setActiveBox(1);
            if (boxRefs.current[0]) {
                boxRefs.current[0].focus();
            }
        }
    }, [active]);

    const handleOnChange = (event, boxNum) => {
        const { value } = event.target;
        setFeld(prev => ({ ...prev, [boxNum]: value.toUpperCase() }));

        if (value && boxNum < 6) {
            setActiveBox(boxNum + 1);
            boxRefs.current[boxNum].focus();
        }
    };

    const handleKeyDown = (e, boxNum) => {
        if (e.key === "Enter") {
            onSubmit(feld);
            return;
        }

        if (e.key === "Backspace") {
            if (!feld[boxNum] && boxNum > 1) {
                setActiveBox(boxNum - 1);
                boxRefs.current[boxNum - 2].focus();
            }
        } else if (e.key === "ArrowLeft" && boxNum > 1) {
            setActiveBox(boxNum - 1);
            boxRefs.current[boxNum - 2].focus();
        } else if (e.key === "ArrowRight" && boxNum < 6) {
            setActiveBox(boxNum + 1);
            boxRefs.current[boxNum].focus();
        }
    };

    const handleKeyboardInput = (key) => {
        if (!active) return;

        const currentBox = activeBox;

        if (key === "Delete" || key === "Backspace") {
            setFeld(prev => ({ ...prev, [currentBox]: "" }));
            if (currentBox > 1) {
                setActiveBox(currentBox - 1);
                boxRefs.current[currentBox - 2].focus();
            }
        } else if (key === "Enter") {
            onSubmit(feld);
        } else if (/^[A-Z]$/.test(key)) {
            setFeld(prev => ({ ...prev, [currentBox]: key }));
            if (currentBox < 6) {
                setActiveBox(currentBox + 1);
                boxRefs.current[currentBox].focus();
            }
        }
    };

    useEffect(() => {
        if (ref) {
            ref.current = { handleKeyboardInput };
        }
    }, [ref, handleKeyboardInput]);

    useEffect(() => {
        if (!active) return;

        const handleGlobalKeyDown = (e) => {
            if (e.key === "Enter") {
                onSubmit(feld);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [active, feld, onSubmit]);

    return (
        <div style={{ display: "flex", gap: "5px", justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5, 6].map((boxNum) => (
                <Box
                    key={boxNum}
                    ref={el => boxRefs.current[boxNum - 1] = el}
                    disabled={disabled}
                    name={String(boxNum)}
                    change={(e) => handleOnChange(e, boxNum)}
                    onKeyDown={(e) => handleKeyDown(e, boxNum)}
                    status={letterStates?.[boxNum - 1]?.status}
                    value={feld[boxNum]}
                    onFocus={() => setActiveBox(boxNum)}
                />
            ))}
        </div>
    );
});

export default Boxes;