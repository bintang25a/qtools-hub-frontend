import profile from "/images/profile/profile.webp";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Layout.module.css";
import {
  MdImage,
  MdLogout,
  MdNotifications,
  MdNotificationsActive,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../_services/auth";
import FormModal from "../overlay/FormModal";
import { updateUser } from "../../_services/user";

export default function UserHeader({ user, hasNotifications }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [formModal, setFormModal] = useState({
    isOpen: false,
    data: user,
    fields: [
      {
        name: "photo",
        label: "Change Photo",
        type: "file",
      },
    ],
  });

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
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

  const handleOpen = () => {
    setProfileOpen(false);
    setFormModal({ ...formModal, isOpen: true });
  };

  const handleClose = () => {
    setFormModal({ ...formModal, isOpen: false });
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      const newFormData = {
        ...user,
        ...formData,
      };

      console.log(newFormData);

      Object.keys(newFormData).forEach((key) => {
        if (newFormData[key] !== undefined && newFormData[key] !== null) {
          payload.append(key, newFormData[key]);
        }
      });

      await updateUser(user?.nrp, payload);

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
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
          <button onClick={handleOpen}>
            <MdImage /> Change Photo
          </button>
          <Link to={"notifications"}>
            <MdNotifications /> Notification
          </Link>
          <button onClick={handleLogout}>
            <MdLogout /> Logout
          </button>
        </div>
      )}

      {formModal?.isOpen && (
        <FormModal
          fields={formModal?.fields}
          data={formModal?.data}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </header>
  );
}
