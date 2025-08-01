import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useEffect } from "react";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps): React.ReactElement {
  const y = useTransform(mv, (latest: number): number => {
    const placeValue: number = latest % 10;
    const offset: number = (10 + number - placeValue) % 10;
    let memo: number = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center select-none"
    >
      {number}
    </motion.span>
  );
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitClassName?: string;
}

function Digit({
  place,
  value,
  height,
  digitClassName = "",
}: DigitProps): React.ReactElement {
  const valueRoundedToPlace: number = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const style: React.CSSProperties = {
    height,
    width: "1ch",
  };

  return (
    <div
      style={style}
      className={`relative tabular-nums overflow-hidden ${digitClassName}`}
    >
      {Array.from({ length: 10 }, (_: unknown, i: number) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  containerClassName?: string;
  counterClassName?: string;
  digitClassName?: string;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientClassName?: string;
  bottomGradientClassName?: string;
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "black",
  fontWeight = "bold",
  containerClassName = "",
  counterClassName = "",
  digitClassName = "",
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientClassName = "",
  bottomGradientClassName = "",
}: CounterProps): React.ReactElement {
  const height: number = fontSize + padding;

  const style: React.CSSProperties = {
    fontSize,
    gap: gap,
    color: textColor,
    fontWeight: fontWeight,
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    minHeight: height,
  };

  const gradientStyle = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };

  const bottomGradientStyle = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      <div
        style={style}
        className={`flex overflow-hidden leading-none font-mono ${counterClassName}`}
      >
        {places.map((place: number) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitClassName={digitClassName}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div style={gradientStyle} className={topGradientClassName} />
        <div
          style={bottomGradientStyle}
          className={`absolute bottom-0 w-full ${bottomGradientClassName}`}
        />
      </div>
    </div>
  );
}
