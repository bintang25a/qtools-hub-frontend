import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import styles from "../../styles/Planner.module.css";
import {
  HiOutlineBriefcase,
  HiOutlineArrowCircleUp,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data, firstLoad, overlay } = useOutletContext();

  const { setIsLoading } = overlay;
  const { assets, reports } = data;

  const [totalAssets, setTotalAssets] = useState(0);
  const [borrows, setBorrows] = useState(0);
  const [repairs, setRepairs] = useState(0);

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

    if (assets && reports) {
      setTotalAssets(assets?.length);
      setRepairs(assets?.filter((a) => a?.status === "RP"));
      setBorrows(assets?.filter((a) => a?.status === "NA"));

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
  }, [assets, reports]);

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Dashboard</h1>
      </section>

      <section className={styles.panelContainer}>
        <div className={styles.panelCard}>
          <div className={styles.detail}>
            <h2>{totalAssets}</h2>
            <span>Total Assets & Tools</span>
          </div>

          <div className={styles.icon}>
            <HiOutlineBriefcase />
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.detail}>
            <h2>{borrows?.length}</h2>
            <span>Total Borrow</span>
          </div>

          <div className={styles.icon}>
            <HiOutlineArrowCircleUp />
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.detail}>
            <h2>{repairs?.length}</h2>
            <span>Total Repair</span>
          </div>

          <div className={styles.icon}>
            <HiOutlineWrenchScrewdriver />
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.detail}>
            <h2>{reports?.length}</h2>
            <span>Total Report</span>
          </div>

          <div className={styles.icon}>
            <HiOutlineDocumentReport />
          </div>
        </div>
      </section>
    </main>
  );
}
