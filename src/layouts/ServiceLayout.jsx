import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/Layout.module.css";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import ConfirmModal from "../components/overlay/ConfirmModal";
import InfoModal from "../components/overlay/InfoModal";
import { showComplaint } from "../_services/complaints";
import { getSymptoms } from "../_services/symptoms";
import { getDamages } from "../_services/damages";
import { getRules } from "../_services/rules";
import { getCurrentQ } from "../_services/queues";
import { me } from "../_services/auth";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function ServiceLayout() {
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

  const [user, setUser] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [damages, setDamages] = useState([]);
  const [rules, setRules] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setIsChecking(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let tempRole = user?.role;

      if (isChecking) {
        try {
          const userData = await me();

          const temp = userData?.data?.role;
          if (temp === "staff" || !userData) {
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

          tempRole = temp;
          setUser(userData?.data);

          const rightDashboard =
            location?.pathname?.includes("/service") && tempRole === "mechanic";

          if (rightDashboard) {
            navigate("/mechanic", { replace: true });
          }
        } catch (error) {
          console.error("Gagal ambil user", error);
        }
      }

      try {
        const isDashboard =
          location?.pathname === "/service" ||
          location?.pathname === "/mechanic";

        const pathRole = tempRole === "mechanic" ? "/mechanic" : "/service";

        if (isDashboard) {
          const [currentQdata] = await Promise.all([getCurrentQ()]);

          setCurrentQ(currentQdata?.data);
        } else if (location?.pathname?.includes(`${pathRole}/status`)) {
          const complaintNumber = id
            ? id
            : localStorage.getItem("complaint_number");

          const [complaintData] = await Promise.all([
            showComplaint(complaintNumber),
          ]);

          const tempComplaint = complaintData?.data;
          const operator1 = location?.pathname?.includes(`${pathRole}/status/`);
          const operator2 = tempComplaint?.queue?.status === "done";
          if (operator2 && !operator1) {
            navigate(`/service/status/${tempComplaint?.complaint_number}`);
          }

          setComplaint(complaintData?.data);
        } else if (location?.pathname === "/service/add") {
          const [symptomsData] = await Promise.all([getSymptoms("")]);

          setSymptoms(symptomsData?.data);
        } else if (location?.pathname === `${pathRole}/diagnosis`) {
          const [symptomsData, damagesData, rulesData] = await Promise.all([
            getSymptoms(""),
            getDamages(""),
            getRules(""),
          ]);

          setSymptoms(symptomsData?.data);
          setDamages(damagesData?.data);
          setRules(rulesData?.data);
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
  }, [location]);

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
            isChecking,
            firstLoad: { isFirstLoad, setIsFirstLoad },
            data: {
              userData: user,
              currentQdata: currentQ,
              complaintData: complaint,
              symptomsData: symptoms,
              damagesData: damages,
              rulesData: rules,
            },
          }}
        />
        <Footer />
      </div>

      <ScrollToTop />
      <InteractiveBackground />
      {isLoading && <LoadingJump />}
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
