import { useEffect } from "react";
import styles from "../../styles/Admin.module.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClipboardList,
  FaEye,
  FaMagnifyingGlass,
  FaPencil,
  FaPlus,
  FaToolbox,
  FaTrash,
} from "react-icons/fa6";
import { formatedDateFull } from "../../_utilities/formatedDate";
import { deleteInspection } from "../../_services/inspection";
import { inspectionDownload } from "../../_services/action";

export default function Inspection() {
  const { data, firstLoad, overlay, feature } = useOutletContext();
  const navigate = useNavigate();

  const { inspections } = data;
  const { setIsLoading, setInfoModal, setConfirmModal } = overlay;
  const {
    totalPage,
    currentPage,
    setSearchData,
    handleChangePage,
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

    if (inspections) {
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
  }, [inspections]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value?.toLowerCase(),
    }));
  };

  const handleDownloadExcel = async (inspectionId) => {
    try {
      const response = await inspectionDownload(inspectionId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Laporan_Inspeksi_${inspectionId}.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Gagal mendownload excel", error);
      alert("Terjadi kesalahan saat mengunduh file.");
    }
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

        await deleteInspection(id);

        setInfoModal({
          isOpen: true,
          title: "Successfully",
          message: `Delete transaction with id ${id} successfully`,
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
          <FaToolbox className={styles.titleIcon} /> Inspection Tool Box
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
              <option value="inspection_id">Inspection ID</option>
              <option value="asset_id">Asset ID</option>
              <option value="user_id">User ID</option>
            </select>

            <button type="submit" title="Search">
              <FaMagnifyingGlass />
            </button>

            <button
              type="button"
              onClick={() => navigate("/toolbox-inspection")}
            >
              <FaPlus />
            </button>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Inspection ID</th>
                <th>Asset ID</th>
                <th>User ID</th>
                <th>Inspection Time</th>
                <th>Total Tools</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inspections?.length === 0 ? (
                <tr>
                  <td colSpan={7}>No Assets</td>
                </tr>
              ) : null}

              {inspections?.map((t) => (
                <tr key={t?.inspection_id}>
                  <td>{t?.inspection_id}</td>
                  <td>{t?.asset_id}</td>
                  <td>{t?.user_id}</td>
                  <td>{formatedDateFull(t?.inspectionAt)}</td>
                  <td>{t?.tools?.length || 0}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() => handleDownloadExcel(t?.inspection_id)}
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() =>
                          navigate(
                            `/toolbox-inspection/edit/${t?.inspection_id}`
                          )
                        }
                      >
                        <FaPencil />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(t?.inspection_id)}
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
