import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Layout.module.css";
import profile from "/images/profile/profile.webp";
import { getPhoto } from "../../_services/files";
import { MdClose, MdLogout } from "react-icons/md";
import {
  FaClipboardList,
  FaClipboardQuestion,
  FaHouse,
  FaRegClipboard,
  FaUser,
  FaWrench,
} from "react-icons/fa6";
import { logout } from "../../_services/auth";

export default function Sidebar({ user, setSidebarOpen }) {
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

  const rolePath = {
    planner: "planner",
    "tool keeper": "toolkeeper",
    mechanic: "mechanic",
  };

  const styleCondition = (currentPath) => {
    const path = location.pathname;
    console.log(path);
    if (path === `${currentPath}${rolePath[user?.role]}`) {
      return {
        backgroundColor: `var(--secondary)`,
        color: `var(--white)`,
      };
    } else if (path === `/${rolePath[user?.role]}/${currentPath}`) {
      return {
        backgroundColor: `var(--secondary)`,
        color: `var(--white)`,
      };
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.personal}>
        <div className={styles.photo}>
          <img
            src={user?.photo ? getPhoto(user?.photo) : profile}
            alt="Photo"
          />
        </div>

        <div className={styles.profile}>
          <h2>{user?.name}</h2>
          <span>
            {user?.nrp} | {user?.role}
          </span>
        </div>
      </div>

      <div className={styles.navContainer}>
        <Link
          to={`/${rolePath[user?.role]}`}
          className={styles.navItem}
          style={styleCondition("/")}
        >
          <FaHouse /> <span>Dashboard</span>
        </Link>
        <Link
          to={`/${rolePath[user?.role]}/users`}
          className={styles.navItem}
          style={styleCondition("users")}
        >
          <FaUser /> <span>Users</span>
        </Link>
        <Link
          to={`/${rolePath[user?.role]}/assets`}
          className={styles.navItem}
          style={styleCondition("assets")}
        >
          <FaWrench /> <span>Assets & Tools</span>
        </Link>
        <Link
          to={`/${rolePath[user?.role]}/transactions`}
          className={styles.navItem}
          style={styleCondition("transactions")}
        >
          <FaClipboardList /> <span>Asset Loan</span>
        </Link>
        <Link
          to={`/${rolePath[user?.role]}/repairs`}
          className={styles.navItem}
          style={styleCondition("repairs")}
        >
          <FaRegClipboard /> <span>Repair</span>
        </Link>
        <Link
          to={`/${rolePath[user?.role]}/reports`}
          className={styles.navItem}
          style={styleCondition("reports")}
        >
          <FaClipboardQuestion /> <span>Report</span>
        </Link>
      </div>

      <button
        className={styles.logoutBtn}
        onClick={handleLogout}
        title="Logout"
      >
        <MdLogout /> Logout
      </button>

      <button
        className={styles.closeMenu}
        onClick={() => setSidebarOpen(false)}
        title="Close Sidebar"
      >
        <MdClose />
      </button>
    </aside>
  );
}
