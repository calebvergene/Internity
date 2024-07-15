import React, { useEffect, useState } from 'react';

const Typewriter: React.FC = () => {
  const words = ["application tracker.    ", "internship calendar.    ", "opportunity hub.    "];
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const handleType = () => {
      const current = words[loopIndex];
      if (isDeleting) {
        setCurrentWord(current.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setLoopIndex((loopIndex + 1) % words.length);
        }
      } else {
        setCurrentWord(current.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex === current.length) {
          setIsDeleting(true);
        }
      }
    };

    const typingTimeout = setTimeout(handleType, 100);

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, loopIndex, words]);

  return (
    <div className="flex items-center bg-gray-100 mt-2">
      <h1 className="text-5xl font-bold">
        <span id="typewriter" className='text-green-500'>{currentWord}</span>
        <span className="blinking-cursor">|</span>
      </h1>
    </div>
  );
};

export default Typewriter;
