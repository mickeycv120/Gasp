/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
    thickness?: number;
  };

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      gsap.fromTo(
        bottomRef.current,
        { x: "0%", opacity: 1 },
        {
          x: "-100%",
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: parseFloat(
            typeof speed === "string" ? speed.replace("s", "") : "6"
          ),
          ease: "linear",
        }
      );
    }
    if (topRef.current) {
      gsap.fromTo(
        topRef.current,
        { x: "0%", opacity: 1 },
        {
          x: "100%",
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: parseFloat(
            typeof speed === "string" ? speed.replace("s", "") : "6"
          ),
          ease: "linear",
        }
      );
    }
    // Limpieza
    return () => {
      gsap.killTweensOf(bottomRef.current);
      gsap.killTweensOf(topRef.current);
    };
  }, [speed]);

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style,
      }}
    >
      <div
        ref={bottomRef}
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
        }}
      ></div>
      <div
        ref={topRef}
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
        }}
      ></div>
      <div className="relative z-1 bg-gradient-to-b from-black to-gray-900 border border-gray-800 text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px]">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
//         'star-movement-top': 'star-movement-top linear infinite alternate',
//       },
//       keyframes: {
//         'star-movement-bottom': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
//         },
//         'star-movement-top': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
//         },
//       },
//     },
//   }
// }
