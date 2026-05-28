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

  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [reports, setReports] = useState([]);

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
        if (pathaname === "/planner") {
          const [assetsData, reportsData] = await Promise.all([
            getAssets("all=true"),
            getReports("all=true"),
          ]);

          setAssets(assetsData?.data);
          setReports(reportsData?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsChecking(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, [location.pathname]);

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
              data: { user, assets, reports },
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
