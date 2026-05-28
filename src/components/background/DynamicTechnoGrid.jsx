import React from "react";
import logo from "/images/logo/logo-nobg.png";

const DynamicTechnoGrid = () => {
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
    top: "-50%",
    left: "-50%",
    right: "-50%",
    bottom: "-50%",
    opacity: "0.1",
    backgroundImage: `
      linear-gradient(var(--thirdnary) 1px, transparent 1px),
      linear-gradient(90deg, var(--thirdnary) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px",
    animation: "moveGrid 60s linear infinite",
  };

  const pistonStyle = {
    width: "350px",
    height: "auto",
    opacity: "0.7",
    pointerEvents: "none",
    zIndex: 1,
    filter: `drop-shadow(0 0 10px var(--primary))`,
  };

  return (
    <div style={bgStyle}>
      <div style={gridOverlayStyle} />
      <img src={logo} alt="Piston Logo" style={pistonStyle} />

      <style>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 40px) scale(1.5); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DynamicTechnoGrid;
