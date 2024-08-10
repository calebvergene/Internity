import React, { ReactNode, ButtonHTMLAttributes } from "react";

const SquareButton = () => {
  return (
      <DrawOutlineButton title="Button Tooltip">New Applications</DrawOutlineButton>

  );
};

type DrawOutlineButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  title: string;
};

const DrawOutlineButton: React.FC<DrawOutlineButtonProps> = ({ children, title, ...rest }) => {
  return (
    <button
      {...rest}
      className="group relative px-4 py-2 font-medium text-slate-100 transition-colors duration-[400ms] hover:text-green-500"
      title={title}
    >
      <span>{children}</span>

      {/* TOP */}
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-green-500 transition-all duration-100 group-hover:w-full" />

      {/* RIGHT */}
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-green-500 transition-all delay-100 duration-100 group-hover:h-full" />

      {/* BOTTOM */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-green-500 transition-all delay-200 duration-100 group-hover:w-full" />

      {/* LEFT */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-green-500 transition-all delay-300 duration-100 group-hover:h-full" />
    </button>
  );
};

export default SquareButton;
