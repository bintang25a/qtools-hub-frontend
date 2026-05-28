import { MdLogin, MdPersonAddAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "../../styles/Layout.module.css";

export default function NavbarUnsigned({ isOpen }) {
  const style = {
    navbar: `${styles.navbar} ${isOpen && "open"}`,
  };

  return (
    <nav className={style.navbar}>
      <Link to={"/login"}>
        <MdLogin />
        Login
      </Link>
      <Link to={"/register"}>
        <MdPersonAddAlt />
        Register
      </Link>
    </nav>
  );
}
