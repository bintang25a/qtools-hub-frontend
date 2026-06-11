import { useEffect, useState } from "react";
import DynamicTechnoGrid from "../components/background/DynamicTechnoGrid";
import styles from "../styles/Layout.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import ConfirmModal from "../components/overlay/ConfirmModal";
import InfoModal from "../components/overlay/InfoModal";
import { me } from "../_services/auth";
import { getAssets } from "../_services/asset";
import FormModal from "../components/overlay/FormModal";
import BottomNavbar from "../components/layout/BottomNavbar";
import UserHeader from "../components/layout/UserHeader";
import { getTransactionsByUser } from "../_services/transaction";
import { getUsers } from "../_services/user";
import { getReportsByUser } from "../_services/report";

export default function UserLayout() {
  const location = useLocation();

  const [hasNotifications, setHasNotifications] = useState(false);
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

  const tempUser = localStorage.getItem("user");
  const userParse = tempUser ? JSON.parse(tempUser) : {};

  const [user, setUser] = useState(userParse || {});
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [reports, setReports] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [toggleSearch, setToggleSearch] = useState(false);

  useEffect(() => {
    setIsChecking(true);
    setHasNotifications(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const pathname = location.pathname;

      if (isChecking) {
        setIsLoading(true);

        try {
          const res = await me();

          setUser(res?.data);
        } catch (error) {
          console.log(error);
        }
      }

      try {
        setIsLoading(true);

        const queryArray = [];

        if (searchData?.key && searchData?.value) {
          queryArray.push(`${searchData?.key}=${searchData?.value}`);
        }

        const query = queryArray?.join("&");

        if (pathname === "/asset-loan") {
          const [assetsData] = await Promise.all([getAssets("limit=50")]);

          setAssets(assetsData?.data);
        } else if (pathname === "/asset-return") {
          const [transactionsData] = await Promise.all([
            getTransactionsByUser(`user_id=${user?.nrp}`),
          ]);

          setTransactions(transactionsData?.data);
        } else if (pathname === "/asset-report") {
          const [assetsData, usersData] = await Promise.all([
            getAssets("limit=50"),
            getUsers("all=true"),
          ]);

          setAssets(assetsData?.data);
          setUsers(usersData?.data);
        } else if (pathname === "/") {
          const [transactionsData, reportsData] = await Promise.all([
            getTransactionsByUser(`user_id=${user?.nrp}`),
            getReportsByUser(`user_id=${user?.nrp}`),
          ]);

          setTransactions(transactionsData?.data);
          setReports(reportsData?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsChecking(false);
        setIsLoading(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, [toggleSearch, location?.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchData?.key || !searchData?.value) {
      return;
    }

    setToggleSearch(!toggleSearch);
  };

  if (isChecking) {
    return <LoadingJump />;
  }

  return (
    <>
      <div className={styles.layout}>
        <UserHeader user={user} hasNotifications={hasNotifications} />
        <div className={styles.content}>
          <BottomNavbar />

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
                setSearchData,
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
