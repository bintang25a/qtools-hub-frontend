import { Link, useOutletContext } from "react-router-dom";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import {
  MdCancel,
  MdCheckCircle,
  MdHourglassEmpty,
  MdSync,
  MdVisibility,
} from "react-icons/md";
import { LuClipboardList, LuHistory, LuUsers, LuWrench } from "react-icons/lu";

export default function Dashboard() {
  const { data, firstLoad, setIsLoading } = useOutletContext();

  const { complaintsData: complaints, queueData: queue, usersData } = data;

  const mechanics = usersData
    ?.filter((u) => u?.role === "mechanic")
    .slice(0, 5);

  const customers = usersData?.filter((u) => u?.role === "customer");

  const onWork = complaints?.filter((c) => c?.queue?.statu === "process");

  const onWait = complaints?.filter((c) => c?.queue?.status === "waiting");

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;

    let conditionTimeout;

    if (complaints && mechanics && queue) {
      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 500);
    }

    const overlimitTimeout = setTimeout(() => {
      setIsFirstLoad(false);
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(conditionTimeout);
      clearTimeout(overlimitTimeout);
    };

    // eslint-disable-next-line
  }, [complaints, mechanics, queue]);

  const statusIcon = (stat) => {
    return stat === "waiting" ? (
      <MdHourglassEmpty />
    ) : stat === "process" ? (
      <MdSync />
    ) : stat === "done" ? (
      <MdCheckCircle />
    ) : (
      <MdCancel />
    );
  };

  const colorClass = (stat) => {
    return {
      backgroundColor:
        stat === "waiting"
          ? "var(--btn-warning)"
          : stat === "process"
          ? "var(--btn-info)"
          : stat === "done"
          ? "var(--btn-save)"
          : "var(--btn-danger)",
    };
  };

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [screenSize, setScreenSize] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = now.toLocaleDateString("id-ID", dateOptions);

      const formattedTime = now.toLocaleTimeString("id-ID", { hour12: false });

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    // B. MENDAPATKAN UKURAN LAYAR (Current Screen)
    const updateScreenSize = () => {
      setScreenSize(`${window.innerWidth} x ${window.innerHeight}`);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  return (
    <div className={styles.dashboard}>
      <section className={styles.information}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <LuUsers size={40} />
          </div>
          <div className={styles.text}>
            <span>TOTAL CUSTOMERS</span>
            <h2>
              {customers?.length} <span>users</span>
            </h2>
            <span>Total pelanggan terdaftar</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <LuClipboardList size={40} />
          </div>
          <div className={styles.text}>
            <span>QUEUES</span>
            <h2>
              {onWork?.length + onWait?.length} <span>vehicles</span>
            </h2>
            <span>Total antrian menunggu</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <LuWrench size={40} />
          </div>
          <div className={styles.text}>
            <span>ON WORKING</span>
            <h2>
              {onWork?.length} <span>vehicles</span>
            </h2>
            <span>Kendaraan yang sedang dikerjakan</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <LuHistory />
          </div>
          <div className={styles.text}>
            <span>HISTORY</span>
            <h2>
              {complaints?.length} <span>complaints</span>
            </h2>
            <span>Telah selesai dikerjakan</span>
          </div>
        </div>
      </section>

      <section className={styles.leftDiv}>
        <section className={styles.table}>
          <h2>
            <LuHistory /> Queue History
          </h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Queue</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {complaints?.map((c) => (
                <tr key={c?.complaint_number}>
                  <td>{c?.complaint_number}</td>
                  <td>{c?.queue?.queue_number}</td>
                  <td>
                    {c?.customer?.name} - {c?.customer?.uid}
                  </td>
                  <td>
                    {c?.vehicle} - {c?.license_number}
                  </td>
                  <td>
                    <button
                      style={colorClass(c?.queue?.status)}
                      title={c?.queue?.status?.toUpperCase()}
                    >
                      {statusIcon(c?.queue?.status)}
                    </button>
                  </td>
                  <td>
                    <Link
                      target="_blank"
                      to={`/service/status/${c?.complaint_number}`}
                    >
                      <MdVisibility />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.table}>
          <h2>
            <LuWrench /> Mechanics
          </h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {mechanics?.map((m) => (
                <tr key={m?.uid}>
                  <td>{m?.uid}</td>
                  <td>{m?.name}</td>
                  <td>{m?.email}</td>
                  <td>{m?.phone_number}</td>
                  <td>
                    <Link target="_blank" to={`/profile/${m?.uid}`}>
                      <MdVisibility />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>

      <section className={styles.rightDiv}>
        <section className={styles.panel}>
          <h2>Current Queue</h2>

          <div className={styles.queueCard}>
            <h3>{queue?.queue_number}</h3>
            <span>Status: {queue?.status}</span>
            <span>{queue?.mechanic?.name}</span>
          </div>

          <div className={styles.complaintCard}>
            <h3>{queue?.complaint?.complaint_number}</h3>
            <span>{queue?.complaint?.vehicle}</span>
            <span>{queue?.complaint?.license_number}</span>
          </div>
        </section>

        <section className={styles.panel}>
          <h2>Current Information</h2>
          <div className={styles.divider}>
            <span>Date</span>
            <span>Time</span>
            <span>Location</span>
            <span>Current Screen</span>
          </div>
          <div className={styles.divider}>
            <span>: {currentDate || "..."}</span>
            <span>: {currentTime || "00.00.00"}</span>
            <span>: {timezone || "Unknown"}</span>
            <span>: {screenSize || "0 x 0"}</span>
          </div>
        </section>
      </section>
    </div>
  );
}
