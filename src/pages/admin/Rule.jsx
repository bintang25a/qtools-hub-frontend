import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";
import { createRule, deleteRule } from "../../_services/rules";
import { showSymptom } from "../../_services/symptoms";
import { showDamage } from "../../_services/damages";
import styles from "../../styles/Admin.module.css";
import { MdAddBox } from "react-icons/md";

export default function Rule() {
  const { setIsLoading, setInfoModal, data, firstLoad } = useOutletContext();

  const { rulesData } = data;

  const [rules, setRules] = useState([]);
  const [search, setSearch] = useState("");
  const [rowCol, setRowCol] = useState({
    row: [],
    col: [],
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

    if (rulesData) {
      setRules(rulesData?.rules);

      setRowCol({
        row: [...(rulesData?.symptoms || [])].sort((a, b) => {
          return a?.symptom_code?.localeCompare(b?.symptom_code, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }),

        col: [...(rulesData?.damages || [])].sort((a, b) => {
          return a?.damage_code?.localeCompare(b?.damage_code, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }),
      });

      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 500);
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
  }, [rulesData]);

  const handleSearchChange = (e) => {
    const { value } = e.target;

    setSearch(value);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState({});

  const symptomFields = [
    {
      name: "symptom_code",
      label: "Symptom Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "damages",
      label: "Possible damages code",
      type: "text",
    },
  ];

  const damageFields = [
    {
      name: "damage_code",
      label: "Damage Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "symptoms",
      label: "Symptoms code possible",
      type: "text",
    },
  ];

  const handleAddRule = () => {
    setViewModal({
      isView: false,
      fields: [
        {
          name: "symptom_code",
          label: "Select Symptoms",
          type: "select",
          options:
            rowCol?.row?.map((symptom) => ({
              name: symptom?.name,
              value: symptom?.symptom_code,
            })) || [],
        },
        {
          name: "damage_code",
          label: "Select Damages",
          type: "select",
          options:
            rowCol?.col?.map((damage) => ({
              name: damage?.name,
              value: damage?.damage_code,
            })) || [],
        },
      ],
    });

    setModalOpen(true);
  };

  const handleFetchData = async (id, isDamage) => {
    setIsLoading(true);

    try {
      const response = isDamage ? await showDamage(id) : await showSymptom(id);
      const data = response?.data;
      const symptomsData = response?.data?.symptoms;
      const damagesData = response?.data?.damages;

      setViewModal({
        isView: true,
        fields: isDamage ? damageFields : symptomFields,
        data: isDamage
          ? {
              ...data,
              symptoms: symptomsData?.map((d) => d.symptom_code).join(", "),
            }
          : {
              ...data,
              damages: damagesData?.map((d) => d.damage_code).join(", "),
            },
      });
    } catch (error) {
      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Get data failed",
        message: error?.message,
      });
    } finally {
      setIsLoading(false);
    }

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const isMatching = (sCode, dCode) => {
    const exist = rules?.some(
      (rule) => rule?.symptom_code === sCode && rule?.damage_code === dCode
    );

    return exist ? "X" : "";
  };

  const handleToggleRule = async (sCode, dCode) => {
    const rule = rules?.find(
      (rule) => rule?.symptom_code === sCode && rule?.damage_code === dCode
    );

    try {
      if (rule) {
        await deleteRule(rule?.id);

        setRules(rules?.filter((r) => r?.id !== rule?.id));
      } else {
        const response = await createRule({
          symptom_code: sCode,
          damage_code: dCode,
        });

        setRules([
          ...rules,
          { id: response?.data?.id, symptom_code: sCode, damage_code: dCode },
        ]);
      }
    } catch (error) {
      console.error(error?.response?.message);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Create data failed",
        message: error?.message,
      });
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2>Rules Data</h2>

        <div className={styles.search}>
          <select disabled>
            <option value="">Click Damage/Symptom Code to see detail</option>
          </select>

          <input
            type="text"
            name="value"
            id="value"
            placeholder="Search data"
            onChange={handleSearchChange}
            value={search}
          />

          <button type="button" title="Add Data" onClick={handleAddRule}>
            <MdAddBox />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table className={styles.rulesTable}>
            <thead>
              <tr>
                <th>Key</th>
                {rowCol?.col?.map((damage, i) => (
                  <th
                    key={i}
                    onClick={() => handleFetchData(damage?.damage_code, true)}
                  >
                    {damage?.damage_code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowCol?.row?.map((symptom, i) => (
                <tr key={i}>
                  <td onClick={() => handleFetchData(symptom?.symptom_code)}>
                    {symptom?.symptom_code}
                  </td>
                  {rowCol?.col?.map((damage, i) => (
                    <td
                      key={i}
                      title={`Double click to mark \nG: ${symptom?.name} \nK: ${damage?.name}`}
                      onDoubleClick={() =>
                        handleToggleRule(
                          symptom?.symptom_code,
                          damage?.damage_code
                        )
                      }
                      className={
                        (symptom?.symptom_code
                          ?.toLowerCase()
                          .includes(search?.toLowerCase()) ||
                          damage?.damage_code
                            ?.toLowerCase()
                            .includes(search?.toLowerCase())) &&
                        search
                          ? styles.search
                          : null
                      }
                    >
                      {isMatching(symptom?.symptom_code, damage?.damage_code)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className={styles.footer}>
        <button disabled>Prev Page</button>
        <span>Page 1</span>
        <button disabled>Next Page</button>
      </footer>

      {modalOpen && (
        <FormModal
          fields={viewModal?.fields}
          data={viewModal?.data}
          onClose={handleModalClose}
          onSubmit={() => {}}
          isView={viewModal?.isView}
        />
      )}
    </div>
  );
}
