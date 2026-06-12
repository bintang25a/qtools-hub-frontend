import profile from "/images/profile/profile.webp";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Layout.module.css";
import {
  MdLogout,
  MdMenu,
  MdNotifications,
  MdNotificationsActive,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../_services/auth";

export default function Header({ user, setSidebarOpen, hasNotifications }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <MdMenu />
      </button>

      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>

      <div className={styles.personal} onClick={toggleProfile}>
        {hasNotifications && (
          <button>
            <MdNotificationsActive />
          </button>
        )}

        <img src={user?.photo ? user?.photo_url : profile} alt="Logo" />
      </div>

      <div className={styles.personalDetail}>
        <h2>{user?.name}</h2>
        <span>
          {user?.nrp} | {user?.role?.toUpperCase()}
        </span>
      </div>

      {profileOpen && (
        <div className={styles.personalMenu}>
          <Link to={"notifications"}>
            <MdNotifications /> Notification
          </Link>
          <button onClick={handleLogout}>
            <MdLogout /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
