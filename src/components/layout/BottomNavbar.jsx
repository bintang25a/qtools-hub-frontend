import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Layout.module.css";
import {
  FaBoxesPacking,
  FaClipboardCheck,
  FaClockRotateLeft,
  FaFileCircleExclamation,
  FaRightFromBracket,
  FaToolbox,
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
        <FaBoxesPacking className={styles.icon} />
        {location.pathname === "/asset-loan" && <span>Peminjaman</span>}
      </button>

      <button onClick={() => navigate("/asset-return")} title="Asset Return">
        <FaClipboardCheck className={styles.icon} />
        {location.pathname === "/asset-return" && <span>Pengembalian</span>}
      </button>

      <button onClick={() => navigate("/asset-report")} title="Asset Return">
        <FaFileCircleExclamation className={styles.icon} />
        {location.pathname === "/asset-report" && <span>Laporkan</span>}
      </button>

      <button
        onClick={() => navigate("/toolbox-inspection")}
        title="Toolbox Inspection"
      >
        <FaToolbox className={styles.icon} />
        {location.pathname === "/toolbox-inspection" && <span>Inspection</span>}
      </button>

      <button onClick={() => navigate("/")} title="History">
        <FaClockRotateLeft className={styles.icon} />
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
