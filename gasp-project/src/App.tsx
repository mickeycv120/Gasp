import "./App.css";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================
const ANIMATION_CONFIG = {
  ROTATION_DEGREES: 90,
  MOVEMENT_OFFSET: 10,
  DURATION: 0.3,
  EASING: {
    IN_OUT: "power2.inOut",
    OUT: "power2.out",
    ELASTIC: "elastic.out(1, 0.3)",
    BACK: "back.out(1.7)",
  },
} as const;

const COUNTER_CONFIG = {
  MIN_VALUE: 0,
  MAX_VALUE: 9999,
  DIGIT_COUNT: 4,
} as const;

const BUTTON_ANIMATION_CONFIG = {
  SCALE: {
    PRESSED: 0.95,
    EXPANDED: 1.05,
    HOVER: 1.1,
    NORMAL: 1,
  },
  DURATION: {
    PRESS: 0.1,
    EXPAND: 0.15,
    RETURN: 0.2,
    HOVER: 0.3,
  },
  EASING: {
    OUT: "power2.out",
    BACK: "back.out(1.7)",
    ELASTIC: "elastic.out(1, 0.3)",
  },
} as const;

// ============================================================================
// TIPOS
// ============================================================================
interface OdometerDigitProps {
  value: number;
}

// ============================================================================
// HOOKS PERSONALIZADOS
// ============================================================================

/**
 * Hook para manejar la animación de un dígito del odómetro
 * Principio: Single Responsibility - Solo maneja la animación del dígito
 */
function useDigitAnimation(value: number) {
  const digitRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState(value);

  const animateDigitChange = (newValue: number, oldValue: number) => {
    if (!digitRef.current || newValue === oldValue) return;

    const direction = newValue > oldValue ? -1 : 1;
    const { ROTATION_DEGREES, MOVEMENT_OFFSET, DURATION, EASING } =
      ANIMATION_CONFIG;

    // Fase 1: Rotar hacia afuera
    gsap.fromTo(
      digitRef.current,
      { rotationX: 0, y: 0 },
      {
        rotationX: direction * ROTATION_DEGREES,
        y: direction * MOVEMENT_OFFSET,
        duration: DURATION,
        ease: EASING.IN_OUT,
        onComplete: () => {
          setCurrentValue(newValue);

          // Fase 2: Rotar hacia adentro
          gsap.fromTo(
            digitRef.current,
            {
              rotationX: -direction * ROTATION_DEGREES,
              y: -direction * MOVEMENT_OFFSET,
            },
            {
              rotationX: 0,
              y: 0,
              duration: DURATION,
              ease: EASING.OUT,
            }
          );
        },
      }
    );
  };

  useGSAP(() => {
    if (value !== currentValue) {
      animateDigitChange(value, currentValue);
    }
  }, [value, currentValue]);

  return { digitRef, currentValue };
}

/**
 * Hook para manejar las animaciones de botones
 * Principio: Single Responsibility - Solo maneja animaciones de botones
 */
function useButtonAnimations() {
  const createButtonAnimation = (
    buttonRef: React.RefObject<HTMLButtonElement>
  ) => {
    if (!buttonRef.current) return;

    const { SCALE, DURATION } = BUTTON_ANIMATION_CONFIG;

    gsap
      .timeline()
      .to(buttonRef.current, {
        scale: SCALE.PRESSED,
        duration: DURATION.PRESS,
        ease: BUTTON_ANIMATION_CONFIG.EASING.OUT,
      })
      .to(buttonRef.current, {
        scale: SCALE.EXPANDED,
        duration: DURATION.EXPAND,
        ease: BUTTON_ANIMATION_CONFIG.EASING.BACK,
      })
      .to(buttonRef.current, {
        scale: SCALE.NORMAL,
        duration: DURATION.RETURN,
        ease: BUTTON_ANIMATION_CONFIG.EASING.ELASTIC,
      });
  };

  const setupHoverAnimation = (
    buttonRef: React.RefObject<HTMLButtonElement>,
    shadowColor: string
  ) => {
    if (!buttonRef.current) return () => {};

    const btn = buttonRef.current;
    const { SCALE, DURATION } = BUTTON_ANIMATION_CONFIG;

    const handleMouseEnter = () => {
      gsap.to(btn, {
        scale: SCALE.HOVER,
        boxShadow: `0 10px 25px ${shadowColor}`,
        duration: DURATION.HOVER,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        scale: SCALE.NORMAL,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: DURATION.HOVER,
        ease: "power2.out",
      });
    };

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);

    // Retornar función de cleanup
    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  };

  return { createButtonAnimation, setupHoverAnimation };
}

/**
 * Hook para manejar el estado del contador
 * Principio: Single Responsibility - Solo maneja la lógica del contador
 */
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => Math.min(COUNTER_CONFIG.MAX_VALUE, prev + 1));
  };

  const decrement = () => {
    setCount((prev) => Math.max(COUNTER_CONFIG.MIN_VALUE, prev - 1));
  };

  const getDigits = (num: number): number[] => {
    return num
      .toString()
      .padStart(COUNTER_CONFIG.DIGIT_COUNT, "0")
      .split("")
      .map(Number);
  };

  return {
    count,
    digits: getDigits(count),
    increment,
    decrement,
  };
}

// ============================================================================
// COMPONENTES
// ============================================================================

/**
 * Componente de dígito individual del odómetro
 * Principio: Single Responsibility - Solo renderiza y anima un dígito
 */
function OdometerDigit({ value }: OdometerDigitProps) {
  const { digitRef, currentValue } = useDigitAnimation(value);

  return (
    <div className="relative w-16 h-20 bg-black rounded-lg shadow-lg overflow-hidden border-2 border-gray-700">
      <div
        ref={digitRef}
        className="absolute inset-0 flex items-center justify-center text-4xl font-mono font-bold text-green-400"
        style={{ perspective: "1000px" }}
      >
        {currentValue}
      </div>

      {/* Efectos visuales */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-600" />
    </div>
  );
}

/**
 * Componente de botón animado
 * Principio: Single Responsibility - Solo maneja un botón con sus animaciones
 */
interface AnimatedButtonProps {
  onClick: () => void;
  variant: "increment" | "decrement";
  children: React.ReactNode;
}

function AnimatedButton({ onClick, variant, children }: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { createButtonAnimation, setupHoverAnimation } = useButtonAnimations();

  const handleClick = () => {
    if (buttonRef.current) {
      createButtonAnimation(buttonRef as React.RefObject<HTMLButtonElement>);
    }
    onClick();
  };

  const buttonConfig = {
    increment: {
      className:
        "px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors",
      shadowColor: "rgba(34, 197, 94, 0.4)",
    },
    decrement: {
      className:
        "px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors",
      shadowColor: "rgba(239, 68, 68, 0.4)",
    },
  };

  const config = buttonConfig[variant];

  useGSAP(() => {
    if (buttonRef.current) {
      const cleanup = setupHoverAnimation(
        buttonRef as React.RefObject<HTMLButtonElement>,
        config.shadowColor
      );
      return cleanup;
    }
    return () => {};
  }, [config.shadowColor]);

  return (
    <button ref={buttonRef} onClick={handleClick} className={config.className}>
      {children}
    </button>
  );
}

/**
 * Componente del display del odómetro
 * Principio: Single Responsibility - Solo maneja la visualización de dígitos
 */
interface OdometerDisplayProps {
  digits: number[];
}

function OdometerDisplay({ digits }: OdometerDisplayProps) {
  return (
    <div className="flex gap-3 mb-8 p-4 bg-gray-800 rounded-xl">
      {digits.map((digit, index) => (
        <OdometerDigit key={index} value={digit} />
      ))}
    </div>
  );
}

/**
 * Componente de controles
 * Principio: Single Responsibility - Solo maneja los botones de control
 */
interface ControlsProps {
  onIncrement: () => void;
  onDecrement: () => void;
}

function Controls({ onIncrement, onDecrement }: ControlsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <AnimatedButton onClick={onDecrement} variant="decrement">
        - Decrementar
      </AnimatedButton>
      <AnimatedButton onClick={onIncrement} variant="increment">
        + Incrementar
      </AnimatedButton>
    </div>
  );
}

/**
 * Componente de información del contador
 * Principio: Single Responsibility - Solo muestra información del estado actual
 */
interface CounterInfoProps {
  count: number;
}

function CounterInfo({ count }: CounterInfoProps) {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm">Valor actual:</p>
      <p className="text-3xl font-mono text-green-400">{count}</p>
    </div>
  );
}

/**
 * Componente de documentación educativa
 * Principio: Single Responsibility - Solo maneja la documentación
 */
function EducationalSection() {
  return (
    <div className="mt-8 max-w-2xl text-center text-gray-300 text-sm">
      <h3 className="text-lg font-bold mb-2 text-white">¿Cómo funciona?</h3>

      <div className="space-y-2">
        <p>
          1. El número se divide en dígitos individuales usando{" "}
          <code className="bg-gray-700 px-1 rounded">getDigits()</code>
        </p>

        <p>
          2. Cada dígito es un componente{" "}
          <code className="bg-gray-700 px-1 rounded">OdometerDigit</code>{" "}
          independiente
        </p>

        <p>
          3. Cuando un dígito cambia, GSAP anima solo ese dígito con rotación 3D
        </p>

        <p className="mt-4 text-xs text-gray-400">
          <strong>Principios aplicados:</strong> SOLID, Clean Code, Separation
          of Concerns
        </p>
      </div>
    </div>
  );
}

/**
 * Componente principal del odómetro
 * Principio: Open/Closed - Abierto para extensión, cerrado para modificación
 * Principio: Dependency Inversion - Depende de abstracciones (hooks), no de implementaciones
 */
export default function App() {
  const { count, digits, increment, decrement } = useCounter(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-green-400">
          Contador Odómetro - Clean Code
        </h1>
        <p className="text-gray-400 max-w-md">
          Implementación siguiendo principios SOLID y Clean Code. Cada
          componente tiene una responsabilidad única.
        </p>
      </header>

      <main className="flex flex-col items-center">
        <OdometerDisplay digits={digits} />
        <Controls onIncrement={increment} onDecrement={decrement} />
        <CounterInfo count={count} />
      </main>

      <footer>
        <EducationalSection />
      </footer>
    </div>
  );
}
