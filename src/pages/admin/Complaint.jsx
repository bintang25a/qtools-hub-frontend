import { MdFence, MdPerson, MdSearch, MdVisibility } from "react-icons/md";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";
import { showComplaint } from "../../_services/complaints";
import { showUser } from "../../_services/users";

export default function Complaint() {
  const { setIsLoading, setInfoModal, feature, action, data, firstLoad } =
    useOutletContext();

  const { complaintsData } = data;
  const { handleSearchChange, handleSearchSubmit, handleChangePage } = action;
  const { totalPages, currentPage, setCurrentPage, search, setSearch } =
    feature;

  const columns = [
    "complaint_number",
    "customer_id",
    "queue_id",
    "vehicle",
    "license_number",
    "description",
  ];

  const [viewData, SetViewData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);

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

    if (complaintsData) {
      setComplaints(complaintsData);

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
  }, [complaintsData]);

  const handleViewData = async (id, type) => {
    setIsLoading(true);

    const complaintFields = [
      {
        name: "complaint_number",
        label: "Complaint Number",
        type: "text",
      },
      {
        name: "vehicle",
        label: "Vehicle Type",
        type: "text",
        placeholder: "Honda Vario 125",
      },
      {
        name: "license_number",
        label: "Vehicle License Number",
        type: "text",
      },
      {
        name: "description",
        label: "Description",
        type: "text",
      },
      {
        name: "symptoms",
        label: "Customer symptoms apply",
        type: "text",
      },
      {
        name: "diagnosis",
        label: "Vehicle diagnosis result",
        type: "text",
      },
    ];

    const customerFields = [
      {
        name: "uid",
        label: "Customer UID",
        type: "text",
      },
      {
        name: "name",
        label: "Customer Name",
        type: "text",
      },
      {
        name: "email",
        label: "Customer Email",
        type: "text",
      },
      {
        name: "phone_number",
        label: "Customer Phone Number",
        type: "text",
      },
    ];

    const queueFields = [
      {
        name: "id",
        label: "Queue ID",
        type: "text",
      },
      {
        name: "queue_number",
        label: "Queue Number",
        type: "text",
      },
      {
        name: "status",
        label: "Queue Status",
        type: "text",
      },
      {
        name: "mechanic_id",
        label: "Mechanic UID",
        type: "text",
      },
      {
        name: "mechanic_name",
        label: "Mechanic Name",
        type: "text",
      },
      {
        name: "mechanic_email",
        label: "Mechanic Email",
        type: "text",
      },
    ];

    try {
      const response =
        type !== "customer" ? await showComplaint(id) : await showUser(id);

      const data = type === "queue" ? response?.data?.queue : response?.data;
      const symptoms = data?.symptoms?.map((s) => s?.code)?.join(", ");
      const diagnosis = data?.diagnosis
        ?.map((d) => `${d?.code}-${d?.rate}`)
        ?.join(", ");

      SetViewData({
        ...viewData,
        data: { ...data, symptoms, diagnosis },
        fields:
          type === "complaint"
            ? complaintFields
            : type === "customer"
            ? customerFields
            : queueFields,
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

  const handleModalClose = () => {
    setModalOpen(false);
    SetViewData(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2>Complaints Data</h2>

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
          </div>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Complaint Number</th>
                <th>Customer ID</th>
                <th>Queue ID</th>
                <th>Vehicle</th>
                <th>License Number</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints?.map((item) => (
                <tr
                  key={item?.complaint_number}
                  onDoubleClick={() =>
                    handleViewData(item?.complaint_number, "complaint")
                  }
                  title="Double click to view"
                >
                  <td style={{ textAlign: "center" }}>
                    {item?.complaint_number}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {item?.customer_id} - {item?.customer?.name}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {item?.queue_id} - {item?.queue?.queue_number}
                  </td>
                  <td>{item?.vehicle}</td>
                  <td>{item?.license_number}</td>
                  <td>{item?.description}</td>
                  <td>
                    <button
                      title="View complaint"
                      onClick={() =>
                        handleViewData(item?.complaint_number, "complaint")
                      }
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="View Customer"
                      onClick={() =>
                        handleViewData(item?.customer_id, "customer")
                      }
                    >
                      <MdPerson />
                    </button>
                    <button
                      title="View Queue"
                      onClick={() =>
                        handleViewData(item?.complaint_number, "queue")
                      }
                    >
                      <MdFence />
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
          fields={viewData?.fields}
          data={viewData?.data}
          onClose={handleModalClose}
          onSubmit={() => {}}
          isView={true}
        />
      )}
    </div>
  );
}
