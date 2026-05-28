import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaIdCard,
  FaLock,
  FaRightFromBracket,
  FaUpload,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa6";
import { register } from "../../_services/auth";
import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Auth.module.css";
import InfoModal from "../../components/overlay/InfoModal";
import LoadingJump from "../../components/overlay/JumpLoading";

export default function Register() {
  const navigate = useNavigate();

  const form = {
    uid: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPass: "",
    photo: "",
  };

  const [formData, setFormData] = useState(form);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
  });

  const closeModal = () => {
    if (!modal?.isError) {
      navigate("/login", { replace: true });
    }

    setModal({ isOpen: false, title: "", message: "" });
  };

  const handleChange = (e) => {
    const { value, name, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];

      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPass) {
      setIsLoading(false);

      setModal({
        isOpen: true,
        isError: true,
        title: "Password not match",
        message: "Please input the same value in password",
      });

      return;
    }

    const payload = new FormData();

    payload.append("uid", formData.uid);
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone_number", formData.phone_number);
    payload.append("password", formData.password);
    payload.append("role", "customer");

    if (formData.photo) {
      payload.append("photo", formData.photo);
    }

    try {
      const response = await register(payload);

      setModal({
        isOpen: true,
        title: response?.data?.message,
        message: "Please check your email to verify account",
      });
    } catch (error) {
      console.error(error?.response?.message);

      setModal({
        isOpen: true,
        isError: true,
        title: "Register failed",
        message: error.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 250);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.authContainer}>
          <header>
            <div className={styles.logo}>
              <img src={logo} alt="Logo" />
              <h1>
                Auto<span>Mechanic</span>
              </h1>
            </div>
            <h2>Register</h2>
          </header>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.formContainer}>
              <div className={styles.inputContainer}>
                <label htmlFor="photo">
                  {formData?.photoPreview ? (
                    <img
                      src={formData?.photoPreview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <>
                      <FaUpload /> Upload Photo (optional)
                    </>
                  )}
                </label>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  name="photo"
                  id="photo"
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="uid"
                  id="uid"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.uid}
                />
                <label htmlFor="uid">
                  <FaUser /> Username
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.name}
                  autoComplete="new-password"
                />
                <label htmlFor="name">
                  <FaIdCard /> Full Name
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.email}
                />
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="numeric"
                  name="phone_number"
                  id="phone_number"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.phone_number}
                />
                <label htmlFor="phone_number">
                  <FaWhatsapp /> Whatsapp Number
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.password}
                  autoComplete="new-password"
                />
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="password"
                  name="confirmPass"
                  id="confirmPass"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.confirmPass}
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPass">
                  <FaLock /> Confirm Password
                </label>
              </div>

              <button type="submit">
                Sign Up <FaRightFromBracket />
              </button>
            </div>
          </form>

          <span>
            Already have account? <Link to="/login">Login</Link>
          </span>

          <Footer />
        </div>
      </main>
      <InteractiveBackground />
      <InfoModal
        isOpen={modal?.isOpen}
        isError={modal?.isError}
        onClose={closeModal}
        title={modal?.title}
        message={modal?.message}
      />
      {isLoading && <LoadingJump />}
    </>
  );
}
