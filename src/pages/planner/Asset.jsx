import { useEffect } from "react";
import styles from "../../styles/Planner.module.css";
import { useOutletContext } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaMagnifyingGlass,
  FaPencil,
  FaPlus,
  FaTrash,
  FaWrench,
} from "react-icons/fa6";
import {
  createAsset,
  deleteAsset,
  showAsset,
  updateAsset,
} from "../../_services/asset";
import {
  addObject,
  editObject,
  viewObject,
} from "../../_utilities/action/assetObject";

export default function Asset() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { assets } = data;
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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
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

        await deleteAsset(id);

        setInfoModal({
          isOpen: true,
          title: "Successfully",
          message: `Delete asset with id ${id} successfully`,
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
          ? await updateAsset(id, formData)
          : await createAsset(formData);

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

      const { data } = isEdit ? await showAsset(id) : {};

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
          <FaWrench className={styles.titleIcon} /> Asset Data
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
              <option value="asset_number">Asset Number</option>
              <option value="class">Class</option>
              <option value="status">Status</option>
              <option value="location">Location</option>
              <option value="creator">Creator</option>
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
                <th>Asset Number</th>
                <th>Class</th>
                <th>Description</th>
                <th>Status</th>
                <th>Location</th>
                <th>Creator</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets?.length === 0 ? (
                <tr>
                  <td colSpan={7}>No Assets</td>
                </tr>
              ) : null}

              {assets?.map((a) => (
                <tr key={a?.asset_number}>
                  <td>{a?.asset_number}</td>
                  <td>{a?.class}</td>
                  <td>{a?.description}</td>
                  <td>{a?.status}</td>
                  <td>{a?.location}</td>
                  <td>{a?.creator}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath({
                            path: "assets/view",
                            data: { ...viewObject, id: a?.asset_number },
                          })
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => handleAddEdit(a?.asset_number, true)}
                      >
                        <FaPencil />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(a?.asset_number)}
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

          {totalPage === 1 ? (
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
            disabled={currentPage == totalPage}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
}
