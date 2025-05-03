import React, { useEffect, useState } from "react";

interface TypewriterProps {
    text: string;
    typingSpeed?: number; // Speed of typing in milliseconds
    pauseDuration?: number; // Duration to pause after typing the full text
    deletingSpeed?: number; // Speed of deleting in milliseconds
}

const Typewriter = ({ text, typingSpeed = 100, pauseDuration = 1500, deletingSpeed = 50 }: TypewriterProps) => {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!isDeleting && index < text.length) {
            timeout = setTimeout(() => {
                setDisplayText(prev => prev + text.charAt(index));
                setIndex(prev => prev + 1);
            }, typingSpeed);
        } else if (!isDeleting && index === text.length) {
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        } else if (isDeleting && index > 0) {
            timeout = setTimeout(() => {
                setDisplayText(text.substring(0, index - 1));
                setIndex(prev => prev - 1);
            }, deletingSpeed);
        } else if (isDeleting && index === 0) {
            timeout = setTimeout(() => setIsDeleting(false), typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [index, isDeleting, text, typingSpeed, pauseDuration, deletingSpeed]);

    return <span>{displayText}</span>;
};

export default Typewriter;
