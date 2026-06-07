import { FaCamera, FaPaperPlane, FaQrcode } from "react-icons/fa6";

export default function ReportFormPage2({
  totalPage,
  user,
  formData,
  handleChange,
  handleOpenCamera,
  isFocus,
  setIsFocus,
  filteredAsset,
  setFormData,
  styles,
}) {
  return (
    <div className={styles.formContainer}>
      <h3>Page 1/{totalPage}</h3>

      <div className={styles.inputContainer}>
        <label htmlFor="nrp">NRP</label>
        <input type="text" value={user?.nrp} disabled />
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="nrp">Reporter Name</label>
        <input type="text" value={user?.name} disabled />
      </div>

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
        <label htmlFor="asset_id">Scan asset</label>
        <button
          type="button"
          className={styles.openCamBtn}
          onClick={handleOpenCamera}
          disabled={!formData?.loan_needs}
        >
          <FaQrcode /> Scan QR Code <FaCamera />
        </button>
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="asset_id">or input asset</label>
        <input
          name="asset_id"
          id="asset_id"
          value={formData?.asset_id}
          onChange={handleChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
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
  );
}
