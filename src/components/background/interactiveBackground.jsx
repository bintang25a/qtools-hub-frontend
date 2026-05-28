import React, { useState, useEffect } from "react";
import logo from "/images/logo/logo-nobg.png";

const InteractiveBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const bgStyle = {
    minHeight: "100vh",
    width: "100%",
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: "-1",
    backgroundColor: "var(--midnight-blue)",
    backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%,var(--steel-blue) 10%, var(--midnight-blue) 90%)`,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background 0.1s ease-out",
  };

  const pistonStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "auto",
    opacity: "0.4",
    pointerEvents: "none",
    zIndex: 1,
  };

  return (
    <div style={bgStyle}>
      <img src={logo} alt="Piston Background" style={pistonStyle} />
    </div>
  );
};

export default InteractiveBackground;
