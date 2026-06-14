import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import { formatedDateFull } from "../../_utilities/formatedDate";
import { viewObject } from "../../_utilities/actionObject/transactionObject";
import { FaDownload } from "react-icons/fa6";
import { inspectionDownload } from "../../_services/action";

export default function History() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading } = overlay;

  const { transactions: transactionsData, reports, inspections } = data;

  const [transactions, setTransactions] = useState(null);

  const newInspection = sessionStorage.getItem("newInspection") || "";

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

    if (transactionsData && inspections && reports) {
      const grouped = transactionsData?.reduce(
        (acc, t) => {
          if (!t?.returnAt) {
            acc.notReturned.push(t);
          } else {
            acc.returned.push(t);
          }

          return acc;
        },
        {
          returned: [],
          notReturned: [],
        }
      );

      setTransactions(grouped);

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
  }, [transactionsData, reports, inspections]);

  const handleDownloadExcel = async (inspectionId) => {
    try {
      const response = await inspectionDownload(inspectionId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Laporan_Inspeksi_${inspectionId}.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Gagal mendownload excel", error);
      alert("Terjadi kesalahan saat mengunduh file.");
    }
  };

  const handleToView = (to, id) => {
    navigate(`/view/${to}/${id}`, {
      state: { id, ...viewObject, action: "transactions" },
    });
  };

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Newest History</h1>
      </section>

      <section className={styles.history}>
        <h2>Unreturned Assets</h2>

        <div className={styles.container}>
          {transactions?.notReturned?.length === 0 && (
            <div className={styles.card} type="notReturned">
              <div className={styles.cardFooter}>
                <span>You already returning all assets</span>
              </div>
            </div>
          )}

          {transactions?.notReturned?.map((t) => (
            <div
              key={t?.transaction_id}
              onClick={() => handleToView("asset", t?.transaction_id)}
              className={styles.card}
              type="notReturned"
            >
              <div className={styles.cardHeader}>
                <h3>{t?.transaction_id}</h3>
              </div>

              <div className={styles.cardContent}>
                <div>
                  <span>Description</span>
                  <span>Asset ID</span>
                </div>
                <div>
                  <span>: {t?.loan_needs}</span>
                  <span>: {t?.asset_id}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span title="Loan At">{formatedDateFull(t?.loanAt)}</span>
                <span title="Return At">
                  {formatedDateFull(t?.returnAt) || "Not Returned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.history}>
        <h2>Returned Assets</h2>

        <div className={styles.container}>
          {transactions?.returned?.length === 0 && (
            <div className={styles.card} type="returned">
              <div className={styles.cardFooter}>
                <span>You dont make any loan</span>
              </div>
            </div>
          )}

          {transactions?.returned?.map((t) => (
            <div
              key={t?.transaction_id}
              onClick={() => handleToView("asset", t?.transaction_id)}
              className={styles.card}
              type="returned"
            >
              <div className={styles.cardHeader}>
                <h3>{t?.transaction_id}</h3>
              </div>

              <div className={styles.cardContent}>
                <div>
                  <span>Description</span>
                  <span>Asset ID</span>
                </div>
                <div>
                  <span>: {t?.loan_needs}</span>
                  <span>: {t?.asset_id}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span title="Loan At">{formatedDateFull(t?.loanAt)}</span>
                <span title="Return At">{formatedDateFull(t?.returnAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.history}>
        <h2>Reported Assets</h2>

        <div className={styles.container}>
          {reports?.length === 0 && (
            <div className={styles.card} type="report">
              <div className={styles.cardFooter}>
                <span>You dont make any loan</span>
              </div>
            </div>
          )}

          {reports?.map((r) => (
            <div
              key={r?.report_id}
              onClick={() => handleToView("report", r?.report_id)}
              className={styles.card}
              type="report"
            >
              <div className={styles.cardHeader}>
                <h3>Reporter ID: {r?.reporter_id}</h3>
              </div>

              <div className={styles.cardContent}>
                <div>
                  <span>Description</span>
                  <span>Asset ID</span>
                </div>
                <div>
                  <span>: {r?.description}</span>
                  <span>: {r?.asset_id}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span>{formatedDateFull(r?.createdAt)}</span>
                <span>Follow Up: {r?.follow_up?.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.history}>
        <h2>Inspection Tool Box</h2>

        <div className={styles.container}>
          {inspections?.length === 0 && (
            <div className={styles.card} type="inspection">
              <div className={styles.cardFooter}>
                <span>You dont make any loan</span>
              </div>
            </div>
          )}

          {inspections?.map((ins) => (
            <div
              key={ins?.inspection_id}
              onClick={() => handleDownloadExcel(ins?.inspection_id)}
              className={styles.card}
              type="inspection"
              title={`Download Excel ${ins?.inspection_id}`}
            >
              <div className={styles.cardHeader}>
                <h3>Inspection ID: {ins?.inspection_id}</h3>
              </div>

              <div className={styles.cardContent}>
                <div>
                  <span>Inspector ID</span>
                  <span>Asset ID</span>
                  <span>Total Tools</span>
                </div>
                <div>
                  <span>: {ins?.user_id}</span>
                  <span>: {ins?.asset_id}</span>
                  <span>: {ins?.tools?.length}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span>{formatedDateFull(ins?.createdAt)}</span>
                <span>
                  Click To Download <FaDownload />
                </span>
              </div>

              {newInspection == ins?.inspection_id && (
                <span className={styles.newBadge}>New!!!</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
