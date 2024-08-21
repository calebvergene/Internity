import React from 'react';

const cleanPercentage = (percentage: number) =>
    !Number.isFinite(percentage) || percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;

const Circle = ({ colour, percentage = 0 }: { colour: string; percentage?: number }) => {
    const r = 13;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - percentage) * circ) / 100;

    return (
        <circle
            r={r}
            cx={15}
            cy={15}
            fill="transparent"
            stroke={strokePct !== circ ? colour : ""}
            strokeWidth={"5"}
            strokeDasharray={circ}
            strokeDashoffset={percentage ? strokePct : 0}
        />
    );
};

interface CircleTextProps {
    percentage: number;
    colour: string;
  }
  
  const CircleText: React.FC<CircleTextProps> = ({ percentage, colour }) => (
      <text
        x="38%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={"0.7em"}
          fill={colour}  // Use the colour prop here
          className="font-rubik font-medium text-[0.7rem]"
      >
          {percentage.toFixed(0)}
      </text>
  );
  

const Pie = ({ percentage, colour }: { percentage: number; colour: string }) => {
    const pct = cleanPercentage(percentage);
    return (
        <svg width={40} height={40}>
            <g transform="rotate(-90 15 15)">
                <Circle colour="lightgrey" />
                <Circle colour={colour} percentage={pct} />
            </g>
            <CircleText percentage={pct} colour={'#6B7280'} />
        </svg>
    );
};

export default Pie;
