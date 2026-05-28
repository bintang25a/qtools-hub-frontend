import { MdThumbUp, MdInfo, MdWarning } from "react-icons/md";
import styles from "../../styles/Component.module.css";

const InfoModal = ({ isOpen, isError, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles?.infoModal}`}>
        <div className={`icon-header ${isError && "error"}`}>
          {isError ? <MdWarning size={40} /> : <MdInfo size={40} />}
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <button onClick={onClose}>
          <MdThumbUp size={20} />
          <span>Okay, close</span>
        </button>
      </div>
    </div>
  );
};

export default InfoModal;
