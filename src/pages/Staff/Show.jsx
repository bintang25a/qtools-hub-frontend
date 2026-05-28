import { useEffect, useState } from "react";
import styles from "../../styles/Staff.module.css";
import { Link, useOutletContext } from "react-router-dom";
import {
  MdCancel,
  MdCheckCircle,
  MdHourglassEmpty,
  MdSync,
} from "react-icons/md";
import DiagnosisItem from "../../components/items/DiagnosisItem";
import { updateQueue } from "../../_services/queues";
import { FaArrowLeft } from "react-icons/fa6";

export default function Show() {
  const { setIsLoading, setInfoModal, data, firstLoad, setStatus } =
    useOutletContext();

  const { complaintData: complaint, mechanicsData: mechanics } = data;

  const queue = complaint?.queue;

  const [formData, setFormData] = useState({
    status: "",
    mechanic_id: "",
  });

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

    if (complaint) {
      setFormData({
        status: queue?.status,
        mechanic_id: queue?.mechanic_id,
      });

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
  }, [complaint]);

  const colorStyles = () => {
    return {
      backgroundColor:
        queue?.status === "waiting"
          ? `var(--btn-warning)`
          : queue?.status === "process"
          ? `var(--btn-info)`
          : queue?.status === "done"
          ? `var(--btn-save)`
          : `var(--btn-danger)`,
      color: `var(--platinum-gray)`,
      borderColor: `unset`,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (stat) => {
    if (!formData?.mechanic_id) {
      return alert("Select Mechanic");
    }

    const data = {
      ...formData,
      status: stat,
      _method: "PUT",
    };

    try {
      setIsLoading(true);

      await updateQueue(complaint?.queue?.id, data);

      setStatus(stat);
    } catch (error) {
      console.log(error?.message);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Update data failed",
        message: error?.message,
      });
    }
  };

  return (
    <main className={styles.main}>
      <h1>
        {complaint?.complaint_number}

        <Link to={"/staff"}>
          <FaArrowLeft />
          Back
        </Link>
      </h1>

      <section className={styles.status}>
        <h2>Status</h2>
        <div className={styles.divider}>
          <span>Queue</span>
          <span>Status</span>
        </div>
        <div className={styles.divider}>
          <span>: {complaint?.queue?.queue_number}</span>
          <span>: {complaint?.queue?.status?.toUpperCase()}</span>
        </div>
      </section>

      <section className={styles.status}>
        <h2>Customer</h2>
        <div className={styles.divider}>
          <span>Name</span>
          <span>Username</span>
          <span>Phone Number</span>
          <span>Vehicle</span>
          <span>License Number</span>
        </div>
        <div className={styles.divider}>
          <span>: {complaint?.customer?.name}</span>
          <span>: {complaint?.customer?.id}</span>
          <span>: {complaint?.customer?.phone_number}</span>
          <span>: {complaint?.vehicle}</span>
          <span>: {complaint?.license_number}</span>
        </div>
      </section>

      {queue?.mechanic_id && (
        <section className={styles.status}>
          <h2>Mechanic</h2>
          <div className={styles.divider}>
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
          </div>
          <div className={styles.divider}>
            <span>: {queue?.mechanic_id}</span>
            <span>: {queue?.mechanic_name}</span>
            <span>: {queue?.mechanic_email}</span>
          </div>
        </section>
      )}

      <section className={styles.status}>
        <h2>Service</h2>
        <div className={styles.description}>
          Description: {complaint?.description}
        </div>
        <div className={styles.divider}>
          <span>Symptoms</span>
          {complaint?.symptoms?.map((s) => (
            <span key={s?.code}>
              [{s?.code}]-{s?.name}
            </span>
          ))}
        </div>
        <div className={styles.divider}>
          <span>Diagnosis Result</span>

          {complaint?.diagnosis?.map((d) => (
            <DiagnosisItem key={d?.code} d={d} styles={styles} />
          ))}
        </div>
      </section>

      <section className={styles.action}>
        <h2>Change Status</h2>
        <div className={styles.inputContainer}>
          <label htmlFor="mechanic_id">Select Mechanic</label>
          <select
            name="mechanic_id"
            id="mechanic_id"
            onChange={handleChange}
            value={formData?.mechanic_id}
          >
            <option value="">Select Mechanic</option>

            {mechanics?.map((m) => (
              <option key={m?.uid} value={m?.uid}>
                {m?.uid} - {m?.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className={styles.waitingColor}
          style={queue?.status === "waiting" ? colorStyles() : {}}
          onClick={() => handleSubmit("waiting")}
        >
          <MdHourglassEmpty size={30} /> Waiting
        </button>

        <button
          className={styles.processColor}
          style={queue?.status === "process" ? colorStyles() : {}}
          onClick={() => handleSubmit("process")}
        >
          <MdSync size={30} /> Process
        </button>
        <button
          className={styles.doneColor}
          style={queue?.status === "done" ? colorStyles() : {}}
          onClick={() => handleSubmit("done")}
        >
          <MdCheckCircle size={30} /> Done
        </button>
        <button
          className={styles.cancelColor}
          style={queue?.status === "cancel" ? colorStyles() : {}}
          onClick={() => handleSubmit("cancel")}
        >
          <MdCancel size={30} /> Cancel
        </button>
      </section>
    </main>
  );
}
