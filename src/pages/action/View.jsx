import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { showUser } from "../../_services/user";
import styles from "../../styles/Action.module.css";
import { formatedDateFull } from "../../_utilities/formatedDate";
import { showAsset } from "../../_services/asset";
import { showTransaction } from "../../_services/transaction";
import { showRepair } from "../../_services/repair";
import { showReport } from "../../_services/report";

import { viewObject as userObj } from "../../_utilities/action/userObject";
import { viewObject as assetObj } from "../../_utilities/action/assetObject";
import { viewObject as transactionObj } from "../../_utilities/action/transactionObject";
import { viewObject as repairObj } from "../../_utilities/action/repairObject";
import { viewObject as reportObj } from "../../_utilities/action/ReportObject";
import { FaArrowLeft } from "react-icons/fa6";

export default function View() {
  const { feature, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();
  const { action } = useParams();
  const { state } = useLocation();

  const { handleChangePath } = feature;

  const sections = state?.sections;

  const [data, setData] = useState(null);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;
    const { setIsLoading } = overlay;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const id = state?.id;

        const res =
          action === "users"
            ? await showUser(id)
            : action === "assets"
            ? await showAsset(id)
            : action === "transactions"
            ? await showTransaction(id)
            : action === "repairs"
            ? await showRepair(id)
            : action === "reports"
            ? showReport(id)
            : { data: { success: false, message: "Action empty" } };

        setData(res?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsFirstLoad(false);
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [action, state]);

  const handlePath = ({ path, id }) => {
    const obj =
      path === "users"
        ? userObj
        : path === "assets"
        ? assetObj
        : path === "transactions"
        ? transactionObj
        : path === "repairs"
        ? repairObj
        : path === "reports"
        ? reportObj
        : { data: { success: false, message: "Action empty" } };

    handleChangePath({
      path: `${path}/view`,
      data: { ...obj, id },
    });
  };

  return (
    <main className={styles.main}>
      {sections?.map((s, i) =>
        s?.type === "object" ? (
          <section key={i} className={styles.section}>
            <h2>{s?.title || s?.key}</h2>

            <div className={styles.objectContainer}>
              {s?.keys?.map((sk, i) => (
                <React.Fragment key={i}>
                  <span>{sk?.label}</span>
                  <span> : </span>
                  <span>
                    {!s?.key
                      ? sk?.type === "date"
                        ? formatedDateFull(data?.[sk?.key] || "SOON")
                        : data?.[sk?.key]
                      : data?.[s?.key]?.[sk?.key]}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </section>
        ) : (
          <section key={i} className={styles.section}>
            <h2>{s?.title || s?.key}</h2>

            <div className={styles.arrayContainer}>
              {data?.[s?.key]?.length == 0 && (
                <div key={i} className={styles.card} empty="true">
                  <div className={styles.divider}>
                    <span>{s?.key}</span>
                  </div>

                  <div className={styles.divider}>
                    <span>: No {s?.key} Found</span>
                  </div>
                </div>
              )}

              {data?.[s?.key]?.map((item, i) => (
                <div
                  key={i}
                  className={styles.card}
                  title={`Go to ${item?.[s?.keys[0]?.key]}`}
                  onClick={() =>
                    handlePath({ path: s?.key, id: item?.[s?.keys[0]?.key] })
                  }
                >
                  <div className={styles.divider}>
                    {s?.keys?.map((sk, i) => (
                      <React.Fragment key={i}>
                        <span>{sk?.label}</span>
                        <span>
                          {": "}
                          {sk?.type === "date"
                            ? formatedDateFull(item?.[sk?.key]) || "SOON"
                            : item?.[sk?.key]}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      )}

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>
    </main>
  );
}
