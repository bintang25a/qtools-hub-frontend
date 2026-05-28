import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdClose, MdLogout, MdMenu } from "react-icons/md";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Layout.module.css";
import { logout } from "../../_services/auth";
import NavbarUnsigned from "./NavbarUnsigned";
import NavbarSigned from "./NavbarSigned";
import NavbarAdmin from "./NavbarAdmin";
import { getPhoto } from "../../_services/files";

export default function Header({ setIsLoading, setRefresh, userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const localUser = localStorage.getItem("user");
      const parseUser = localUser ? JSON.parse(localUser) : {};

      if (!userData) {
        setUser(parseUser);
      } else {
        setUser(userData);
      }

      if (token) {
        setIsLogin(true);
      }

      setTimeout(() => setIsLoading(false), 5000);
    };

    fetchUser();

    // eslint-disable-next-line
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);

    await logout();

    setIsLogin(false);
    setIsOpen(false);
    navigate("/", { replace: true });

    setTimeout(() => setIsLoading(false), 250);
  };

  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 768);
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const path = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  const style = {
    header: `${styles.header} ${isScrolled ? styles.scrolled : ""}`,
    menuButton: styles.menuButton,
    profile: !isTablet ? styles?.profile : styles.profileOff,
    logo: styles.logo,
    photo: styles.photo,
    text: styles.text,
  };

  return (
    <header className={style.header}>
      <div className={style.logo}>
        <img src={logo} alt="Logo" />
        <h1>
          Auto<span>Mechanic</span>
        </h1>
      </div>

      {isTablet && (
        <button className={style.menuButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
      )}

      {!isLogin ? (
        <NavbarUnsigned isOpen={isOpen} />
      ) : !path?.pathname?.includes("admin") ? (
        <NavbarSigned
          isOpen={isOpen}
          isTablet={isTablet}
          user={user}
          handleLogout={handleLogout}
        />
      ) : (
        <NavbarAdmin handleLogout={handleLogout} setRefresh={setRefresh} />
      )}

      {user?.uid && (
        <div className={style.profile} onClick={() => setIsOpen(!isOpen)}>
          <button
            title="logout"
            onClick={handleLogout}
            style={{ display: isOpen ? "flex" : "none" }}
          >
            <MdLogout /> Logout
          </button>

          <div className={style.photo}>
            {user?.photo ? (
              <img src={getPhoto(user?.photo)} alt="Photo" />
            ) : (
              "Photo"
            )}
          </div>

          <div className={style.text}>
            <h2>{user?.name}</h2>
            <span>
              {user?.role?.toUpperCase()} {isTablet && user?.email}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
