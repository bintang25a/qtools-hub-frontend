import styles from "../../styles/Auth.module.css";
import InteractiveBackground from "../../components/background/DynamicTechnoGrid";
import JumpLoading from "../../components/overlay/JumpLoading";
import { login, me } from "../../_services/auth";
import { useEffect, useState } from "react";
import {
  FaDoorOpen,
  FaLock,
  FaPaperPlane,
  FaUnlock,
  FaUser,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isHide, setIsHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nrp: "",
    password: "",
  });

  useEffect(() => {
    const protectPath = async () => {
      setIsLoading(true);

      try {
        const { data } = await me();

        const convPath = {
          planner: "planner",
          "tool keeper": "toolkeeper",
        };

        const path = convPath[data?.role] ? convPath[data?.role] : "/";

        navigate(`/${path}`, { replace: true });
      } catch (error) {
        console.log(error);

        if (location.pathname === "/") {
          navigate("login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    protectPath();
    // eslint-disable-next-line
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(formData);

      const convPath = {
        planner: "planner",
        "tool keeper": "toolkeeper",
      };

      const path = convPath[res?.role] ? convPath[res?.role] : "/";

      navigate(`/${path}`, { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.authPage}>
        <div className={styles.box}>
          <h1>
            <FaDoorOpen /> Login
          </h1>
          <h2>Welcome to QTools Hub</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputForm}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  id="nrp"
                  name="nrp"
                  value={formData?.nrp}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <label htmlFor="nrp">Input NRP</label>

                <FaUser className={styles.inputIcon} />
              </div>

              <div className={styles.inputContainer}>
                <input
                  type={isHide ? "password" : "text"}
                  id="password"
                  name="password"
                  value={formData?.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <label htmlFor="password">Input Password</label>

                {isHide ? (
                  <FaLock
                    className={styles.inputIcon}
                    onClick={() => setIsHide(!isHide)}
                  />
                ) : (
                  <FaUnlock
                    className={styles.inputIcon}
                    onClick={() => setIsHide(!isHide)}
                  />
                )}
              </div>

              <button
                type="submit"
                className={styles.inputSubmit}
                disabled={isLoading}
              >
                Sign In <FaPaperPlane />
              </button>
            </div>
          </form>

          <p>
            &copy; 2026, Developer Team |<span>| QTools</span>
            <span> Hub</span>
          </p>
        </div>
      </div>

      <InteractiveBackground />
      {isLoading && <JumpLoading />}
    </>
  );
}
