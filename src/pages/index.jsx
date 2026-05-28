import { Link } from "react-router-dom";
import InteractiveBackground from "../components/background/interactiveBackground";
import logo from "/images/logo/logo-nobg.png";
import styles from "../styles/LandingPage.module.css";
import {
  FaArrowUpRightFromSquare,
  FaCarSide,
  FaClipboardList,
  FaEnvelope,
  FaInstagram,
  FaLocationPin,
  FaScrewdriverWrench,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa6";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";
import LoadingJump from "../components/overlay/JumpLoading";
import { landingPageData } from "../_services/page";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [resData] = await Promise.all([landingPageData()]);

        setData(resData?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.layout}>
      <Header setIsLoading={setIsLoading} />
      <main className={styles.main}>
        <section className="hero">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <h2>
              Auto<span>Mechanic</span>
            </h2>
          </div>

          <div className="about">
            <p>
              AutoMechanic adalah solusi bengkel digital yang bikin servis
              kendaraan nggak pakai ribet. Lewat sistem ini, kamu bisa pantau
              antrean secara real-time dan tahu estimasi beresnya mobil kamu
              tanpa harus nunggu seharian di bengkel—transparan, praktis, dan
              profesional.
            </p>
          </div>
        </section>

        <section className="statistics">
          <h2>Statistics</h2>

          <div className="card">
            <span>{data?.total_customers}</span>
            <h3>Total Users</h3>
            <FaUsers className="icon" />
          </div>
          <div className="card">
            <span>{data?.total_services}</span>
            <h3>Total Services</h3>
            <FaScrewdriverWrench className="icon" />
          </div>
          <div className="card">
            <span>{data?.current_queue}</span>
            <h3>Current Queue</h3>
            <FaCarSide className="icon" />
          </div>
          <div className="card">
            <span>{data?.today_queue}</span>
            <h3>Today Queue</h3>
            <FaClipboardList className="icon" />
          </div>
        </section>

        <section className="join">
          <h2>Ready to trust your vehicle with us?</h2>
          <p>
            Waktunya daftarkan dirimu menuju bengkel digital yang praktis,
            transparan serta profesional
          </p>
          <Link to={"register"}>
            Register now
            <FaArrowUpRightFromSquare />
          </Link>
        </section>

        <section className="information">
          <h2>Contact Us</h2>

          <a href="https://www.stardevs.my.id" target="_blank">
            <FaWhatsapp className="icon" /> 082111223344
          </a>
          <a href="https://www.stardevs.my.id" target="_blank">
            <FaEnvelope className="icon" /> automechanic@gmail.com
          </a>
          <a href="https://www.stardevs.my.id" target="_blank">
            <FaInstagram className="icon" /> @automechanic
          </a>
          <a href="https://www.stardevs.my.id" target="_blank">
            <FaLocationPin className="icon" /> JL Perkasa Timur Keras no 40
          </a>
        </section>
      </main>

      <Footer />
      <InteractiveBackground />
      {isLoading && <LoadingJump />}
    </div>
  );
}
