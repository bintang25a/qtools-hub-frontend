import styles from "../../styles/Action.module.css";
import pdfStyles from "../../styles/pdf.module.css?raw";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { pdfDownload } from "../../_services/action";
import logo from "/images/logo/logo-kpp.png";
import { showReport } from "../../_services/report";
import { convertImageToBase64 } from "../../_utilities/ConvertImageTo64";
import { formatedDate } from "../../_utilities/formatedDate";

export default function ReportView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const pdfRef = useRef();

  const [report, setReport] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [reportData] = await Promise.all([showReport(id)]);

      setReport(reportData?.data);
    };

    fetchData();
  }, [id]);

  const handleDownload = async () => {
    try {
      setBtnLoading(true);

      const imgElement = pdfRef.current.querySelector(`.${styles.logo}`);

      if (imgElement) {
        const base64Image = await convertImageToBase64(logo);
        imgElement.src = base64Image;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body{ margin: 0; padding: 0; }
              ${pdfStyles}
            </style>
          </head>
          <body>
            ${pdfRef.current.outerHTML}
          </body>
        </html>
      `;

      const response = await pdfDownload({ html });

      const blob = new Blob([response?.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "BAKK.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <main className={styles.main} path="user">
      <div className={styles.canvas}>
        <div className={`${styles.paper} paper`} ref={pdfRef}>
          <div className={`${styles.textarea} textarea`}>
            <div className={`${styles.header} header`}>
              <img src={logo} alt="KPP" className={`${styles.logo} logo`} />

              <div className={`${styles.title} title`}>
                <h1>Berita Acara Kehilangan Kerusakan</h1>

                <h2>
                  No : {report?.asset?.district} / PLT / {report?.report_id} /
                  VI / BAKK-
                  {formatedDate(report?.createdAt)?.split(" ")[3]}
                </h2>
              </div>
            </div>

            <div className={`${styles.infoSection} infoSection`}>
              <div className={`${styles.divider} divider`}>
                <span>BAKK</span>
                <span>Pada Hari</span>
                <span>Tanggal</span>
                <span>Distrik</span>
              </div>
              <div className={`${styles.divider} divider`}>
                <span> : {report?.report_id}</span>
                <span> : {formatedDate(report?.createdAt)?.split(",")[0]}</span>
                <span>
                  {" : "}
                  {formatedDate(report?.createdAt)
                    ?.split(",")[1]
                    ?.replace(" ", "")}
                </span>
                <span> : {report?.asset?.district}</span>
              </div>
            </div>

            <h3>Yang bertanda tangan di bawah ini</h3>

            <div className={`${styles.infoSection} infoSection`}>
              <div className={`${styles.divider} divider`}>
                <span>Nama</span>
                <span>NRP</span>
                <span>Jabatan</span>
              </div>
              <div className={`${styles.divider} divider`}>
                <span> : {report?.reporter?.name}</span>
                <span> : {report?.reporter_id}</span>
                <span> : {report?.reporter?.section}</span>
              </div>
            </div>

            <h3>Bertanggung jawab atas</h3>

            <table>
              <thead>
                <tr>
                  <th>Tool Detail</th>
                  <th>Deskripsi Kerusakan</th>
                  <th>Remark 1</th>
                  <th>Foto 1</th>
                  {report?.remark2 && <th>Remark 2</th>}
                  {report?.evidence2 && <th>Foto 2</th>}
                  <th>Saran</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{report?.asset?.description}</td>
                  <td>{report?.description}</td>
                  <td>{report?.remark1}</td>
                  <td>
                    <img src={report?.evidence1_url} alt="Foto 1" />
                  </td>
                  {report?.remark2 && <td>{report?.remark2}</td>}
                  {report?.evidence2 && (
                    <td>
                      <img src={report?.evidence1_url1} alt="Foto 1" />
                    </td>
                  )}
                  <td>{report?.follow_up?.toUpperCase()}</td>
                </tr>

                <tr>
                  <td colSpan="7">
                    <div>Hasil Investigasi :</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={`${styles.signatureSection} signatureSection`}>
              <div className={`${styles.signature} signature`}>
                <span>Dibuat oleh,</span>

                <div className={`${styles.persons} persons`}>
                  <div className={`${styles.person} person`}>
                    <span>{report?.groupLeader?.name}</span>
                    <span>Plant Group Leader</span>
                  </div>
                </div>
              </div>

              <div className={`${styles.signature} signature`}>
                <span>Diketahui oleh,</span>

                <div className={`${styles.persons} persons`}>
                  <div className={`${styles.person} person`}>
                    <span>{report?.plantEngineer?.name}</span>
                    <span>Plant Engineer</span>
                  </div>

                  <div className={`${styles.person} person`}>
                    <span>{report?.planner?.name}</span>
                    <span>Plant Planner</span>
                  </div>

                  <div className={`${styles.person} person`}>
                    <span>{report?.sectionHead?.name}</span>
                    <span>Plant Section Head</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className={styles.backBtn}
        onClick={() => navigate(-1, { replace: true })}
        title="Back"
      >
        <FaArrowLeft />
      </button>

      <button
        className={styles.downloadBtn}
        onClick={handleDownload}
        title="Download BAKK"
        disabled={btnLoading}
      >
        <FaDownload />
      </button>
    </main>
  );
}
