import { Link } from "react-router-dom";
import styles from "../../styles/Layout.module.css";
import {
  FaLayerGroup,
  FaHouseChimney,
  FaDatabase,
  FaLock,
} from "react-icons/fa6";

export default function Sidebar() {
  return (
    <aside className={styles.aside}>
      <div className={styles.navContainer}>
        <h2>
          <FaHouseChimney /> Dashboard
        </h2>

        <ul>
          <li>
            <Link to={"/admin"}>Data Count</Link>
          </li>
          <li>
            <Link to={"/admin"}>Queue History</Link>
          </li>
          <li>
            <Link to={"/admin"}>Current Queue</Link>
          </li>
          <li>
            <Link to={"/admin"}>Mechanics</Link>
          </li>
        </ul>
      </div>

      <div className={styles.navContainer}>
        <h2>
          <FaDatabase /> Database
        </h2>

        <ul>
          <li>
            <Link to={"/admin/users"}>User</Link>
          </li>
          <li>
            <Link to={"/admin/complaints"}>Complaint</Link>
          </li>
          <li>
            <Link to={"/admin/symptoms"}>Symptom</Link>
          </li>
          <li>
            <Link to={"/admin/damages"}>Damage</Link>
          </li>
          <li>
            <Link to={"/admin/rules"}>Rule</Link>
          </li>
        </ul>
      </div>
      <div className={styles.navContainer}>
        <h2>
          <FaLayerGroup /> Pages
        </h2>

        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/service"}>Service Application</Link>
          </li>
          <li>
            <Link to={"/service/status"}>Service Status</Link>
          </li>
          <li>
            <Link to={"/service/history"}>Service History</Link>
          </li>
          <li>
            <Link to={"/service/diagnosis"}>Diagnosis</Link>
          </li>
        </ul>
      </div>
      <div className={styles.navContainer}>
        <h2>
          <FaLock /> Authentication
        </h2>

        <ul>
          <li>
            <Link to={"/profile"} target="_blank">
              Profile
            </Link>
          </li>
          <li>
            <Link to={"/profile"} target="_blank">
              Change Password
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
