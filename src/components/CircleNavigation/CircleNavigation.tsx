import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./CircleNavigation.module.scss";

interface CircleNavigationProps {
  segmentsCount: number;
  activeSegment: number;
  onSegmentChange: (index: number) => void;
  titles: string[];
  ids: number[];
}

const CircleNavigation: React.FC<CircleNavigationProps> = ({
  segmentsCount,
  activeSegment,
  onSegmentChange,
  ids,
}) => {
  const size = 530;
  const center = size / 2;
  const smallCircleDefault = 6;
  const smallCircleActive = 20;

  const radius = center;

  const containerRef = useRef<SVGGElement>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const fixedAngles = [300, 0, 60, 120, 180, 240];

  const calculatePosition = (index: number) => {
    const angle =
      segmentsCount === 6
        ? fixedAngles[index % 6]
        : (360 / segmentsCount) * index - 90;
    const radian = (angle * Math.PI) / 180;

    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
    };
  };

  useEffect(() => {
    if (containerRef.current) {
      const newRotation = -(360 / segmentsCount) * activeSegment;
      setRotation(newRotation);
      gsap.to(containerRef.current, {
        rotation: newRotation,
        transformOrigin: `${center}px ${center}px`,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [activeSegment, segmentsCount, center]);

  return (
    <svg
      className={styles.circleContainer}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <g ref={containerRef} transform={`translate(${center}, ${center})`}>
        {ids.map((id, index) => {
          const { x, y } = calculatePosition(index);
          const isActive = index === activeSegment;
          const isHovered = index === hoveredSegment;
          const showId = isActive || isHovered;

          return (
            <g
              key={index}
              onClick={() => onSegmentChange(index)}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={styles.pointGroup}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={x}
                cy={y}
                r={isActive ? smallCircleActive : smallCircleDefault}
                fill={isActive ? "var(--white)" : "var(--blue-black)"}
                stroke="var(--blue-black)"
                strokeWidth={isActive ? 2 : 0}
                className={`${styles.circle} ${isActive ? styles.active : ""}`}
              />
              {showId && (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="var(--blue-black)"
                  fontSize={14}
                  fontWeight="bold"
                  transform={`rotate(${-rotation}, ${x}, ${y})`}
                  className={styles.circleText}
                >
                  {id}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default CircleNavigation;
