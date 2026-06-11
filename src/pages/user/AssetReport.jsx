import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import { FaCamera, FaFileCircleExclamation, FaQrcode } from "react-icons/fa6";
import QrScannerModal from "../../components/overlay/QrScannerModal";
import { createReport } from "../../_services/report";
import PageButton from "../../components/form/PageButton";
import { viewObject } from "../../_utilities/actionObject/reportObject";

export default function AssetReport() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading, setInfoModal } = overlay;
  const { assets, users, user } = data;

  const [openCamModal, setOpenCamModal] = useState(false);
  const [roleUsers, setRoleUsers] = useState(null);

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
    group_leader_id: "",
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
      const grouped = users?.reduce(
        (acc, user) => {
          const section = user?.section?.toLowerCase();

          if (section?.includes("planner")) {
            acc?.planner?.push(user);
          } else if (section?.includes("plant")) {
            acc?.plantEngineer?.push(user);
          } else if (section?.includes("sec") && section?.includes("head")) {
            acc?.secHead?.push(user);
          } else if (section?.includes("dept") && section?.includes("head")) {
            acc?.deptHead?.push(user);
          } else if (section?.includes("group lead")) {
            acc?.groupLead?.push(user);
          }

          return acc;
        },
        {
          planner: [],
          plantEngineer: [],
          secHead: [],
          deptHead: [],
          groupLead: [],
        }
      );

      setRoleUsers(grouped);

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
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0] || null;

      const MAX_FILE_SIZE = 4 * 1024 * 1024;

      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large, maximum size is 4MB.`);

        e.target.value = null;
        return;
      }

      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      const data = {
        ...formData,
        [name]: value,
      };

      setFormData(data);

      const { evidence1, evidence2, ...rest } = data;

      console.log(evidence1, evidence2);

      localStorage.setItem("tempReportForm", JSON.stringify(rest));
    }
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
        navigate("/admin/reports/view", {
          replace: true,
          state: { id, ...viewObject },
        });
      } else {
        navigate(`/view/reports/${id}`, { replace: true });
      }
    };

    try {
      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      payload.append("user_id", user?.nrp);

      const res = await createReport(payload);

      alert(res?.data?.report_id);

      setInfoModal({
        isOpen: true,
        isError: false,
        title: "Success",
        message: res?.message,
        onClose: () => onClose(res?.data?.report_id),
      });

      setFormData({
        asset_id: "",
        description: "",
        evidence1: "",
        remark1: "",
        evidence2: "",
        remark2: "",
        follow_up: "",
        group_leader_id: "",
        planner_id: "",
        plant_engineer_id: "",
        section_head_id: "",
        depth_head_id: "",
      });

      localStorage.removeItem("tempReportForm");

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
  const isNext = [
    !formData?.asset_id,
    !formData?.evidence1 || !formData?.remark1,
    !formData?.description,
    "lastPage",
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
                <input type="text" value={user?.nrp} required disabled />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="nrp">Reporter Name</label>
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
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleChange}
                  required
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
                  accept="image/png, image/jpeg, image/jpg"
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
                        required
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
                <label htmlFor="description">Select Group Leader</label>
                <select
                  name="group_leader_id"
                  id="group_leader_id"
                  onChange={handleChange}
                  value={formData?.group_leader_id}
                  required
                >
                  <option value="">Select Group Leader</option>
                  {roleUsers?.groupLead?.map((u) => (
                    <option key={u.nrp} value={u.nrp}>
                      {u?.nrp} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="planner_id">Select Planner</label>
                <select
                  name="planner_id"
                  id="planner_id"
                  onChange={handleChange}
                  value={formData?.planner_id}
                  required
                >
                  <option value="">Select Planner</option>
                  {roleUsers?.planner?.map((u) => (
                    <option key={u.nrp} value={u.nrp}>
                      {u?.nrp} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="plant_engineer_id">Select Plant Engineer</label>
                <select
                  name="plant_engineer_id"
                  id="plant_engineer_id"
                  onChange={handleChange}
                  value={formData?.plant_engineer_id}
                  required
                >
                  <option value="">Select Plant Engineer</option>
                  {roleUsers?.plantEngineer?.map((u) => (
                    <option key={u.nrp} value={u.nrp}>
                      {u?.nrp} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="section_head_id">Select Section Head</label>
                <select
                  name="section_head_id"
                  id="section_head_id"
                  onChange={handleChange}
                  value={formData?.section_head_id}
                  required
                >
                  <option value="">Select Section Head</option>
                  {roleUsers?.secHead?.map((u) => (
                    <option key={u.nrp} value={u.nrp}>
                      {u?.nrp} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="dept_head_id">Select Dept Head</label>
                <select
                  name="dept_head_id"
                  id="dept_head_id"
                  onChange={handleChange}
                  value={formData?.dept_head_id}
                  required
                >
                  <option value="">Select Dept Head</option>
                  {roleUsers?.deptHead?.map((u) => (
                    <option key={u.nrp} value={u.nrp}>
                      {u?.nrp} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <PageButton page={page} setPage={setPage} isNext={isNext[3]} />
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
