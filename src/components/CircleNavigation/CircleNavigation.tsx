import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./CircleNavigation.module.scss";

interface CircleNavigationProps {
  segmentsCount: number;
  activeSegment: number;
  onSegmentChange: (index: number) => void;
  titles: string[];
}

const CircleNavigation: React.FC<CircleNavigationProps> = ({
  segmentsCount,
  activeSegment,
  onSegmentChange,
  titles,
}) => {
  const radius = 200;
  const center = 265;
  const containerRef = useRef<SVGGElement>(null);

  const calculatePosition = (index: number) => {
    const angle = (360 / segmentsCount) * index - 45;
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  useEffect(() => {
    if (containerRef.current) {
      const rotation = -(360 / segmentsCount) * activeSegment;
      gsap.to(containerRef.current, {
        rotation,
        transformOrigin: "center center",
        duration: 0.6,
      });
    }
  }, [activeSegment, segmentsCount]);

  return (
    <svg width="530" height="530">
      <g ref={containerRef}>
        {titles.map((title, index) => {
          const { x, y } = calculatePosition(index);
          const isActive = index === activeSegment;

          return (
            <g
              key={index}
              onClick={() => onSegmentChange(index)}
              className={styles.pointGroup}
              cursor="pointer"
            >
              <circle
                cx={x}
                cy={y}
                r={20}
                fill={isActive ? "#426b1f" : "#fff"}
                stroke="#426b1f"
                strokeWidth={2}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill={isActive ? "#fff" : "#426b1f"}
                fontSize={14}
              >
                {title}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default CircleNavigation;
