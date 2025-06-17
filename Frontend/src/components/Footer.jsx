import styles from "../style/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>About</h3>
          <p>
            This is a freelance marketplace platform. Connect with professionals
            across domains and get your work done efficiently.
          </p>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Works</a>
            </li>
            <li>
              <a>Freelancers</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <p>Email: support@freelancehub.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} FreelanceHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
