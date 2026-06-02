import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styles from "../../styles/Component.module.css";

const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const startScanner = async () => {
      try {
        scannerRef.current = new Html5Qrcode("qr-reader");

        await scannerRef.current.start(
          {
            facingMode: "environment",
          },
          {
            fps: 30,
            qrbox: {
              width: 250,
              height: 250,
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          () => {
            // Abaikan error scan per-frame
          }
        );
      } catch (err) {
        console.error("Scanner Error:", err);
      }
    };

    startScanner();

    return () => {
      const stopScanner = async () => {
        try {
          if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
          }
        } catch (err) {
          console.error("Stop Scanner Error:", err);
        }
      };

      stopScanner();
    };
  }, [isOpen, onScanSuccess]);

  const handleClose = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (err) {
      console.error(err);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles.cameraModal}`}>
        <h3>Scan QR Code</h3>

        <div id="qr-reader" className={styles.camera} />

        <button onClick={handleClose}>Close Camera</button>
      </div>
    </div>
  );
};

export default QrScannerModal;
