import styles from "./MobileNavigationButton.module.css";
const MobileNavigationButton = ({
    direction,
    onClick,
    disabled,
    className = styles.navButton,
    children,
}) => {
    const ariaLabel =
        direction === "prev" ? "Domanda precedente" : "Prossima domanda";

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};

export default MobileNavigationButton;
