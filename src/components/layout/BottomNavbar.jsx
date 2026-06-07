import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Layout.module.css";
import {
  FaBoxesPacking,
  FaClipboardCheck,
  FaClockRotateLeft,
  FaFileCircleExclamation,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { logout } from "../../_services/auth";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

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

      <button onClick={() => navigate("/asset-report")} title="Asset Return">
        <FaFileCircleExclamation />
        {location.pathname === "/asset-report" && <span>Laporkan</span>}
      </button>

      <button onClick={() => navigate("/")} title="History">
        <FaClockRotateLeft />
        {location.pathname === "/" && <span>History</span>}
      </button>

      <button
        className={styles.logoutBtn}
        title="Logout"
        onClick={handleLogout}
      >
        <FaRightFromBracket />
      </button>
    </nav>
  );
}
