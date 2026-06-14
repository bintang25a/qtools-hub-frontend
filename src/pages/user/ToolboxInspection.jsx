import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import { FaCamera, FaQrcode, FaToolbox } from "react-icons/fa6";
import QrScannerModal from "../../components/overlay/QrScannerModal";
import { createInspection } from "../../_services/inspection";
import PageButton from "../../components/form/PageButton";
import { viewObject } from "../../_utilities/actionObject/reportObject";

export default function ToolboxInspection() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading, setInfoModal } = overlay;
  const { assets, tools, user } = data;

  const [openCamModal, setOpenCamModal] = useState(false);

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

    let conditionTimeout;

    if (assets && user && tools) {
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
  }, [assets, user, tools]);

  const filteredAsset =
    assets?.filter((a) =>
      a?.asset_number
        ?.toUpperCase()
        ?.includes(formData?.asset_id?.toUpperCase())
    ) || [];

  const searchFields = ["tool_number", "name", "specification", "stock_code"];
  const searchLower = search?.toLowerCase() || "";
  const filteredTools = tools?.filter((t) =>
    searchFields.some((field) =>
      String(t?.[field] || "")
        .toLowerCase()
        .includes(searchLower)
    )
  );

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setOpenCamModal(true);
    } catch (error) {
      console.error(error);
      alert("Izin kamera ditolak");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const data = {
      ...formData,
      [name]: value,
    };

    setFormData(data);

    localStorage.setItem("tempInspectionForm", JSON.stringify(data));
  };

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

  const handleAssetIdClick = (id) => {
    const data = {
      ...formData,
      asset_id: id,
    };

    setFormData(data);

    localStorage.setItem("tempInspectionForm", JSON.stringify(data));
  };

  const onScanSuccess = (value) => {
    setOpenCamModal(false);

    setFormData({
      ...formData,
      asset_id: value,
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
        inspectionAt: new Date().toISOString(),
        tools: formTools,
      };

      const res = await createInspection(payload);

      setInfoModal({
        isOpen: true,
        isError: false,
        title: "Success",
        message: res?.message,
        onClose: () => onClose(res?.data?.inspection_id),
      });

      localStorage.removeItem("tempInspectionForm");

      setPage(1);
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

  const [page, setPage] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
  const isNext = [!formData?.asset_id, "lastPage"];

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
          {page === 1 ? (
            <div className={styles.formContainer}>
              <h3>Page 1/2 : Profile & Asset</h3>

              <div className={styles.inputContainer}>
                <label htmlFor="nrp">NRP</label>
                <input type="text" value={user?.nrp} required disabled />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="nrp">Mechanic Name</label>
                <input type="text" value={user?.name} required disabled />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="asset_id">Scan or Input asset</label>
                <button
                  type="button"
                  className={styles.openCamBtn}
                  onClick={handleOpenCamera}
                >
                  <FaQrcode /> Scan QR Code <FaCamera />
                </button>

                <input
                  name="asset_id"
                  id="asset_id"
                  value={formData?.asset_id}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setTimeout(() => setIsFocus(false), 250)}
                  placeholder={
                    formData?.loan_needs
                      ? "Input Your Asset ID"
                      : "Please input your needs first"
                  }
                  required
                />

                {filteredAsset?.length > 0 && isFocus && (
                  <div className={styles.assetContainer}>
                    {filteredAsset?.slice(0, 15)?.map((a) => (
                      <button
                        key={a?.asset_number}
                        type="button"
                        onClick={() => handleAssetIdClick(a?.asset_number)}
                      >
                        {a?.asset_number}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <PageButton page={page} setPage={setPage} isNext={isNext[0]} />
            </div>
          ) : (
            <div className={styles.formContainer}>
              <h3>Page 2/2 : Tools</h3>

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

              <PageButton page={page} setPage={setPage} isNext={isNext[1]} />
            </div>
          )}
        </form>
      </section>

      <QrScannerModal
        isOpen={openCamModal}
        onClose={() => setOpenCamModal(false)}
        onScanSuccess={onScanSuccess}
      />
    </main>
  );
}
