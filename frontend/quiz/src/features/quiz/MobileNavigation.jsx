import NavigationButton from "./NavigationButton";

const MobileNavigation = ({
    currentIndex,
    questionsLength,
    onPrevious,
    onNext,
}) => {
    return (
        <div className="mobile-nav" aria-hidden="false">
            <NavigationButton
                direction="prev"
                onClick={onPrevious}
                disabled={currentIndex === 0}
            >
                ← Precedente
            </NavigationButton>
            <NavigationButton
                direction="next"
                onClick={onNext}
                disabled={currentIndex === questionsLength - 1}
            >
                Successiva →
            </NavigationButton>
        </div>
    );
};

export default MobileNavigation;
