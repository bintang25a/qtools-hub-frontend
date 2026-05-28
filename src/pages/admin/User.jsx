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
  createUser,
  deleteUser,
  showUser,
  updateUser,
} from "../../_services/users";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";
import { formatedDate } from "../../_utilities/formatedDate";

export default function User() {
  const {
    setIsLoading,
    setInfoModal,
    setConfirmModal,
    feature,
    action,
    data,
    firstLoad,
  } = useOutletContext();

  const { usersData } = data;
  const { handleSearchChange, handleSearchSubmit, handleChangePage } = action;
  const { totalPages, currentPage, setCurrentPage, search, setSearch } =
    feature;

  const columns = ["uid", "name", "email", "phone_number", "role"];

  const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

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

    if (usersData) {
      setUsers(usersData);

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
  }, [usersData]);

  const fields = [
    {
      name: "photo",
      label: "Photo",
      type: !isView ? "file" : "text",
      placeholder: "Photo",
    },
    {
      name: "uid",
      label: "UID",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "phone_number",
      label: "Whatsapp Number",
      type: "numeric",
    },
    {
      name: "role",
      label: "Select Role",
      type: "select",
      options: [
        {
          name: "Admin",
          value: "admin",
        },
        {
          name: "Staff",
          value: "staff",
        },
        {
          name: "Customer",
          value: "customer",
        },
        {
          name: "Mechanic",
          value: "mechanic",
        },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "text",
    },
  ];

  const handleFetchUser = async (id, view = false) => {
    setIsLoading(true);

    try {
      const response = await showUser(id);

      setIsView(view ? true : false);
      setEditData(response?.data);
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

    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          payload.append(key, value);
        }
      });
    }

    if (editData) {
      payload.append("_method", "PUT");
    }

    try {
      const response = !editData
        ? await createUser(payload)
        : await updateUser(editData?.uid, payload);

      if (editData) {
        const tempUsers = [...users];

        const userIdx = tempUsers.findIndex(
          (user) => user?.uid === editData?.uid
        );

        if (userIdx !== -1) {
          tempUsers[userIdx] = response?.data;
          setUsers(tempUsers);
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
        const response = await deleteUser(id);

        setUsers(users?.filter((u) => u?.uid !== id));

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
        <h2>Users Data</h2>

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
                <th>UID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user?.uid}
                  onDoubleClick={() => handleFetchUser(user?.uid, true)}
                  title="Double click to view"
                >
                  <td>{user?.uid}</td>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.phone_number}</td>
                  <td>{user?.role}</td>
                  <td>{formatedDate(user?.email_verified_at)}</td>
                  <td>
                    <button
                      title="View"
                      onClick={() => handleFetchUser(user?.uid, true)}
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => handleFetchUser(user?.uid)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(user?.uid)}
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
          fields={fields}
          data={editData}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          isView={isView}
        />
      )}
    </div>
  );
}
