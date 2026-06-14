import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import { FaToolbox } from "react-icons/fa6";
import { showInspection, updateInspection } from "../../_services/inspection";
import PageButton from "../../components/form/PageButton";
import { viewObject } from "../../_utilities/actionObject/reportObject";
import { formatedDateFull } from "../../_utilities/formatedDate";

export default function ToolboxInspectionEdit() {
  const { data, firstLoad, overlay } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const { setIsLoading, setInfoModal } = overlay;
  const { tools, user } = data;

  const tempInspectionForm = localStorage.getItem("tempInspectionForm");
  const parse = tempInspectionForm ? JSON.parse(tempInspectionForm) : {};

  const [formTools, setFormTools] = useState([]);

  const [formData, setFormData] = useState({
    asset_id: "",
    inspectionAt: "",
    tools: formTools,
    ...parse,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;

    const fetchData = async () => {
      try {
        const { data } = await showInspection(id);

        setFormData({
          asset_id: data?.asset_id,
          inspectionAt: data?.inspectionAt,
        });

        const tempFormTools =
          data?.tools?.map((t) => {
            const pivotData = t?.tools_inspections;

            return {
              tool_number: t?.tool_number,
              name: t?.name,
              specification: t?.specification,

              condition: pivotData?.condition || "",
              quantity: pivotData?.quantity || "",
              remark: pivotData?.remark || "",
            };
          }) || [];

        setFormTools(tempFormTools);
      } catch (error) {
        console.log(error);
      }
    };

    let conditionTimeout;

    if (tools && user) {
      fetchData();

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
  }, [tools, user]);

  const searchFields = ["tool_number", "name", "specification", "stock_code"];
  const searchLower = search?.toLowerCase() || "";
  const filteredTools = tools?.filter((t) =>
    searchFields.some((field) =>
      String(t?.[field] || "")
        .toLowerCase()
        .includes(searchLower)
    )
  );

  const handleToolsChange = (e, id, customName) => {
    const name = customName || e.target.name;
    const value = e.target.value;

    setFormTools((prevTools) => {
      const currentTools = prevTools || [];
      const idx = currentTools.findIndex((t) => t?.tool_number === id);

      if (idx !== -1) {
        const newTools = [...currentTools];
        newTools[idx] = {
          ...newTools[idx],
          [name]: value,
        };

        const target = newTools[idx];
        const hasValue = target.quantity || target.condition || target.remark;
        return !hasValue
          ? newTools.filter((t) => t.tool_number !== id)
          : newTools;
      } else {
        if (value.trim() === "") return currentTools;
        return [
          ...currentTools,
          {
            tool_number: id,
            quantity: "",
            condition: "",
            remark: "",
            [name]: value,
          },
        ];
      }
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    const onClose = (id) => {
      setInfoModal((prev) => ({ ...prev, isOpen: false }));

      if (user?.role === "planner" || user?.role === "tool keeper") {
        navigate("/admin/inspections", {
          replace: true,
          state: { id, ...viewObject },
        });
      } else {
        sessionStorage.setItem("newInspection", id);

        navigate(`/`, { replace: true });
      }
    };

    try {
      const payload = {
        ...formData,
        tools: formTools,
      };

      const res = await updateInspection(id, payload);

      setInfoModal({
        isOpen: true,
        isError: false,
        title: "Success",
        message: res?.message,
        onClose: () => onClose(id),
      });

      localStorage.removeItem("tempInspectionForm");
    } catch (error) {
      console.log(error?.message);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Failed",
        message: error?.message,
        onClose: () => setInfoModal((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Toolbox Inspection</h1>
      </section>

      <section className={styles.assetForm}>
        <h2>
          <FaToolbox />
          Inspection Form
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <h3>Edit Inspection Data {id}</h3>

            <div className={styles.inputContainer}>
              <label htmlFor="nrp">NRP</label>
              <input type="text" value={user?.nrp} required disabled />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="nrp">Mechanic Name</label>
              <input type="text" value={user?.name} required disabled />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="asset_id">Asset ID</label>

              <input
                name="asset_id"
                id="asset_id"
                value={formData?.asset_id}
                required
                disabled
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="asset_id">Inspection Time</label>

              <input
                name="asset_id"
                id="asset_id"
                value={formatedDateFull(formData?.inspectionAt)}
                required
                disabled
              />
            </div>

            <h3>Tools Inspection Data</h3>

            <div className={styles.tableContainer}>
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools here"
              />

              <table>
                <thead>
                  <tr>
                    <th>Part Number</th>
                    <th>Name</th>
                    <th>Specification</th>
                    <th>Quantity</th>
                    <th>Condition</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools?.slice(0, 20)?.map((t) => {
                    const currentData = formTools?.find(
                      (item) => item.tool_number === t?.tool_number
                    );

                    return (
                      <tr key={t?.tool_number}>
                        <td>{t?.tool_number}</td>
                        <td>{t?.name}</td>
                        <td>{t?.specification}</td>

                        <td>
                          <input
                            type="number"
                            name="quantity"
                            value={currentData?.quantity || ""}
                            onChange={(e) =>
                              handleToolsChange(e, t?.tool_number)
                            }
                          />
                        </td>

                        <td>
                          <label htmlFor={`good-${t?.tool_number}`}>
                            <input
                              type="radio"
                              id={`good-${t?.tool_number}`}
                              name={`condition-${t?.tool_number}`}
                              value="good"
                              checked={currentData?.condition === "good"}
                              onChange={(e) =>
                                handleToolsChange(
                                  e,
                                  t?.tool_number,
                                  "condition"
                                )
                              }
                            />
                            Good
                          </label>

                          <label htmlFor={`broken-${t?.tool_number}`}>
                            <input
                              type="radio"
                              id={`broken-${t?.tool_number}`}
                              name={`condition-${t?.tool_number}`}
                              value="broken"
                              checked={currentData?.condition === "broken"}
                              onChange={(e) =>
                                handleToolsChange(
                                  e,
                                  t?.tool_number,
                                  "condition"
                                )
                              }
                            />
                            Broken
                          </label>

                          <label htmlFor={`missing-${t?.tool_number}`}>
                            <input
                              type="radio"
                              id={`missing-${t?.tool_number}`}
                              name={`condition-${t?.tool_number}`}
                              value="missing"
                              checked={currentData?.condition === "missing"}
                              onChange={(e) =>
                                handleToolsChange(
                                  e,
                                  t?.tool_number,
                                  "condition"
                                )
                              }
                            />
                            Missing
                          </label>
                        </td>

                        <td>
                          <input
                            type="text"
                            name="remark"
                            value={currentData?.remark || ""}
                            onChange={(e) =>
                              handleToolsChange(e, t?.tool_number)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <PageButton isNext={"lastPage"} />
          </div>
        </form>
      </section>
    </main>
  );
}
