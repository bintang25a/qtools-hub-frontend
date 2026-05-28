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
  createDamage,
  deleteDamage,
  showDamage,
  updateDamage,
} from "../../_services/damages";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";

export default function Damage() {
  const {
    setIsLoading,
    setInfoModal,
    setConfirmModal,
    feature,
    action,
    data,
    firstLoad,
  } = useOutletContext();

  const { damagesData } = data;
  const { handleSearchChange, handleSearchSubmit, handleChangePage } = action;
  const { totalPages, currentPage, setCurrentPage, search, setSearch } =
    feature;

  const columns = ["damage_code", "name"];

  const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [damages, setDamages] = useState([]);

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

    if (damagesData) {
      setDamages(damagesData);

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
  }, [damagesData]);

  const addFields = [
    {
      name: "damage_code",
      label: "Damage Code",
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
      name: "damage_code",
      label: "Damage Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "symptoms",
      label: "Symptoms code possible",
      type: "text",
    },
  ];

  const handleFetchSymptom = async (id, view = false) => {
    setIsLoading(true);

    try {
      const response = await showDamage(id);
      const data = response?.data;
      const symptoms = response?.data?.symptoms;

      setIsView(view ? true : false);
      setEditData({
        ...data,
        symptoms: symptoms?.map((d) => d.symptom_code).join(", "),
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

    payload.append("damage_code", formData?.damage_code);
    payload.append("name", formData?.name);

    if (editData) {
      payload.append("_method", "PUT");
    }

    try {
      const response = !editData
        ? await createDamage(payload)
        : await updateDamage(editData?.damage_code, payload);

      if (editData) {
        const tempDamages = [...damages];

        const userIdx = tempDamages.findIndex(
          (damage) => damage?.damage_code === editData?.damage_code
        );

        if (userIdx !== -1) {
          tempDamages[userIdx] = response?.data;
          setDamages(tempDamages);
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
        const response = await deleteDamage(id);

        setDamages(damages?.filter((u) => u?.damage_code !== id));

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
        <h2>Damages Data</h2>

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
                <th>Damage Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {damages?.map((damage) => (
                <tr
                  key={damage?.damage_code}
                  onDoubleClick={() =>
                    handleFetchSymptom(damage?.damage_code, true)
                  }
                  title="Double click to view"
                >
                  <td>{damage?.damage_code}</td>
                  <td>{damage?.name}</td>
                  <td>
                    <button
                      title="View"
                      onClick={() =>
                        handleFetchSymptom(damage?.damage_code, true)
                      }
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => handleFetchSymptom(damage?.damage_code)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(damage?.damage_code)}
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
