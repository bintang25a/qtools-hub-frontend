import { useEffect, useRef, useState } from "react";

const DiagnosisItem = ({ d, styles }) => {
  const spanRef = useRef(null);
  const barRef = useRef(null);
  const [isBarLonger, setIsBarLonger] = useState(false);

  useEffect(() => {
    if (spanRef.current && barRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      const barWidth = barRef.current.offsetWidth;

      if (barWidth > spanWidth) {
        setIsBarLonger(true);
      } else {
        setIsBarLonger(false);
      }
    }
  }, [d?.rate]);

  return (
    <div className={styles.progressContainer}>
      <span
        ref={spanRef}
        style={{
          color: isBarLonger ? "var(--platinum-gray)" : "var(--midnight-blue)",
        }}
      >
        [{d?.code}]-{d?.name} [{d?.rate}]
      </span>

      <div
        ref={barRef}
        className={styles.progressBar}
        style={{ width: d?.rate }}
      ></div>
    </div>
  );
};

export default DiagnosisItem;
