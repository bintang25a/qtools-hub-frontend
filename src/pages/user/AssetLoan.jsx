import { useOutletContext } from "react-router-dom";
import styles from "../../styles/User.module.css";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaClipboardList,
  FaPaperPlane,
  FaQrcode,
} from "react-icons/fa6";
import QrScannerModal from "../../components/overlay/QrScannerModal";

export default function AssetLoan() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { setIsLoading, setInfoModal, setConfirmModal } = overlay;
  const { assets } = data;
  const { setSearchData, handleChangePage } = feature;

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);

      handleChangePage("default");

      setSearchData({
        key: "",
        value: "",
      });
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;

    let conditionTimeout;

    if (assets) {
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
  }, [assets]);

  const [formData, setFormData] = useState({
    loan_needs: "",
    asset_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filteredAsset = assets?.filter((a) =>
    a?.asset_number?.toUpperCase()?.includes(formData?.asset_id?.toUpperCase())
  );

  const [openModal, setOpenModal] = useState(false);
  const [qrResult, setQrResult] = useState("");

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setOpenModal(true);
    } catch (error) {
      console.error(error);
      alert("Izin kamera ditolak");
    }
  };

  const onScanSuccess = (value) => {
    setQrResult(value);

    setOpenModal(false);
    alert(value);
  };

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

        <form>
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
              <label htmlFor="asset_id">Asset</label>
              <input
                name="asset_id"
                id="asset_id"
                value={formData?.asset_id}
                onChange={handleChange}
                placeholder="Input Your Asset ID"
                required
              />

              <div className={styles.assetContainer}>
                {filteredAsset?.slice(0, 10)?.map((a) => (
                  <button
                    key={a?.asset_number}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, asset_id: a?.asset_number })
                    }
                  >
                    {a?.asset_number}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.inputContainer}>
              <button
                type="button"
                className={styles.openCamBtn}
                onClick={handleOpenCamera}
              >
                <FaQrcode /> Scan QR Code <FaCamera />
              </button>
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="autoSubmit">Enable Auto Submit After Scan?</label>
              <input type="checkbox" name="autoSubmit" id="autoSubmit" />

              <button type="button" className={styles.submitBtn}>
                Submit <FaPaperPlane />
              </button>
            </div>
          </div>
        </form>
      </section>

      <QrScannerModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onScanSuccess={onScanSuccess}
      />
    </main>
  );
}
