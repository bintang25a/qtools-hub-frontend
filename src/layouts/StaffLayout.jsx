import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/Layout.module.css";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import ConfirmModal from "../components/overlay/ConfirmModal";
import InfoModal from "../components/overlay/InfoModal";
import { me } from "../_services/auth";
import { getQueues } from "../_services/queues";
import { showComplaint } from "../_services/complaints";
import { getUsers } from "../_services/users";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function StaffLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    onCancel: () => {},
    onSubmit: () => {},
    title: "",
    message: "",
  });
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    isError: false,
    onClose: null,
    title: "",
    message: "",
  });

  useEffect(() => {
    setIsChecking(true);
  }, []);

  const [user, setUser] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [queues, setQueues] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [status, setStatus] = useState("waiting");

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (isChecking) {
        try {
          const userData = await me();

          const temp = userData?.data?.role;
          if ((temp !== "staff" && temp !== "admin") || !userData) {
            const onClose = () => {
              setInfoModal({ ...infoModal, isOpen: false });

              navigate("/");
            };

            setInfoModal({
              isOpen: true,
              isError: true,
              onClose,
              title: "Unauthorized",
              message: "Redirect to Home Page",
            });
          }

          setUser(userData?.data);
        } catch (error) {
          console.error("Gagal ambil user", error);
        }
      }

      try {
        if (location?.pathname === "/staff") {
          const [queueData] = await Promise.all([
            getQueues(`status=${status}`),
          ]);

          setQueues(queueData?.data);
        } else if (location?.pathname?.includes("/staff/")) {
          const complaintNumber = id;

          const [complaintData, usersData] = await Promise.all([
            showComplaint(complaintNumber),
            getUsers("role=mechanic"),
          ]);

          setComplaint(complaintData?.data);
          setMechanics(usersData?.data);
        }
      } catch (error) {
        console.log(error);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Get data failed",
          message: error?.message,
        });
      } finally {
        setIsChecking(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, [location?.pathname, status]);

  if (isChecking) {
    return <LoadingJump />;
  }

  return (
    <>
      <div className={styles.serviceLayout}>
        <Header
          setIsLoading={setIsLoading}
          setRefresh={() => {}}
          userData={user}
        />
        <Outlet
          context={{
            setIsLoading,
            setConfirmModal,
            setInfoModal,
            setStatus,
            status,
            isChecking,
            firstLoad: { isFirstLoad, setIsFirstLoad },
            data: {
              userData: user,
              complaintData: complaint,
              queuesData: queues,
              mechanicsData: mechanics,
            },
          }}
        />
        <Footer />
      </div>

      <ScrollToTop />
      {isLoading && <LoadingJump />}
      <InteractiveBackground />
      <ConfirmModal
        isOpen={confirmModal?.isOpen}
        onCancel={confirmModal?.onCancel}
        onSubmit={confirmModal?.onSubmit}
        title={confirmModal?.title}
        message={confirmModal?.message}
      />
      <InfoModal
        isOpen={infoModal?.isOpen}
        isError={infoModal?.isError}
        onClose={
          infoModal?.onClose
            ? infoModal?.onClose
            : () => setInfoModal({ isOpen: false })
        }
        title={infoModal?.title}
        message={infoModal?.message}
      />
    </>
  );
}
