import { useState } from "react";
import styles from "../../styles/Component.module.css";
import { MdClose } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa6";
import { getPhoto } from "../../_services/files";

export default function FormModal({ fields, data, onSubmit, onClose, isView }) {
  const [formData, setFormData] = useState(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = data ? data[field?.name] : "";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { value, name, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];

      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles?.formModal}`}>
        <h2>{isView ? "View Data" : data ? "Edit Data" : "Add Data"}</h2>

        <form onSubmit={(e) => onSubmit(e, formData)}>
          <div className={styles.formContainer}>
            {fields?.map((field, i) => (
              <div key={i} className={styles?.inputContainer}>
                {field?.type === "select" ? (
                  <>
                    <label htmlFor={field?.name}>{field?.label}</label>
                    <select
                      name={field?.name}
                      id={field?.name}
                      onChange={handleChange}
                      value={formData[field?.name]}
                      required
                      disabled={isView || field?.disabled}
                    >
                      <option value="">{field?.label}</option>
                      {field?.options?.map((option, i) => (
                        <option key={i} value={option?.value}>
                          {option?.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : field?.type === "file" &&
                  field?.name === "photo" &&
                  isView ? (
                  <>
                    <img src={getPhoto(formData[field?.name])} alt="" />
                  </>
                ) : (
                  <>
                    <label htmlFor={field?.name}>{field?.label}</label>
                    <input
                      type={field?.type}
                      name={field?.name}
                      id={field?.name}
                      placeholder={field?.placeholder || ""}
                      onChange={handleChange}
                      value={
                        field?.type !== "file" ? formData[field?.name] : null
                      }
                      required={
                        (field?.type !== "file" ||
                          field?.name === "password") &&
                        !data
                      }
                      disabled={isView || field?.disabled}
                    />
                  </>
                )}
              </div>
            ))}

            {!isView && (
              <button type="submit" disabled={isView}>
                Submit <FaPaperPlane />
              </button>
            )}
          </div>
        </form>

        <button onClick={onClose}>
          <MdClose />
        </button>
      </div>
    </div>
  );
}
