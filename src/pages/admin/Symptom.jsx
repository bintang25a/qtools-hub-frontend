import {
  MdAddBox,
  MdDelete,
  MdEdit,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import {
  createSymptom,
  deleteSymptom,
  showSymptom,
  updateSymptom,
} from "../../_services/symptoms";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";

export default function Symptom() {
  const {
    setIsLoading,
    setInfoModal,
    setConfirmModal,
    feature,
    action,
    data,
    firstLoad,
  } = useOutletContext();

  const { symptomsData } = data;
  const { handleSearchChange, handleSearchSubmit, handleChangePage } = action;
  const { totalPages, currentPage, setCurrentPage, search, setSearch } =
    feature;

  const columns = ["symptom_code", "name"];

  const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    setCurrentPage(1);
    setSearch({
      column: "",
      value: "",
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;

    let conditionTimeout;

    if (symptomsData) {
      setSymptoms(symptomsData);

      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 500);
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
  }, [symptomsData]);

  const addFields = [
    {
      name: "symptom_code",
      label: "Symptom Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
  ];

  const viewFields = [
    {
      name: "symptom_code",
      label: "Symptom Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "damages",
      label: "Possible Damages Code",
      type: "text",
    },
  ];

  const handleFetchSymptom = async (id, view = false) => {
    setIsLoading(true);

    try {
      const response = await showSymptom(id);
      const data = response?.data;
      const damages = response?.data?.damages;

      setIsView(view ? true : false);
      setEditData({
        ...data,
        damages: damages?.map((d) => d.damage_code).join(", "),
      });
    } catch (error) {
      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Get data failed",
        message: error?.message,
      });
    } finally {
      setIsLoading(false);
    }

    setModalOpen(true);
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();

    payload.append("symptom_code", formData?.symptom_code);
    payload.append("name", formData?.name);

    if (editData) {
      payload.append("_method", "PUT");
    }

    try {
      const response = !editData
        ? await createSymptom(payload)
        : await updateSymptom(editData?.symptom_code, payload);

      if (editData) {
        const tempSymptoms = [...symptoms];

        const userIdx = tempSymptoms.findIndex(
          (symptom) => symptom?.symptom_code === editData?.symptom_code
        );

        if (userIdx !== -1) {
          tempSymptoms[userIdx] = response?.data;
          setSymptoms(tempSymptoms);
        }
      }

      setInfoModal({
        isOpen: true,
        title: "Success",
        message: response?.message,
      });

      setEditData(false);
      setModalOpen(false);
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

  const handleDelete = (id) => {
    const onSubmit = async () => {
      setConfirmModal({});
      setIsLoading(true);

      try {
        const response = await deleteSymptom(id);

        setSymptoms(symptoms?.filter((u) => u?.symptom_code !== id));

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

    const onCancel = () => {
      setConfirmModal({});
    };

    setConfirmModal({
      isOpen: true,
      title: "Delete Data",
      message: `Are you sure delete user with id: ${id}? Deleted data can't be recovery`,
      onSubmit,
      onCancel,
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData(false);
    setIsView(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2>Symptoms Data</h2>

        <form onSubmit={handleSearchSubmit}>
          <div className={styles.search}>
            <select name="column" id="column" onChange={handleSearchChange}>
              <option value="">Search Category</option>
              {columns?.map((col, i) => (
                <option key={i} value={col}>
                  {col?.toUpperCase()}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="value"
              id="value"
              placeholder="Search data"
              onChange={handleSearchChange}
              value={search?.value}
            />

            <button type="submit" title="Search">
              <MdSearch />
            </button>

            <button
              type="button"
              title="Add Data"
              onClick={() => setModalOpen(true)}
            >
              <MdAddBox />
            </button>
          </div>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Symptom Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {symptoms?.map((symptom) => (
                <tr
                  key={symptom?.symptom_code}
                  onDoubleClick={() =>
                    handleFetchSymptom(symptom?.symptom_code, true)
                  }
                  title="Double click to view"
                >
                  <td>{symptom?.symptom_code}</td>
                  <td>{symptom?.name}</td>
                  <td>
                    <button
                      title="View"
                      onClick={() =>
                        handleFetchSymptom(symptom?.symptom_code, true)
                      }
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => handleFetchSymptom(symptom?.symptom_code)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(symptom?.symptom_code)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className={styles.footer}>
        <button
          onClick={() => handleChangePage(false)}
          disabled={currentPage <= 1}
        >
          Prev Page
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handleChangePage(true)}
          disabled={currentPage >= totalPages}
        >
          Next Page
        </button>
      </footer>

      {modalOpen && (
        <FormModal
          fields={isView ? viewFields : addFields}
          data={editData}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          isView={isView}
        />
      )}
    </div>
  );
}
