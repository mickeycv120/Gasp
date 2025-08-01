import "./App.css";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "./index.css"; // Asegúrate de importar Tailwind aquí

// Componente de dígito individual del odómetro
// Este componente representa UN SOLO dígito (0-9) y se anima cuando cambia
function OdometerDigit({ value }: { value: number; position: number }) {
  // Referencia al elemento DOM que vamos a animar
  const digitRef = useRef<HTMLDivElement>(null);

  // Estado local que guarda el valor actual mostrado
  const [currentValue, setCurrentValue] = useState(value);

  // Hook de GSAP que se ejecuta cuando 'value' cambia
  useGSAP(() => {
    // Solo animar si el nuevo valor es diferente al actual
    if (value !== currentValue) {
      // Determinar dirección de la animación:
      // Si el nuevo valor es mayor: rotar hacia arriba (dirección -1)
      // Si el nuevo valor es menor: rotar hacia abajo (dirección 1)
      const direction = value > currentValue ? -1 : 1;

      // PRIMERA PARTE: Rotar el dígito actual hacia afuera
      gsap.fromTo(
        digitRef.current,
        {
          rotationX: 0, // Posición inicial (sin rotación)
          y: 0, // Posición inicial (sin desplazamiento)
        },
        {
          rotationX: direction * 90, // Rotar 90 grados
          y: direction * 10, // Mover ligeramente
          duration: 0.3, // Duración de la animación
          ease: "power2.inOut", // Tipo de easing

          // Cuando termina la primera animación:
          onComplete: () => {
            // Cambiar el número mostrado
            setCurrentValue(value);

            // SEGUNDA PARTE: Traer el nuevo dígito desde el otro lado
            gsap.fromTo(
              digitRef.current,
              {
                rotationX: -direction * 90, // Empezar desde el lado opuesto
                y: -direction * 10,
              },
              {
                rotationX: 0, // Volver a la posición normal
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              }
            );
          },
        }
      );
    }
  }, [value]); // Se ejecuta cada vez que 'value' cambia

  return (
    // Contenedor del dígito con estilo de pantalla digital
    <div className="relative w-16 h-20 bg-black rounded-lg shadow-lg overflow-hidden border-2 border-gray-700">
      {/* El dígito en sí */}
      <div
        ref={digitRef} // Referencia para GSAP
        className="absolute inset-0 flex items-center justify-center text-4xl font-mono font-bold text-green-400"
        style={{ perspective: "1000px" }} // Perspectiva 3D
      >
        {currentValue}
      </div>

      {/* Efectos visuales para simular una pantalla real */}
      {/* Brillo en la parte superior */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Línea divisoria en el medio */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-600"></div>
    </div>
  );
}

// Componente principal - Contador Odómetro Simplificado para Aprendizaje
export default function App() {
  // Estado principal: mantiene el valor actual del contador (0-9999)
  const [count, setCount] = useState(0);

  // Referencias para animar los botones
  const decrementBtnRef = useRef<HTMLButtonElement>(null);
  const incrementBtnRef = useRef<HTMLButtonElement>(null);

  // Función que convierte un número en un array de 4 dígitos
  // Ejemplo: 42 → [0, 0, 4, 2]
  // Ejemplo: 1234 → [1, 2, 3, 4]
  const getDigits = (num: number): number[] => {
    // 1. Convertir número a string
    // 2. Rellenar con ceros a la izquierda hasta tener 4 caracteres
    // 3. Dividir en caracteres individuales
    // 4. Convertir cada carácter de vuelta a número
    const str = Math.abs(num).toString().padStart(4, "0");
    return str.split("").map((d) => parseInt(d));
  };

  // Convertimos el número actual en array de dígitos para renderizar
  const digits = getDigits(count);

  // Función para animar un botón cuando se hace clic
  const animateButton = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (buttonRef.current) {
      // Animación de "pulso" con escala y rotación
      gsap
        .timeline()
        .to(buttonRef.current, {
          scale: 0.95,
          /* rotation: 2, */
          duration: 0.1,
          ease: "power2.out",
        })
        .to(buttonRef.current, {
          scale: 1.05,
          /* rotation: -1, */
          duration: 0.15,
          ease: "back.out(1.7)",
        })
        .to(buttonRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.2,
          ease: "elastic.out(1, 0.3)",
        });
    }
  };

  // Función que maneja los clics de los botones
  const handleClick = (action: "inc" | "dec") => {
    // Animar el botón correspondiente
    if (action === "inc") {
      if (incrementBtnRef.current) {
        animateButton(incrementBtnRef as React.RefObject<HTMLButtonElement>);
      }
      // Incrementar el contador (máximo 9999)
      setCount((prev) => Math.min(9999, prev + 1));
    } else {
      animateButton(decrementBtnRef as React.RefObject<HTMLButtonElement>);
      // Decrementar el contador (mínimo 0)
      setCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Configurar animaciones de hover para los botones
  useGSAP(() => {
    // Animación hover para botón decrementar
    if (decrementBtnRef.current) {
      const btn = decrementBtnRef.current;

      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.1,
          boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }

    // Animación hover para botón incrementar
    if (incrementBtnRef.current) {
      const btn = incrementBtnRef.current;

      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.1,
          boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }, []);

  return (
    // Contenedor principal con fondo oscuro y centrado
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans p-6">
      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-4xl font-bold mb-4 text-green-400">
        Contador Odómetro - Versión Simple
      </h1>

      {/* DESCRIPCIÓN EXPLICATIVA */}
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Cada dígito es un componente independiente que se anima cuando cambia su
        valor. Observa cómo solo los dígitos que cambian se animan.
      </p>

      {/* DISPLAY DEL ODÓMETRO - Aquí se muestran los 4 dígitos lado a lado */}
      <div className="flex gap-3 mb-8 p-4 bg-gray-800 rounded-xl">
        {/* Renderizar cada dígito como un componente separado */}
        {digits.map((digit, index) => (
          <OdometerDigit
            key={index} // Clave única para React
            value={digit} // El valor del dígito (0-9)
            position={index} // La posición del dígito (0=miles, 1=centenas, 2=decenas, 3=unidades)
          />
        ))}
      </div>

      {/* CONTROLES - Solo dos botones simples para incrementar/decrementar */}
      <div className="flex gap-4 mb-6">
        {/* Botón para decrementar (-1) */}
        <button
          ref={decrementBtnRef}
          onClick={() => handleClick("dec")}
          className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
        >
          - Decrementar
        </button>

        {/* Botón para incrementar (+1) */}
        <button
          ref={incrementBtnRef}
          onClick={() => handleClick("inc")}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
        >
          + Incrementar
        </button>
      </div>

      {/* INFORMACIÓN DEL VALOR ACTUAL */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">Valor actual:</p>
        <p className="text-3xl font-mono text-green-400">{count}</p>
      </div>

      {/* SECCIÓN EDUCATIVA - Explicación de cómo funciona el código */}
      <div className="mt-8 max-w-2xl text-center text-gray-300 text-sm">
        <h3 className="text-lg font-bold mb-2 text-white">¿Cómo funciona?</h3>

        {/* Paso 1: División en dígitos */}
        <p className="mb-2">
          1. El número se divide en dígitos individuales usando{" "}
          <code className="bg-gray-700 px-1 rounded">getDigits()</code>
        </p>

        {/* Paso 2: Componentes independientes */}
        <p className="mb-2">
          2. Cada dígito es un componente{" "}
          <code className="bg-gray-700 px-1 rounded">OdometerDigit</code>{" "}
          independiente
        </p>

        {/* Paso 3: Animación con GSAP */}
        <p>
          3. Cuando un dígito cambia, GSAP anima solo ese dígito con rotación 3D
        </p>
      </div>
    </div>
  );
}
