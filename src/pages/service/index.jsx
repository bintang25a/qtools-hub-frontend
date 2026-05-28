import {
  MdAnalytics,
  MdAssignmentAdd,
  MdCancel,
  MdCheckCircle,
  MdFactCheck,
  MdHourglassEmpty,
  MdPerson,
  MdRestore,
  MdSync,
} from "react-icons/md";
import styles from "../../styles/Service.module.css";
import { Link, useOutletContext } from "react-router-dom";
import { FaCalendarDays, FaMotorcycle } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function Service() {
  const { setIsLoading, data, firstLoad } = useOutletContext();

  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);

  useEffect(() => {
    const { setIsFirstLoad, isFirstLoad } = firstLoad;
    const { userData, currentQdata } = data;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    let complaintsData = [];

    if (userData?.role === "mechanic") {
      complaintsData = userData?.handled_complaints?.map((c) => ({
        ...c?.complaint,
        queue: {
          id: c?.id,
          status: c?.status,
          number: c?.queue_number,
        },
      }));
    } else {
      complaintsData = userData?.complaints;
    }

    const sortedData = [...(complaintsData || [])].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    localStorage.setItem("complaint_number", sortedData[0]?.complaint_number);

    setComplaints(sortedData);
    setCurrentQ(currentQdata);
    setUser(userData);

    let conditionTimeout;

    if (sortedData) {
      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 250);
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
  }, []);

  const formatedDate = (isoDate) => {
    const date = new Date(isoDate);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  const colorClass = (status) => {
    if (status === "waiting") {
      return styles.waitingColor;
    } else if (status === "process") {
      return styles.processColor;
    } else if (status === "done") {
      return styles.doneColor;
    } else {
      return styles.cancelColor;
    }
  };

  return (
    <main className={styles.main}>
      <h1>{user?.role !== "mechanic" ? "Service " : "Mechanic "}Dashboard</h1>
      <section className={styles.information}>
        <h2>{user?.name}</h2>
        <span>
          {user?.uid} || {user?.email}
        </span>
        <span>Member at: {formatedDate(user?.created_at)}</span>
        <span>
          {user?.role !== "mechanic"
            ? "Total Service: "
            : "Total Work Handle: "}
          {user?.complaints?.length || user?.handled_complaints?.length}
        </span>

        {complaints[0]?.queue?.status !== "done" &&
          complaints[0] &&
          user?.role !== "mechanic" && (
            <Link className={styles.status} to={"status"}>
              {complaints[0]?.queue?.number}: {complaints[0]?.queue?.status}
              {complaints[0]?.queue?.status === "waiting" ? (
                <MdHourglassEmpty size={25} />
              ) : complaints[0]?.queue?.status === "process" ? (
                <MdSync size={25} />
              ) : complaints[0]?.queue?.status === "cancel" ? (
                <MdCancel size={25} />
              ) : null}
            </Link>
          )}

        <Link className={styles.profile} to={"/profile"}>
          <MdPerson size={40} />
        </Link>
      </section>

      {currentQ && user?.role !== "mechanic" && (
        <section className={styles.currentQ}>
          <h2>Current Queue</h2>

          <span>{currentQ?.queue_number}</span>
          <span>Status: {currentQ?.status}</span>
          <span>
            Esitimate:{" "}
            {currentQ?.queue_number === complaints[0]?.queue?.number
              ? "soon"
              : "36 min"}
          </span>
        </section>
      )}

      <section className={styles.action}>
        {user?.role !== "mechanic" && (
          <>
            <Link to={"add"} className={styles.linkService}>
              <MdAssignmentAdd size={30} /> Service
            </Link>
            <Link to={"status"} className={styles.linkStatus}>
              <MdFactCheck size={30} /> Status
            </Link>
          </>
        )}

        <Link to={"diagnosis"} className={styles.linkDiagnosis}>
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link to={"history"} className={styles.linkHistory}>
          <MdRestore size={30} /> History
        </Link>
      </section>

      <section className={styles.history}>
        <h2>
          {user?.role !== "mechanic" ? "Recent History" : "Working History"}
        </h2>

        <div className={styles.container}>
          {complaints?.length == 0 && (
            <div className={styles.card}>
              <div className={`${styles.icon} ${styles.cancelColor}`}>
                <MdCancel size={40} />
              </div>
              <div className={styles.info}>
                <h3>No Recent History</h3>
                <span className={styles.cancelColor}>Status: Nothing</span>
                <span>
                  <FaCalendarDays /> {formatedDate(new Date())}
                </span>
              </div>
            </div>
          )}

          {complaints?.slice(0, 5)?.map((complaint) => (
            <Link
              to={`status/${complaint?.complaint_number}`}
              key={complaint?.complaint_number}
              className={styles.card}
            >
              <div
                className={`${styles.icon} ${colorClass(
                  complaint?.queue?.status
                )}`}
              >
                {complaint?.queue?.status === "waiting" ? (
                  <MdHourglassEmpty size={40} />
                ) : complaint?.queue?.status === "process" ? (
                  <MdSync size={40} />
                ) : complaint?.queue?.status === "done" ? (
                  <MdCheckCircle size={40} />
                ) : (
                  <MdCancel size={40} />
                )}
              </div>
              <div className={styles.info}>
                <h3>ID: {complaint?.complaint_number}</h3>
                <span className={colorClass(complaint?.queue?.status)}>
                  Status: {complaint?.queue?.status}
                </span>
                <span>
                  <FaMotorcycle /> {complaint?.vehicle}
                </span>
                <span>
                  <FaCalendarDays /> {formatedDate(complaint?.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
