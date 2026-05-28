import { useEffect } from "react";
import styles from "../../styles/Service.module.css";
import { Link, useOutletContext } from "react-router-dom";
import {
  MdAnalytics,
  MdAssignmentAdd,
  MdCheck,
  MdDashboard,
  MdFactCheck,
  MdRestore,
  MdSync,
} from "react-icons/md";
import DiagnosisItem from "../../components/items/DiagnosisItem";
import { FaArrowLeft } from "react-icons/fa6";
import { updateQueue } from "../../_services/queues";

export default function Status() {
  const { setIsLoading, data, firstLoad } = useOutletContext();

  const { complaintData: complaint, userData: user } = data;

  const queue = complaint?.queue;
  const pathRole = user?.role === "mechanic" ? "mechanic" : "service";

  useEffect(() => {
    const { setIsFirstLoad, isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    let complaintTimeout;

    if (complaint) {
      complaintTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 250);
    }

    const overlimitTimeout = setTimeout(() => {
      setIsFirstLoad(false);
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(complaintTimeout);
      clearTimeout(overlimitTimeout);
    };

    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (stat) => {
    setIsLoading(true);

    await updateQueue(complaint?.queue?.id, {
      mechanic_id: user?.uid,
      status: stat,
      _method: "PUT",
    });

    setIsLoading(false);
  };

  return (
    <main className={styles.main}>
      {!complaint?.complaint_number ? (
        <h1>
          No service found, Please make an apply first
          <Link to={"/service"}>
            <FaArrowLeft />
            Back
          </Link>
        </h1>
      ) : (
        <>
          <h1>
            {complaint?.complaint_number}

            <Link to={"/service"}>
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

          {user?.role === "mechanic" && (
            <section className={styles.action}>
              <h2>Change Status</h2>

              <Link
                className={styles.linkDiagnosis}
                onClick={() => handleSubmit("process")}
                style={
                  complaint?.queue?.status === "process"
                    ? {
                        backgroundColor: `var(--btn-info)`,
                        color: `var(--platinum-gray)`,
                      }
                    : {}
                }
              >
                <MdSync size={30} /> On Work
              </Link>
              <Link
                className={styles.linkStatus}
                onClick={() => handleSubmit("done")}
                style={
                  complaint?.queue?.status === "done"
                    ? {
                        backgroundColor: `var(--btn-save)`,
                        color: `var(--platinum-gray)`,
                      }
                    : {}
                }
              >
                <MdCheck size={30} /> Done
              </Link>
            </section>
          )}
        </>
      )}

      <section className={styles.action}>
        <Link to={`/${pathRole}`} className={styles.linkApplication}>
          <MdDashboard size={30} /> App
        </Link>

        {user?.role !== "mechanic" && (
          <>
            <Link to={"/service/add"} className={styles.linkService}>
              <MdAssignmentAdd size={30} /> Service
            </Link>
            <Link
              to={"/service/status"}
              className={styles.linkStatus}
              style={{
                backgroundColor: `var(--btn-save)`,
                color: `var(--platinum-gray)`,
              }}
            >
              <MdFactCheck size={30} /> Status
            </Link>
          </>
        )}

        <Link to={`/${pathRole}/diagnosis`} className={styles.linkDiagnosis}>
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link to={`/${pathRole}/history`} className={styles.linkHistory}>
          <MdRestore size={30} /> History
        </Link>
      </section>
    </main>
  );
}
