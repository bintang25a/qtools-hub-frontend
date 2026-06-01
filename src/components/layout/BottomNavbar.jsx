import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Layout.module.css";
import {
  FaBoxesPacking,
  FaClipboardCheck,
  FaClockRotateLeft,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.bottomNavbar}>
      <button onClick={() => navigate("/asset-loan")} title="Asset Loan">
        <FaBoxesPacking />
        {location.pathname === "/asset-loan" && <span>Asset Loan</span>}
      </button>

      <button onClick={() => navigate("/asset-return")} title="Asset Return">
        <FaClipboardCheck />
        {location.pathname === "/asset-return" && <span>Asset Return</span>}
      </button>

      <button onClick={() => navigate("history")} title="History">
        <FaClockRotateLeft />
        {location.pathname === "/history" && <span>History</span>}
      </button>

      <button onClick={() => navigate("/")} title="Profile">
        <FaUser />
        {location.pathname === "/" && <span>Profile</span>}
      </button>

      <button className={styles.logoutBtn} title="Logout">
        <FaRightFromBracket />
      </button>
    </nav>
  );
}
