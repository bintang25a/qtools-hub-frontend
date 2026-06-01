import { useEffect, useState } from "react";
import DynamicTechnoGrid from "../components/background/DynamicTechnoGrid";
import styles from "../styles/Layout.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import ConfirmModal from "../components/overlay/ConfirmModal";
import InfoModal from "../components/overlay/InfoModal";
import { me } from "../_services/auth";
import { getUsers } from "../_services/user";
import { getAssets } from "../_services/asset";
import { getReports } from "../_services/report";
import { getRepairs } from "../_services/repair";
import { getTransactions } from "../_services/transaction";
import FormModal from "../components/overlay/FormModal";
import BottomNavbar from "../components/layout/BottomNavbar";

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasNotifications, setHasNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
    onClose: () => {},
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onCancel: () => {},
    onSubmit: () => {},
  });

  const [formModal, setFormModal] = useState({
    isOpen: false,
    fields: [],
    data: null,
    onSubmit: () => {},
    onClose: () => {},
  });

  const [searchData, setSearchData] = useState({
    key: "",
    value: "",
  });

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [reports, setReports] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [toggleSearch, setToggleSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    setIsChecking(true);
    setHasNotifications(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const pathaname = location.pathname;

      if (isChecking) {
        setIsLoading(true);

        const onClose = () => {
          setInfoModal({ ...infoModal, isOpen: false });
          navigate("/login", { replace: true });
        };

        try {
          const res = await me();

          const condition =
            res?.data?.role === "planner" || res?.data?.role === "tool keeper";

          if (condition) {
            setInfoModal({
              isOpen: true,
              isError: true,
              title: "Unauthorized",
              message: "Redirect to actual path",
              onClose: onClose,
            });
          }

          setUser(res?.data);
        } catch (error) {
          console.log(error);
        }
      }

      try {
        setIsLoading(true);

        const queryArray = [];
        queryArray.push(`page=${currentPage}`);

        if (searchData?.key && searchData?.value) {
          queryArray.push(`${searchData?.key}=${searchData?.value}`);
        }

        const query = queryArray?.join("&");

        if (pathaname === "/asset-borrow") {
          const [assetsData] = await Promise.all([getAssets("limit=50")]);

          setAssets(assetsData?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsChecking(false);
        setIsLoading(false);
      }
    };

    fetchData();
    setSidebarOpen(false);

    // eslint-disable-next-line
  }, [currentPage, toggleSearch]);

  const handleChangePage = (position = true) => {
    if (Number.isInteger(position)) {
      setCurrentPage(Number(position));
    } else if (position == true) {
      setCurrentPage(currentPage + 1);
    } else if (position == false) {
      setCurrentPage(currentPage - 1);
    } else if (currentPage === 1) {
      setToggleSearch(!toggleSearch);
    } else {
      setCurrentPage(1);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchData?.key || !searchData?.value) {
      return;
    }

    setToggleSearch(!toggleSearch);
    setCurrentPage(1);
  };

  const handleChangePath = ({ path, data = null }) => {
    navigate(`${path}`, { state: data });
  };

  if (isChecking) {
    return <LoadingJump />;
  }

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.content}>
          <Outlet
            context={{
              data: {
                user,
                users,
                assets,
                transactions,
                reports,
                repairs,
              },
              firstLoad: {
                isChecking,
                setIsChecking,
                isFirstLoad,
                setIsFirstLoad,
              },
              feature: {
                totalPage,
                currentPage,
                setSearchData,
                handleChangePath,
                handleChangePage,
                handleSearchSubmit,
              },
              overlay: {
                setIsLoading,
                setInfoModal,
                setConfirmModal,
                setFormModal,
              },
            }}
          />
        </div>

        <BottomNavbar />
        {/* <Footer /> */}
      </div>

      {isLoading && <LoadingJump />}
      <DynamicTechnoGrid />
      <InfoModal
        isOpen={infoModal?.isOpen}
        isError={infoModal?.isError}
        title={infoModal?.title}
        message={infoModal?.message}
        onClose={infoModal?.onClose}
      />
      <ConfirmModal
        isOpen={confirmModal?.isOpen}
        title={confirmModal?.title}
        message={confirmModal?.message}
        onCancel={confirmModal?.onCancel}
        onSubmit={confirmModal?.onSubmit}
      />
      {formModal?.isOpen && (
        <FormModal
          fields={formModal?.fields}
          data={formModal?.data}
          onClose={formModal?.onClose}
          onSubmit={formModal?.onSubmit}
        />
      )}
    </>
  );
}
