import { useState } from "react";
import { FaCamera, FaQrcode } from "react-icons/fa6";
import styles from "../../styles/User.module.css";

export default function ReportFormPage1({
  user,
  assets,
  formData,
  setFormData,
  handleChange,
  setOpenCamModal,
  children,
}) {
  const [isFocus, setIsFocus] = useState(false);

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

  return (
    <div className={styles.formContainer}>
      <h3>Page 1/4</h3>

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

      {children}
    </div>
  );
}
