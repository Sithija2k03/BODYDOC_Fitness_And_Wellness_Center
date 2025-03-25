import { useState, useEffect } from "react";

export const useWindowSize = () => {
   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

   useEffect(() => {
       const updateSize = () => {
           setSize([window.innerWidth, window.innerHeight]);
       };

       window.addEventListener("resize", updateSize);
       updateSize(); // Call once to set initial size

       return () => window.removeEventListener("resize", updateSize);
   }, []);

   return {
       width: size[0],
       height: size[1],
   };
};
