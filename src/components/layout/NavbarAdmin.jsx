import { Link } from "react-router-dom";
import { MdHome, MdLogout, MdRefresh } from "react-icons/md";
import styles from "../../styles/Layout.module.css";

export default function NavbarAdmin({ handleLogout, setRefresh }) {
  const style = {
    navbar: `${styles.navbar} ${styles.navAdmin}`,
    container: styles.container,
  };

  return (
    <nav className={style.navbar}>
      <div className={style.container}>
        <Link title="Dashboard" to={"/"}>
          <MdHome />
        </Link>
        <button title="Refresh" onClick={() => setRefresh((prev) => !prev)}>
          <MdRefresh />
        </button>
        <button title="Logout" onClick={handleLogout}>
          <MdLogout />
        </button>
      </div>
    </nav>
  );
}
