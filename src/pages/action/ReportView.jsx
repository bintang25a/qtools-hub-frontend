import styles from "../../styles/Report.module.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

export default function ReportView() {
  const navigate = useNavigate();

  return (
    <div className={styles.paper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.companySection}>
          <img src="/logo-kpp.png" alt="KPP" className={styles.logo} />

          <div className={styles.companyInfo}>
            <div className={styles.companyName}>
              PT KALIMANTAN PRIMA PERSADA
            </div>

            <div className={styles.companySub}>INTEGRATED MINING SERVICES</div>

            <div className={styles.member}>member of ASTRA</div>
          </div>
        </div>

        <div className={styles.documentTitle}>
          <h1>Berita Acara Kehilangan Kerusakan</h1>

          <h2>No : RANT / PLT / 925 / VI / BAKK-2026</h2>
        </div>
      </div>

      {/* Informasi */}
      <div className={styles.infoSection}>
        <div className={styles.leftInfo}>
          <div className={styles.row}>
            <span>BAKK</span>
            <span>:</span>
            <span className={styles.highlight}>925</span>
          </div>

          <div className={styles.row}>
            <span>Pada hari</span>
            <span>:</span>
            <span>Senin</span>
          </div>

          <div className={styles.row}>
            <span>Tanggal</span>
            <span>:</span>
            <span>01-Jun-26</span>
          </div>

          <div className={styles.row}>
            <span>Distrik</span>
            <span>:</span>
            <span>Rantau</span>
          </div>
        </div>
      </div>

      {/* Penanggung Jawab */}
      <div className={styles.personSection}>
        <p>Yang bertanda tangan dibawah ini</p>

        <div className={styles.row}>
          <span>Nama</span>
          <span>:</span>
          <span>Rahmadana</span>
        </div>

        <div className={styles.row}>
          <span>NRP</span>
          <span>:</span>
          <span>KC10019</span>
        </div>

        <div className={styles.row}>
          <span>Jabatan</span>
          <span>:</span>
          <span>Minimex Mekanik</span>
        </div>
      </div>

      <div className={styles.responsibility}>Bertanggung jawab atas</div>

      {/* Tabel */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama Tool</th>
            <th>Spesifikasi</th>
            <th>Merk</th>
            <th>Jumlah</th>
            <th>Kondisi</th>
            <th>Foto_1</th>
            <th>Foto_2</th>
            <th>Keterangan</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Hammer tembaga 5 kg</td>
            <td>MTC 5 kg(655514)</td>
            <td>MTC</td>
            <td>1</td>
            <td>Rusak</td>

            <td>
              <img src="/sample-tool.jpg" alt="" className={styles.toolImage} />
            </td>

            <td></td>

            <td>Palu patah</td>
          </tr>

          <tr>
            <td colSpan="8" className={styles.investigation}>
              <div>Hasil Investigasi :</div>

              <div>Akibat Pemakaian</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}
      <div className={styles.signatureSection}>
        <div className={styles.signatureHeader}>
          <div>Dibuat oleh,</div>
          <div>Diketahui oleh,</div>
        </div>

        <div className={styles.signatureSpace}></div>

        <div className={styles.signatureNames}>
          <div>Plant Group Leader / Requested</div>

          <div>Plant Engineer</div>

          <div>Plant Planner</div>

          <div>
            <div>Ahmad Gapuri</div>

            <div>Plant Sect. Head</div>
          </div>
        </div>
      </div>
    </div>
  );
}
