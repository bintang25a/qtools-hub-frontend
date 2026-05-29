import { useEffect, useState } from "react";
import DynamicTechnoGrid from "../components/background/DynamicTechnoGrid";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import styles from "../styles/Layout.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import InfoModal from "../components/overlay/InfoModal";
import { me } from "../_services/auth";
import { getAssets } from "../_services/asset";
import { getReports } from "../_services/report";
import { getUsers } from "../_services/user";
import Sidebar from "../components/layout/Sidebar";

export default function PlannerLayout() {
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
    onClose: () => {},
    title: "",
    message: "",
  });

  const [searchData, setSearchData] = useState({
    key: "",
    value: "",
  });

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [reports, setReports] = useState([]);

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

          if (res?.data?.role !== "planner") {
            setInfoModal({
              isOpen: true,
              isError: true,
              title: "Unauthorized",
              message: "Redirect to login",
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

        if (pathaname === "/planner") {
          const [assetsData, reportsData] = await Promise.all([
            getAssets("all=true"),
            getReports("all=true"),
          ]);

          setAssets(assetsData?.data);
          setReports(reportsData?.data);
        } else if (pathaname === "/planner/users") {
          const [usersData] = await Promise.all([getUsers(query)]);

          setUsers(usersData?.data);
          setTotalPage(usersData?.total_page);
          setCurrentPage(usersData?.current_page);
        } else if (pathaname === "/planner/assets") {
          const [assetsData] = await Promise.all([getAssets(query)]);

          setAssets(assetsData?.data);
          setTotalPage(assetsData?.total_page);
          setCurrentPage(assetsData?.current_page);
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
  }, [location.pathname, currentPage, toggleSearch]);

  const handleChangePage = (up = true) => {
    if (up) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
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

  if (isChecking) {
    return <LoadingJump />;
  }

  return (
    <>
      <div className={styles.layout}>
        <Header
          user={user}
          setSidebarOpen={setSidebarOpen}
          hasNotifications={hasNotifications}
        />

        <div className={styles.content}>
          {sidebarOpen && (
            <Sidebar user={user} setSidebarOpen={setSidebarOpen} />
          )}

          <Outlet
            context={{
              firstLoad: {
                isChecking,
                setIsChecking,
                isFirstLoad,
                setIsFirstLoad,
              },
              data: { user, users, assets, reports },
              feature: {
                totalPage,
                currentPage,
                setSearchData,
                handleChangePage,
                handleSearchSubmit,
              },
              overlay: { setIsLoading, setInfoModal },
            }}
          />
        </div>

        <Footer />
      </div>

      {isLoading && <LoadingJump />}
      <DynamicTechnoGrid />
      <InfoModal
        isOpen={infoModal?.isOpen}
        isError={infoModal?.isError}
        onClose={infoModal?.onClose}
        title={infoModal?.title}
        message={infoModal?.message}
      />
    </>
  );
}
