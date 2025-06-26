const MobileNavigationButton = ({
    direction,
    onClick,
    disabled,
    className = "nav-button",
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
