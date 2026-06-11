import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaClipboardCheck,
  FaClipboardList,
  FaPaperPlane,
  FaQrcode,
} from "react-icons/fa6";
import QrScannerModal from "../../components/overlay/QrScannerModal";
import { assetReturn } from "../../_services/action";

export default function AssetReturn() {
  const { data, firstLoad, overlay } = useOutletContext();
  const navigate = useNavigate();

  const { setIsLoading, setInfoModal } = overlay;
  const { transactions, user } = data;

  const [openCamModal, setOpenCamModal] = useState(false);

  const [formData, setFormData] = useState({
    returnAt: "",
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

    if (transactions && user) {
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
  }, [transactions, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
        returnAt: new Date().toISOString(),
      };

      if (value) {
        payload["asset_id"] = value;
      }

      const transaction = transactions?.find(
        (t) => t?.asset_id === payload?.asset_id
      );

      await assetReturn(transaction?.transaction_id, payload);

      setInfoModal({
        isOpen: true,
        isError: false,
        title: "Success",
        message: "Asset Returned",
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

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Asset Return</h1>
      </section>
      <section className={styles.assetForm}>
        <h2>
          <FaClipboardCheck />
          Return Form
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <div className={styles.inputContainer}>
              <label htmlFor="asset_id">Scan or input asset</label>
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
                placeholder={"Input Your Asset ID"}
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!formData?.asset_id}
              >
                Returned Asset <FaPaperPlane />
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
