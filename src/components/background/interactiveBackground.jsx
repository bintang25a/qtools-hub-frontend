import React, { useState, useEffect } from "react";
import logo from "/images/logo/logo-nobg.png";

const DynamicTechnoGrid = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
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
    backgroundColor: "var(--soft)",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const gridOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: "0.25",
    backgroundImage: `
      linear-gradient(var(--thirdnary) 1px, transparent 1px),
      linear-gradient(90deg, var(--thirdnary) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px",
    maskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 5%, transparent 60%)`,
    WebkitMaskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 5%, transparent 60%)`,
    backgroundColor: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, var(--primary) 0%, var(--secondary) 100%)`,
  };

  const pistonStyle = {
    width: "350px",
    height: "auto",
    opacity: "0.6",
    pointerEvents: "none",
    zIndex: 1,
    filter: `drop-shadow(0 0 8px var(--primary))`,
  };

  return (
    <div style={bgStyle}>
      <div style={gridOverlayStyle} />
      <img src={logo} alt="Piston Logo" style={pistonStyle} />
    </div>
  );
};

export default DynamicTechnoGrid;
