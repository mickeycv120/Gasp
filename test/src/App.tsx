import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: -30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1,
      }
    );
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 bg-blue-500">
        <ul className="flex gap-2 items-center justify-center py-2">
          <li>
            <a href="#">Link 1</a>
          </li>
          <li>
            <a href="#">Link 2</a>
          </li>
          <li>
            <a href="#">Link 3</a>
          </li>
        </ul>
      </nav>
      {/* ...aquí va el resto del contenido... */}
    </>
  );
}

export default App;
