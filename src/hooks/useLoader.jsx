import { useEffect } from "react";

export default function useLoader() {
    const hideLoader = () => {
        const loader = document.querySelectorAll('.loader');
        Array.from(loader).map((node) => node.classList.add("loader--hide"))
    };
    
    useEffect(() => {
        setTimeout(() => {
          hideLoader()
        }, 2500);
      }, []);
}
