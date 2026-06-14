import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaClipboardList,
  FaPaperPlane,
  FaQrcode,
} from "react-icons/fa6";
import QrScannerModal from "../../components/overlay/QrScannerModal";
import { createTransaction } from "../../_services/transaction";

export default function AssetLoan() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading, setInfoModal } = overlay;
  const { assets, user } = data;

  const [openCamModal, setOpenCamModal] = useState(false);

  const [formData, setFormData] = useState({
    loan_needs: "",
    asset_id: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
        navigate("/admin/transactions");
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

  const [isFocus, setIsFocus] = useState(false);

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Asset Loan</h1>
      </section>
      <section className={styles.assetForm}>
        <h2>
          <FaClipboardList />
          Loan Form
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <div className={styles.inputContainer}>
              <label htmlFor="loan_needs">Needs</label>
              <textarea
                name="loan_needs"
                id="loan_needs"
                rows={6}
                value={formData?.loan_needs}
                onChange={handleChange}
                placeholder="Describe what makes you take this asset"
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="asset_id">Scan or input asset</label>
              <button
                type="button"
                className={styles.openCamBtn}
                onClick={handleOpenCamera}
                disabled={!formData?.loan_needs}
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
                disabled={!formData?.loan_needs}
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
                      disabled={!formData?.loan_needs}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          asset_id: a?.asset_number,
                        })
                      }
                    >
                      {a?.asset_number}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.inputContainer}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!formData?.loan_needs}
              >
                Submit <FaPaperPlane />
              </button>
            </div>
          </div>
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
