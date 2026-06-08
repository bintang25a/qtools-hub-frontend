import { FaArrowLeft, FaArrowRight, FaPaperPlane } from "react-icons/fa6";
import styles from "../../styles/User.module.css";

export default function PageButton({ page, setPage, isNext }) {
  return (
    <div className={styles.actionContainer}>
      <button
        type="button"
        disabled={page == 1}
        onClick={() => setPage(page - 1)}
      >
        <FaArrowLeft /> prev
      </button>
      {isNext !== "lastPage" ? (
        <button
          type="button"
          disabled={isNext}
          onClick={() => setPage(page + 1)}
        >
          next <FaArrowRight />
        </button>
      ) : (
        <button style={{ backgroundColor: "var(--btn-save)" }} type="submit">
          Send <FaPaperPlane />
        </button>
      )}
    </div>
  );
}
