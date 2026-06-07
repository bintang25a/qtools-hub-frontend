import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaClipboardList,
  FaFileCircleExclamation,
  FaPaperPlane,
  FaQrcode,
} from "react-icons/fa6";
import QrScannerModal from "../../components/overlay/QrScannerModal";
import { createTransaction } from "../../_services/transaction";
import PageButton from "../../components/form/PageButton";

export default function AssetReport() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading, setInfoModal } = overlay;
  const { assets, users, user } = data;

  const [openCamModal, setOpenCamModal] = useState(false);

  const tempReportForm = localStorage.getItem("tempReportForm");
  const parse = tempReportForm ? JSON.parse(tempReportForm) : {};

  const [formData, setFormData] = useState({
    asset_id: "",
    description: "",
    evidence1: "",
    remark1: "",
    evidence2: "",
    remark2: "",
    follow_up: "",
    planner_id: "",
    plant_engineer_id: "",
    section_head_id: "",
    depth_head_id: "",
    ...parse,
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

    if (assets && user) {
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
  }, [assets, user]);

  const filteredAsset =
    assets?.filter((a) =>
      a?.asset_number
        ?.toUpperCase()
        ?.includes(formData?.asset_id?.toUpperCase())
    ) || [];

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    const data = {
      ...formData,
      [name]: value,
    };

    setFormData(data);

    localStorage.setItem("tempReportForm", JSON.stringify(data));
  };

  const handleAssetIdClick = (id) => {
    const data = {
      ...formData,
      asset_id: id,
    };

    setFormData(data);

    localStorage.setItem("tempReportForm", JSON.stringify(data));
  };

  const onScanSuccess = (value) => {
    setOpenCamModal(false);

    handleSubmit(null, value);
  };

  const handleSubmit = async (e, value) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        user_id: user?.nrp,
        loanAt: new Date().toISOString(),
      };

      if (value) {
        payload["asset_id"] = value;
      }

      const res = await createTransaction(payload);

      setInfoModal({
        isOpen: true,
        isError: false,
        title: "Success",
        message: res?.message,
        onClose: () => setInfoModal((prev) => ({ ...prev, isOpen: false })),
      });

      setFormData({
        loan_needs: "",
        asset_id: "",
      });

      const role = user?.role?.toLowerCase();

      if (role === "tool keeper" || role === "planner") {
        navigate("/planner/transactions");
      }
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
  const isNext = [
    !formData?.asset_id,
    !formData?.evidence1 || !formData?.remark1,
    !formData?.description,
    page == 4,
  ];

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Asset Report</h1>
      </section>

      <section className={styles.assetForm}>
        <h2>
          <FaFileCircleExclamation />
          Report Form
        </h2>

        <form onSubmit={handleSubmit}>
          {page === 1 ? (
            <div className={styles.formContainer}>
              <h3>Page 1/4 : Profile & Asset</h3>

              <div className={styles.inputContainer}>
                <label htmlFor="nrp">NRP</label>
                <input type="text" value={user?.nrp} disabled />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="nrp">Reporter Name</label>
                <input type="text" value={user?.name} disabled />
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
                  onChange={handleChange}
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
          ) : page === 2 ? (
            <div className={styles.formContainer}>
              <h3>Page 2/4 : Evidence</h3>

              <div className={styles.inputContainer}>
                <label htmlFor="evidence1">Evidence 1</label>
                <input
                  type="file"
                  id="evidence1"
                  name="evidence1"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="remark1">Remark 1</label>
                <input
                  type="text"
                  id="remark1"
                  name="remark1"
                  placeholder="Input Remark 1"
                  onChange={handleChange}
                  value={formData?.remark1}
                  required
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="evidence2">Evidence 2 (optional)</label>
                <input
                  type="file"
                  id="evidence2"
                  name="evidence2"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="remark2">Remark 2 (optional)</label>
                <input
                  type="text"
                  id="remark2"
                  name="remark2"
                  placeholder="Input Remark 2"
                  onChange={handleChange}
                  value={formData?.remark2}
                />
              </div>

              <PageButton page={page} setPage={setPage} isNext={isNext[1]} />
            </div>
          ) : page === 3 ? (
            <div className={styles.formContainer}>
              <h3>Page 3/4 : Details</h3>

              <div className={styles.inputContainer}>
                <label htmlFor="description">Description</label>
                <textarea
                  rows={6}
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Describe details about report"
                  onChange={handleChange}
                  value={formData?.description}
                  required
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="follow_up">Follow Up</label>

                <div className={styles.radioContainer}>
                  {["repair", "calibration", "replace"].map((option) => (
                    <label key={option} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="follow_up"
                        value={option}
                        checked={formData?.follow_up === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <PageButton page={page} setPage={setPage} isNext={isNext[2]} />
            </div>
          ) : (
            <div className={styles.formContainer}>
              <h3>Page 4/4 : Supervisor</h3>

              <div className={styles.inputContainer}>
                <label htmlFor="description">Description</label>
                <select
                  name="planner_id"
                  id="planner_id"
                  onChange={handleChange}
                >
                  <option value="">Select Planner</option>
                  {users
                    ?.filter((u) =>
                      u?.section?.toLowerCase().includes("planner")
                    )
                    ?.map((u) => (
                      <option key={u.nrp} value={u.nrp}>
                        {u.name}
                      </option>
                    ))}
                </select>
                <textarea
                  rows={6}
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Describe details about report"
                  onChange={handleChange}
                  value={formData?.description}
                  required
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="follow_up">Follow Up</label>

                <div className={styles.radioContainer}>
                  {["repair", "calibration", "replace"].map((option) => (
                    <label key={option} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="follow_up"
                        value={option}
                        checked={formData?.follow_up === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <PageButton page={page} setPage={setPage} isNext={isNext[2]} />
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
