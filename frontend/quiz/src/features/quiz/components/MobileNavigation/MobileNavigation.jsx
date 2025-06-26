import { MobileNavigationButton } from "@components/ui";

const MobileNavigation = ({
    currentIndex,
    questionsLength,
    onPrevious,
    onNext,
}) => {
    return (
        <div className="mobile-nav" aria-hidden="false">
            <MobileNavigationButton
                direction="prev"
                onClick={onPrevious}
                disabled={currentIndex === 0}
            >
                ← Precedente
            </MobileNavigationButton>
            <MobileNavigationButton
                direction="next"
                onClick={onNext}
                disabled={currentIndex === questionsLength - 1}
            >
                Successiva →
            </MobileNavigationButton>
        </div>
    );
};

export default MobileNavigation;
