import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import LoadingJump from "../components/overlay/JumpLoading";
import styles from "../styles/Layout.module.css";
import Sidebar from "../components/layout/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import InfoModal from "../components/overlay/InfoModal";
import ConfirmModal from "../components/overlay/ConfirmModal";
import { me } from "../_services/auth";
import { getUsers } from "../_services/users";
import { getComplaints } from "../_services/complaints";
import { getSymptoms } from "../_services/symptoms";
import { getDamages } from "../_services/damages";
import { adminPageRules } from "../_services/page";
import { getCurrentQ } from "../_services/queues";

export default function AdminLayout() {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screenSize, setScreenSize] = useState("");
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
    title: "",
    message: "",
  });

  useEffect(() => {
    setIsChecking(true);

    const updateScreenSize = () => {
      setScreenSize(window.innerWidth);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const [user, setUser] = useState(null);
  const [queue, setQueue] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastLocation, setlastLocation] = useState("");

  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [damages, setDamages] = useState([]);
  const [rules, setRules] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState({
    column: "",
    value: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isChecking) {
        try {
          const userData = await me();

          const temp = userData?.data?.role;
          if (temp !== "admin" || !userData) {
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

      if (window.innerWidth < 960) {
        return () => {
          setIsLoading(false);
          setIsChecking(false);
        };
      }

      try {
        setlastLocation(location?.pathname);

        const query = [];
        query.push(`page=${currentPage}`);

        const changePage = lastLocation !== location?.pathname;
        const isEmpty = !search?.value || !search?.column;

        if (!isEmpty && !changePage) {
          query.push(isEmpty ? "" : `${search?.column}=${search?.value}`);
        }

        if (location?.pathname === "/admin") {
          const usersQuery = [...query];

          const complaintsQuery = [...query, `per_page=10`];

          const [usersData, complaintsData, queueData] = await Promise.all([
            getUsers(usersQuery?.join("&")),
            getComplaints(complaintsQuery?.join("&")),
            getCurrentQ(),
          ]);

          setUsers(usersData?.data);
          setComplaints(complaintsData?.data);
          setQueue(queueData?.data);
        } else if (location?.pathname === "/admin/users") {
          query.push(`per_page=20`);

          const [usersData] = await Promise.all([getUsers(query?.join("&"))]);

          setUsers(usersData?.data);
          setCurrentPage(usersData?.current_page);
          setTotalPages(Math.ceil(Number(usersData?.total) / 20));
        } else if (location?.pathname === "/admin/queues") {
          query.push(`per_page=20`);

          const [complaintsData] = await Promise.all([
            getComplaints(query?.join("&")),
          ]);

          setComplaints(complaintsData?.data);
          setCurrentPage(complaintsData?.current_page);
          setTotalPages(Math.ceil(Number(complaintsData?.total) / 20));
        } else if (location?.pathname === "/admin/complaints") {
          query.push(`per_page=20`);

          const [complaintsData] = await Promise.all([
            getComplaints(query?.join("&")),
          ]);

          setComplaints(complaintsData?.data);
          setCurrentPage(complaintsData?.current_page);
          setTotalPages(Math.ceil(Number(complaintsData?.total) / 20));
        } else if (location?.pathname === "/admin/symptoms") {
          query.push(`per_page=20`);

          const [symptomsData] = await Promise.all([
            getSymptoms(query?.join("&")),
          ]);

          setSymptoms(symptomsData?.data);
          setCurrentPage(symptomsData?.current_page);
          setTotalPages(Math.ceil(Number(symptomsData?.total) / 20));
        } else if (location?.pathname === "/admin/damages") {
          query.push(`per_page=20`);

          const [damagesData] = await Promise.all([
            getDamages(query?.join("&")),
          ]);

          setDamages(damagesData?.data);
          setCurrentPage(damagesData?.current_page);
          setTotalPages(Math.ceil(Number(damagesData?.total) / 20));
        } else if (location?.pathname === "/admin/rules") {
          const [rulesData] = await Promise.all([adminPageRules()]);

          setRules(rulesData);
          setCurrentPage(1);
          setTotalPages(1);
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
  }, [location?.pathname, refresh, currentPage]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setCurrentPage(1);
    setRefresh(!refresh);
  };

  const handleChangePage = async (isNext) => {
    setIsLoading(true);

    let page = isNext ? currentPage + 1 : currentPage - 1;

    setCurrentPage(page);
  };

  if (screenSize < 960) {
    return (
      <InfoModal
        isOpen={true}
        isError={true}
        onClose={() => navigate("/", { replace: true })}
        title={"Screen size is too small"}
        message={"Please extend width of your browser or device screen"}
      />
    );
  }

  if (isChecking) {
    return <LoadingJump />;
  }

  return (
    <>
      <div className={styles?.adminLayout}>
        <Header
          setIsLoading={setIsLoading}
          setRefresh={setRefresh}
          userData={user}
        />
        <main className={styles.main}>
          <Sidebar />
          <Outlet
            context={{
              setIsLoading,
              setInfoModal,
              setConfirmModal,
              firstLoad: { isFirstLoad, setIsFirstLoad },
              action: {
                handleSearchChange,
                handleSearchSubmit,
                handleChangePage,
              },
              feature: {
                totalPages,
                currentPage,
                setCurrentPage,
                search,
                setSearch,
              },
              data: {
                usersData: users,
                complaintsData: complaints,
                symptomsData: symptoms,
                damagesData: damages,
                rulesData: rules,
                queueData: queue,
              },
            }}
          />
        </main>
        <Footer />
      </div>

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
        onClose={() => setInfoModal({ isOpen: false })}
        title={infoModal?.title}
        message={infoModal?.message}
      />
    </>
  );
}
