import { useEffect } from "react";
import {
  MdCancel,
  MdCheckCircle,
  MdHourglassEmpty,
  MdSync,
} from "react-icons/md";
import styles from "../../styles/Staff.module.css";
import { useOutletContext, Link } from "react-router-dom";
import { FaCalendarDays, FaMotorcycle } from "react-icons/fa6";

export default function DashboardStaff() {
  const { setIsLoading, data, firstLoad, setStatus, status } =
    useOutletContext();

  const { queuesData: queues } = data;

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

    if (queues) {
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
  }, [queues]);

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

  const colorStyles = () => {
    return {
      backgroundColor:
        status === "waiting"
          ? `var(--btn-warning)`
          : status === "process"
          ? `var(--btn-info)`
          : status === "done"
          ? `var(--btn-save)`
          : `var(--btn-danger)`,
      color: `var(--platinum-gray)`,
      borderColor: `unset`,
    };
  };

  const handleChangeStatus = (stat) => {
    setIsLoading(true);
    setStatus(stat);
  };

  return (
    <main className={styles.main}>
      <h1>Staff Dashboard</h1>

      <section className={styles.action}>
        <button
          className={styles.waitingColor}
          style={status === "waiting" ? colorStyles() : {}}
          onClick={() => handleChangeStatus("waiting")}
        >
          <MdHourglassEmpty size={30} /> Waiting
        </button>

        <button
          className={styles.processColor}
          style={status === "process" ? colorStyles() : {}}
          onClick={() => handleChangeStatus("process")}
        >
          <MdSync size={30} /> Process
        </button>
        <button
          className={styles.doneColor}
          style={status === "done" ? colorStyles() : {}}
          onClick={() => handleChangeStatus("done")}
        >
          <MdCheckCircle size={30} /> Done
        </button>
        <button
          className={styles.cancelColor}
          style={status === "cancel" ? colorStyles() : {}}
          onClick={() => handleChangeStatus("cancel")}
        >
          <MdCancel size={30} /> Cancel
        </button>
      </section>

      <section className={styles.queue}>
        <h2>
          {queues?.length}
          {status === "waiting"
            ? " Queues"
            : status === "process"
            ? " On Working"
            : " History"}
        </h2>

        <div className={styles.container}>
          {queues?.length == 0 && (
            <div className={styles.card}>
              <div className={`${styles.icon} ${styles.cancelColor}`}>
                <MdCancel size={40} />
              </div>
              <div className={styles.info}>
                <h3>No Queue History</h3>
                <span className={styles.cancelColor}>Status: Nothing</span>
                <span>
                  <FaCalendarDays /> {formatedDate(new Date())}
                </span>
              </div>
            </div>
          )}

          {queues?.map((q) => (
            <Link
              to={q?.complaint?.complaint_number}
              key={q?.id}
              className={styles.card}
            >
              <div className={`${styles.icon} ${colorClass(q?.status)}`}>
                {q?.status === "waiting" ? (
                  <MdHourglassEmpty size={40} />
                ) : q?.status === "process" ? (
                  <MdSync size={40} />
                ) : q?.status === "done" ? (
                  <MdCheckCircle size={40} />
                ) : (
                  <MdCancel size={40} />
                )}
              </div>
              <div className={styles.info}>
                <h3>Number: {q?.complaint?.complaint_number}</h3>
                <span className={colorClass(q?.status)}>
                  Status: {q?.status}
                </span>
                <span>
                  <FaMotorcycle /> {q?.complaint?.vehicle}
                </span>
                <span>
                  <FaCalendarDays /> {formatedDate(q?.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
