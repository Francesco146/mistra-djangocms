import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <main className={styles.notFoundContainer}>
            <h1 className={styles.notFoundTitle}>404 - Pagina non trovata</h1>
            <p className={styles.notFoundText}>
                La pagina che cerchi non esiste.
            </p>
            <button className={styles.homeButton} onClick={() => navigate("/")}>
                Torna ai quiz disponibili
            </button>
        </main>
    );
}

export default NotFoundPage;
