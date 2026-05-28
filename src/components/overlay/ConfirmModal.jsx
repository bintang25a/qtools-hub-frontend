import { MdCancel, MdCheck, MdDangerous, MdInfo } from "react-icons/md";
import styles from "../../styles/Component.module.css";

const ConfirmModal = ({ isOpen, onCancel, onSubmit, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles?.confirmModal}`}>
        <h2>
          <MdInfo size={40} /> {title}
        </h2>
        <span>{message}</span>

        <button onClick={onCancel}>
          <MdCancel />
        </button>

        <button onClick={onSubmit}>
          <MdCheck />
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
