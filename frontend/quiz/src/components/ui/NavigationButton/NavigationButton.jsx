const NavigationButton = ({ direction, onClick, disabled, children }) => {
    return (
        <button
            className={`nav-button nav-button--${direction}`}
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
