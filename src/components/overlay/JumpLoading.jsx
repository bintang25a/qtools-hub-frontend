import React from "react";
import styles from "../../styles/Component.module.css";

const LoadingJump = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className="loader-container">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>

        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingJump;
