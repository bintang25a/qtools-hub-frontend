import { useEffect } from "react";
import styles from "../../styles/Planner.module.css";
import { useOutletContext } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaMagnifyingGlass,
  FaPencil,
  FaTrash,
  FaUser,
} from "react-icons/fa6";
import { deleteUser } from "../../_services/user";

export default function Users() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { setIsLoading, setInfoModal, setConfirmModal } = overlay;
  const { users } = data;
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

    if (users) {
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
  }, [users]);

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

        await deleteUser(id);

        setInfoModal({
          isOpen: true,
          title: "Successfully",
          message: `Delete user with id ${id} successfully`,
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
          <FaUser className={styles.titleIcon} /> Users Data
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
              <option value="nrp">NRP</option>
              <option value="name">Name</option>
              <option value="role">Role</option>
            </select>

            <button type="submit" title="Search">
              <FaMagnifyingGlass />
            </button>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>NRP</th>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={4}>No Users</td>
                </tr>
              ) : null}

              {users?.map((u) => (
                <tr key={u?.nrp}>
                  <td>{u?.nrp}</td>
                  <td>{u?.name}</td>
                  <td>{u?.role}</td>
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() => handleChangePath("users/view", u?.nrp)}
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => handleChangePath("users/edit", u?.nrp)}
                      >
                        <FaPencil />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(u?.nrp)}
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
