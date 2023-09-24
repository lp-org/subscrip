import { useState, useEffect } from "react";
const MOBILE_BREAKPOINT = 768;
export function useMobileView() {
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    // Function to update the isMobileView state
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Add a listener for the window resize event
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobileView;
}
