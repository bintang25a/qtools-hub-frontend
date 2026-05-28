import { useEffect, useState } from "react";
import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { me } from "../../_services/auth";
import LoadingJump from "../../components/overlay/JumpLoading";
import styles from "../../styles/Auth.module.css";
import { MdCancel, MdCheck, MdEdit } from "react-icons/md";
import { getPhoto } from "../../_services/files";
import { FaPaperPlane } from "react-icons/fa6";
import { showUser, updateUser } from "../../_services/users";
import InfoModal from "../../components/overlay/InfoModal";
import { useNavigate, useParams } from "react-router-dom";

const InputContainer = (param) => {
  const { formData, user, name, label, change, submit, isView = false } = param;

  const [isEdit, setIsEdit] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  const handleEdit = () => {
    setIsEdit(true);
    setIsCancel(false);
  };

  const handleSubmit = () => {
    submit();
    setIsEdit(false);
    setIsCancel(false);

    const e = {
      target: {
        name,
        value: user?.[name],
      },
    };

    change(e);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setIsCancel(true);

    const e = {
      target: {
        name,
        value: user?.[name],
      },
    };

    change(e);
  };

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>
        {label}

        {isEdit && !isView ? (
          <>
            <button title="Cancel" onClick={handleCancel}>
              <MdCancel />
            </button>

            <button title="Save" onClick={handleSubmit}>
              <MdCheck />
            </button>
          </>
        ) : (
          !isView && (
            <button title="Edit" onClick={handleEdit}>
              <MdEdit />
            </button>
          )
        )}
      </label>

      <input
        type="text"
        id={name}
        name={name}
        value={isCancel ? user?.[name] : formData?.[name]}
        onChange={change}
        disabled={!isEdit}
      />
    </div>
  );
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [user, setUser] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const defaultForm = {
    name: "",
    uid: "",
    role: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  };
  const [formData, setFormData] = useState(defaultForm);

  const isView = id ? true : false;
  const pass =
    formData?.password && formData?.password === formData?.confirm_password;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [userData] = await Promise.all([isView ? showUser(id) : me()]);

        setUser(userData?.data);
        setFormData({
          ...defaultForm,
          ...userData?.data,
          photo: null,
        });
      } catch (error) {
        console.log(error);

        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

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

  const handleSubmit = async () => {
    setIsLoading(true);

    if (formData?.password !== formData?.confirm_password) {
      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Create data failed",
        message: "Password didnt match",
      });

      return setIsLoading(false);
    }

    const payload = new FormData();

    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          payload.append(key, value);
        }
      });
    }

    payload.append("_method", "PUT");

    try {
      const response = await updateUser(user?.uid, payload);

      const resData = response?.data;

      setUser(resData);
      setFormData({
        ...defaultForm,
        ...resData,
        photo: null,
      });

      setInfoModal({
        isOpen: true,
        title: "Success",
        message: response?.message,
      });
    } catch (error) {
      console.error(error?.response?.message);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Create data failed",
        message: error?.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 250);
    }
  };

  return (
    <>
      <Header setIsLoading={setIsLoading} userData={user} />
      <main className={styles.main}>
        <div className={styles.profileContainer}>
          <div className={styles.bio}>
            <div className={styles.photo}>
              <img
                src={
                  formData?.photoPreview
                    ? formData?.photoPreview
                    : getPhoto(user?.photo)
                }
                alt={user?.name}
              />

              <label
                htmlFor="photo"
                photo={user?.photo || formData?.photoPreview ? "" : "null"}
              >
                Upload Photo
              </label>

              <input
                type="file"
                accept="png/jpg/jpeg"
                id="photo"
                name="photo"
                onChange={handleChange}
              />
            </div>
            <div className={styles.name}>
              <span>{user?.name}</span>
              <span>{user?.uid}</span>
            </div>
          </div>

          <div className={styles.content}>
            <InputContainer
              formData={formData}
              user={user}
              label={"Name"}
              name={"name"}
              change={handleChange}
              submit={handleSubmit}
              isView={isView}
            />
            <InputContainer
              formData={formData}
              user={user}
              label={"UID"}
              name={"uid"}
              change={handleChange}
              submit={handleSubmit}
              isView={isView}
            />
            <InputContainer
              formData={formData}
              user={user}
              label={"Role"}
              name={"role"}
              change={handleChange}
              submit={handleSubmit}
              isView={isView}
            />
            <InputContainer
              formData={formData}
              user={user}
              label={"Email"}
              name={"email"}
              change={handleChange}
              submit={handleSubmit}
              isView={isView}
            />
            <InputContainer
              formData={formData}
              user={user}
              label={"Phone Number"}
              name={"phone_number"}
              change={handleChange}
              submit={handleSubmit}
              isView={isView}
            />
          </div>

          {!isView && (
            <div className={styles.security}>
              <div className={styles.inputContainer}>
                <label htmlFor="password">New Password</label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={formData?.password}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="confirm_password">Confirm Password</label>

                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  onChange={handleChange}
                  value={formData?.confirm_password}
                />
              </div>

              <div className={styles.inputContainer}>
                <button
                  onClick={handleSubmit}
                  disabled={!pass && !formData?.photoPreview}
                >
                  Change <FaPaperPlane />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <InteractiveBackground />
      {isLoading && <LoadingJump />}
      <InfoModal
        isOpen={infoModal?.isOpen}
        isError={infoModal?.isError}
        title={infoModal?.title}
        message={infoModal?.message}
        onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
      />
    </>
  );
}
