import styles from "../../styles/Planner.module.css";
import {
  HiOutlineBriefcase,
  HiOutlineArrowCircleUp,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaPencil } from "react-icons/fa6";

export default function Dashboard() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { handleChangePath, handleChangePage } = feature;
  const { setIsLoading } = overlay;
  const { assets, reports } = data;

  const [totalAssets, setTotalAssets] = useState(0);
  const [borrows, setBorrows] = useState([]);
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);

      handleChangePage("default");
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

      <section rank="1" className={styles.data}>
        <h2>
          <HiOutlineArrowCircleUp /> Top 5 Borrow
        </h2>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Asset Number</th>
                <th>Location</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows?.length === 0 ? (
                <tr>
                  <td colSpan={4}>No Borrow Asset</td>
                </tr>
              ) : null}

              {borrows?.slice(0, 5)?.map((a) => (
                <tr key={a?.asset_number}>
                  <td>{a?.asset_number}</td>
                  <td>{a?.location}</td>
                  <td>{a?.description}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath("assets/view", a?.asset_number)
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() =>
                          handleChangePath("assets/edit", a?.asset_number)
                        }
                      >
                        <FaPencil />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section rank="2" className={styles.data}>
        <h2>
          <HiOutlineWrenchScrewdriver /> Top 5 Repair
        </h2>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Asset Number</th>
                <th>Location</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {repairs?.length === 0 ? (
                <tr>
                  <td colSpan={4}>No Repair Asset</td>
                </tr>
              ) : null}

              {repairs?.slice(0, 5)?.map((a) => (
                <tr key={a?.asset_number}>
                  <td>{a?.asset_number}</td>
                  <td>{a?.location}</td>
                  <td>{a?.description}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath("assets/view", a?.asset_number)
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() =>
                          handleChangePath("assets/edit", a?.asset_number)
                        }
                      >
                        <FaPencil />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section rank="3" className={styles.data}>
        <h2>
          <HiOutlineDocumentReport /> Top 5 Report
        </h2>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Description</th>
                <th>Reporter</th>
                <th>Asset</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports?.length === 0 ? (
                <tr>
                  <td colSpan={5}>No Report Asset</td>
                </tr>
              ) : null}

              {reports?.slice(0, 5)?.map((r) => (
                <tr key={r?.report_id}>
                  <td>{r?.report_id}</td>
                  <td>{r?.description}</td>
                  <td>
                    {r?.reporter_id}-{r?.reporter?.name}
                  </td>
                  <td>
                    {r?.asset_id}-{r?.asset?.description}
                  </td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath("reports/view", r?.report_id)
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() =>
                          handleChangePath("assets/edit", r?.report_id)
                        }
                      >
                        <FaPencil />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
