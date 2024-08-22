import React, { JSX } from "react";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

interface TypewriterEffectSmoothDemoProps {
  name: string;
}

const TypewriterEffectSmoothDemo: React.FC<TypewriterEffectSmoothDemoProps> = ({ name }) => {
    
  const words = [
    {
      text: name,
      className: "text-green-900 dark:text-green-900",
    },
  ];

  return (
    <div className="">
      <TypewriterEffectSmooth words={words} />
    </div>
  );
};

export default TypewriterEffectSmoothDemo;
