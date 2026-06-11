import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import { formatedDateFull } from "../../_utilities/formatedDate";
import { viewObject } from "../../_utilities/actionObject/transactionObject";

export default function History() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading } = overlay;

  const { transactions: transactionsData, reports } = data;

  const [transactions, setTransactions] = useState(null);

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

    if (transactionsData) {
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
  }, [transactionsData, reports]);

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
    </main>
  );
}
