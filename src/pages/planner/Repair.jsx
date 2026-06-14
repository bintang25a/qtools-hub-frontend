import { useEffect } from "react";
import styles from "../../styles/Admin.module.css";
import { useOutletContext } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaMagnifyingGlass,
  FaPencil,
  FaPlus,
  FaRegClipboard,
  FaTrash,
} from "react-icons/fa6";
import { formatedDateFull } from "../../_utilities/formatedDate";
import {
  createRepair,
  deleteRepair,
  showRepair,
  updateRepair,
} from "../../_services/repair";
import {
  addObject,
  editObject,
  viewObject,
} from "../../_utilities/actionObject/repairObject";

export default function Repair() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { repairs } = data;
  const { setIsLoading, setInfoModal, setConfirmModal, setFormModal } = overlay;
  const {
    totalPage,
    currentPage,
    setSearchData,
    handleChangePage,
    handleChangePath,
    handleSearchSubmit,
  } = feature;

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

    if (repairs) {
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
  }, [repairs]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value?.toLowerCase(),
    }));
  };

  const handleDelete = (id) => {
    const onClose = (isError) => {
      setInfoModal((prev) => ({ ...prev, isOpen: false }));

      if (!isError) {
        handleChangePage("default");
      }
    };

    const onSubmit = async () => {
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));

      try {
        setIsLoading(false);

        await deleteRepair(id);

        setInfoModal({
          isOpen: true,
          title: "Successfully",
          message: `Delete repair with id ${id} successfully`,
          onClose: () => onClose(false),
        });
      } catch (error) {
        console.log(error?.message);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Failed",
          message: error?.message,
          onClose: () => onClose(true),
        });
      } finally {
        setIsLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: `Delete ${id}`,
      message: "Are you sure to delete?",
      onSubmit,
      onCancel: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handleAddEdit = async (id, isEdit) => {
    const onClose = (reload, info) => {
      if (!info) {
        setInfoModal((prev) => ({ ...prev, isOpen: false }));
      } else {
        setFormModal((prev) => ({ ...prev, isOpen: false }));
      }

      if (reload) {
        handleChangePage("default");
      }
    };

    const onSubmit = async (e, formData) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const { success, message } = isEdit
          ? await updateRepair(id, formData)
          : await createRepair(formData);

        setFormModal((prev) => ({ ...prev, isOpen: false }));

        setInfoModal({
          isOpen: true,
          title: `Success: ${success}`,
          message: message,
          onClose: () => onClose(true),
        });
      } catch (error) {
        console.log(error);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Failed",
          message: error?.message,
          onClose: () => onClose(false),
        });
      } finally {
        setIsLoading(false);
      }
    };

    try {
      setIsLoading(true);

      const { data } = isEdit ? await showRepair(id) : {};

      setIsLoading(false);

      setFormModal({
        isOpen: true,
        fields: isEdit ? editObject : addObject,
        data,
        onSubmit,
        onClose: () => onClose(false, true),
      });
    } catch (error) {
      console.log(error);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Failed",
        message: error?.message,
        onClose: () => onClose(false),
      });
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>
          <FaRegClipboard className={styles.titleIcon} /> Historical Repair
        </h1>
      </section>

      <section rank="full" className={styles.data}>
        <form onSubmit={handleSearchSubmit}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              name="value"
              id="value"
              placeholder="Search..."
              onChange={handleSearchChange}
            />

            <select name="key" id="key" onChange={handleSearchChange}>
              <option value="">Search by</option>
              <option value="repair_id">Repair ID</option>
              <option value="asset_id">Asset ID</option>
              <option value="notes">Notes</option>
            </select>

            <button type="submit" title="Search">
              <FaMagnifyingGlass />
            </button>

            <button type="button" onClick={() => handleAddEdit()}>
              <FaPlus />
            </button>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Repair ID</th>
                <th>Asset ID</th>
                <th>Repair Date</th>
                <th>Finish Date</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {repairs?.length === 0 ? (
                <tr>
                  <td colSpan={7}>No repairs right now</td>
                </tr>
              ) : null}

              {repairs?.map((r) => (
                <tr key={r?.repair_id}>
                  <td>{r?.repair_id}</td>
                  <td>{r?.asset_id}</td>
                  <td>{formatedDateFull(r?.repairAt)}</td>
                  <td>
                    {formatedDateFull(r?.finishAt) || (
                      <span status="REPAIR">Still Repairing</span>
                    )}
                  </td>
                  <td>{r?.notes}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath({
                            path: "repairs/view",
                            data: { ...viewObject, id: r?.repair_id },
                          })
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => handleAddEdit(r?.repair_id, true)}
                      >
                        <FaPencil />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(r?.repair_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginateContainer}>
          <button
            onClick={() => handleChangePage(false)}
            disabled={currentPage == 1}
          >
            <FaArrowLeft /> Prev
          </button>

          {totalPage <= 1 ? (
            <div className={styles.page}>
              <span title={`Page ${currentPage}`}>{currentPage}</span>
            </div>
          ) : (
            <div className={styles.page}>
              {currentPage !== 1 && (
                <span
                  title={`Page 1`}
                  inactive="true"
                  onClick={() => handleChangePage(1)}
                >
                  1
                </span>
              )}

              <span title={`Page ${currentPage}`}>{currentPage}</span>

              {currentPage !== totalPage && (
                <span
                  title={`Page ${totalPage}`}
                  inactive="true"
                  onClick={() => handleChangePage(Number(totalPage))}
                >
                  {totalPage}
                </span>
              )}
            </div>
          )}

          <button
            onClick={() => handleChangePage(true)}
            disabled={currentPage == totalPage || totalPage == 0}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
}
