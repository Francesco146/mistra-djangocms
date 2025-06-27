import styles from "./NavigationButton.module.css";
const NavigationButton = ({ direction, onClick, disabled, children }) => {
    return (
        <button
            className={`${styles.navButton} ${
                styles[`navButton--${direction}`]
            }`}
            onClick={onClick}
            disabled={disabled}
            aria-label={
                direction === "prev"
                    ? "Domanda precedente"
                    : "Domanda successiva"
            }
        >
            {children}
        </button>
    );
};

export default NavigationButton;
