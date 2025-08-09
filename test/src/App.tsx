/* import BlurText from "./TextAnimations/BlurText/BlurText";
import CircularText from "./TextAnimations/CircularText/CircularText";
import SplitText from "./TextAnimations/SplitText/SplitText"; */

import StarBorder from "./AnimationsReactBits/StarBorder/StarBorder";
import SimpleParallax from "simple-parallax-js";
import parallaxImg from "./assets/parallax.jpg";
import { useRef, useEffect } from "react";

function App() {
  // Ejemplo de uso de SplitText
  /* const handleAnimationComplete = () => {
    console.log("Animation completed!");
  }; */

  return (
    <div className="min-h-[300vh] bg-gradient-to-b from-blue-500 to-blue-900 flex flex-col items-center">
      {/* Sección superior */}
      <section className="h-[80vh] flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-white mb-8 mt-16 text-center drop-shadow-lg">
          Efecto Parallax Demo
        </h1>
        <p className="text-lg text-white/80 max-w-xl text-center mb-8">
          Desplázate hacia abajo para ver el efecto parallax en la imagen. El
          contenido adicional ayuda a apreciar el movimiento de la imagen al
          hacer scroll.
        </p>
        <div className="flex gap-4 mt-8">
          <StarBorder
            as="button"
            className="custom-class"
            color="yellow"
            speed="4s"
          >
            Arriba 1
          </StarBorder>
          <StarBorder
            as="button"
            className="custom-class"
            color="pink"
            speed="6s"
          >
            Arriba 2
          </StarBorder>
        </div>
      </section>

      {/* Imagen con parallax */}
      <section className="w-full flex justify-center my-24">
        <SimpleParallax>
          <img
            src={parallaxImg}
            alt="image"
            className="rounded-2xl shadow-2xl max-w-2xl w-full h-auto"
          />
        </SimpleParallax>
      </section>

      {/* Sección inferior */}
      <section className="h-[120vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-semibold text-white mt-16 mb-4">
          Contenido después de la imagen
        </h2>
        <p className="text-lg text-white/70 max-w-xl text-center mb-8">
          Sigue desplazándote para ver cómo la imagen se mueve a diferente
          velocidad que el resto del contenido, creando el efecto parallax.
        </p>
        <div className="flex gap-4 mt-8">
          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="5s"
          >
            ¡Botón con StarBorder!
          </StarBorder>
          <StarBorder
            as="button"
            className="custom-class"
            color="lime"
            speed="7s"
          >
            Otro botón
          </StarBorder>
        </div>
      </section>
    </div>
  );
}

export default App;
