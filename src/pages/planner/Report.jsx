import { useEffect } from "react";
import styles from "../../styles/Planner.module.css";
import { useOutletContext } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClipboardQuestion,
  FaEye,
  FaMagnifyingGlass,
  FaPencil,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import { deleteReport } from "../../_services/report";
import { viewObject } from "../../_utilities/action/ReportObject";

export default function Report() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { setIsLoading, setInfoModal, setConfirmModal } = overlay;
  const { reports } = data;
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

    if (reports) {
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
  }, [reports]);

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

        await deleteReport(id);

        setInfoModal({
          isOpen: true,
          title: "Successfully",
          message: `Delete report with id ${id} successfully`,
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

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>
          <FaClipboardQuestion className={styles.titleIcon} /> Report Data
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
              <option value="report_id">Report ID</option>
              <option value="reporter_id">Reporter ID</option>
              <option value="asset_id">Asset ID</option>
              <option value="description">Description</option>
            </select>

            <button type="submit" title="Search">
              <FaMagnifyingGlass />
            </button>

            <button
              type="button"
              onClick={() => handleChangePath("reports/add")}
            >
              <FaPlus />
            </button>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reporter ID</th>
                <th>Asset ID</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports?.length === 0 ? (
                <tr>
                  <td colSpan={5}>No reports right now</td>
                </tr>
              ) : null}

              {reports?.map((r) => (
                <tr key={r?.report_id}>
                  <td>{r?.report_id}</td>
                  <td>{r?.reporter_id}</td>
                  <td>{r?.asset_id}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath({
                            path: "reports/view",
                            data: { ...viewObject, id: r?.report_id },
                          })
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() =>
                          handleChangePath("reports/edit", r?.report_id)
                        }
                      >
                        <FaPencil />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(r?.report_id)}
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
