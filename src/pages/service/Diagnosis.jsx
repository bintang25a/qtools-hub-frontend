import { Link, useOutletContext } from "react-router-dom";
import styles from "../../styles/Service.module.css";
import { useEffect, useState } from "react";
import {
  MdAnalytics,
  MdAssignmentAdd,
  MdDashboard,
  MdFactCheck,
  MdRestore,
} from "react-icons/md";
import DiagnosisItem from "../../components/items/DiagnosisItem";

export default function Diagnosis() {
  const { setIsLoading, data, firstLoad } = useOutletContext();

  const {
    symptomsData: symptoms,
    damagesData: damages,
    rulesData: rules,
    userData,
  } = data;

  const pathRole = userData?.role === "mechanic" ? "mechanic" : "service";

  useEffect(() => {
    const { setIsFirstLoad, isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    const condition = Boolean(symptoms && damages && rules);

    let conditionTimeout;

    if (condition) {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectSymptoms, setSelectSymptoms] = useState([]);
  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSymptomsClick = (id) => {
    const symptom = selectSymptoms?.find((s) => s == id);

    if (symptom) {
      setSelectSymptoms(selectSymptoms?.filter((s) => s != id));
    } else {
      setSelectSymptoms([...selectSymptoms, id]);
    }
  };

  const calculateDiagnosis = () => {
    const userSymptomCodes = selectSymptoms;

    const diagnoses = damages
      .map((damage) => {
        const rulesInDamage = rules.filter(
          (r) => r.damage_code === damage.damage_code
        );

        const totalSymptomsInRule = rulesInDamage.length;

        const matchedSymptoms = rulesInDamage.filter((r) =>
          userSymptomCodes.includes(r.symptom_code)
        ).length;

        if (matchedSymptoms === 0) return null;

        const rate = (matchedSymptoms / totalSymptomsInRule) * 100;

        return {
          code: damage.damage_code,
          name: damage.name,
          rate: rate.toFixed(2) + "%",
          rawRate: rate,
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => b.rawRate - a.rawRate);

    return diagnoses;
  };

  const result = calculateDiagnosis();

  return (
    <main className={styles.main}>
      <h1>Self Diagnosis</h1>

      <section className={styles.apply}>
        <div className={styles.inputContainer}>
          <label>Select Symptoms</label>
          <input
            type="text"
            placeholder="Search Symptom"
            onChange={handleSearchChange}
          />

          <div className={styles.container}>
            {filteredSymptoms?.map((s) => (
              <button
                type="button"
                key={s?.symptom_code}
                onClick={() => handleSymptomsClick(s?.symptom_code)}
                className={
                  selectSymptoms?.some((sm) => sm == s?.symptom_code)
                    ? styles.selected
                    : null
                }
              >
                {s?.symptom_code}: {s?.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.apply}>
        <div className={styles.inputContainer}>
          <label>Diagnosis Result</label>
          <button>Damages</button>

          <div className={styles.container}>
            {result?.map((d) => (
              <DiagnosisItem key={d?.code} d={d} styles={styles} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.action}>
        <Link to={`/${pathRole}`} className={styles.linkApplication}>
          <MdDashboard size={30} /> App
        </Link>

        {userData?.role !== "mechanic" && (
          <>
            <Link to={"/service/add"} className={styles.linkService}>
              <MdAssignmentAdd size={30} /> Service
            </Link>
            <Link to={"/service/status"} className={styles.linkStatus}>
              <MdFactCheck size={30} /> Status
            </Link>
          </>
        )}

        <Link
          to={`/${pathRole}/diagnosis`}
          className={styles.linkDiagnosis}
          style={{
            backgroundColor: `var(--btn-info)`,
            color: `var(--platinum-gray)`,
          }}
        >
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link to={`/${pathRole}/history`} className={styles.linkHistory}>
          <MdRestore size={30} /> History
        </Link>
      </section>
    </main>
  );
}
