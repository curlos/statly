import Icon from "../../Icon";

// Calendar Navigation Component
const CalendarNavigation = ({
    currentDate,
    showYearView,
    setShowYearView,
    monthName,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
}: {
    currentDate: Date;
    showYearView: boolean;
    setShowYearView: (value: boolean) => void;
    monthName: string;
    goToPreviousMonth: () => void;
    goToNextMonth: () => void;
    goToPreviousYear: () => void;
    goToNextYear: () => void;
}) => (
    <>
    <div aria-live="polite" aria-atomic="true" className="sr-only">
        {showYearView ? `${currentDate.getFullYear()}` : `${monthName} ${currentDate.getFullYear()}`}
    </div>
    <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex-1 font-semibold text-lg">
            <button
                type="button"
                className="cursor-pointer bg-transparent border-0 p-0 font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                onClick={() => setShowYearView(!showYearView)}
                aria-pressed={showYearView}
                aria-label={showYearView ? `${currentDate.getFullYear()}, switch to month view` : `${monthName} ${currentDate.getFullYear()}, switch to year view`}
            >
                {showYearView ? `${currentDate.getFullYear()}` : `${monthName} ${currentDate.getFullYear()}`}
            </button>
        </div>
        <div className="flex items-center">
            <button type="button" aria-label="Previous year" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToPreviousYear}>
                <Icon name="keyboard_double_arrow_left" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
            </button>
            <button type="button" aria-label="Previous month" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToPreviousMonth}>
                <Icon name="chevron_left" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
            </button>
            <Icon name="fiber_manual_record" fill={1} customClass={'text-color-gray-25 mt-[-7px] !text-[10px] mx-1'} />
            <button type="button" aria-label="Next month" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToNextMonth}>
                <Icon name="chevron_right" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
            </button>
            <button type="button" aria-label="Next year" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToNextYear}>
                <Icon name="keyboard_double_arrow_right" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
            </button>
        </div>
    </div>
    </>
);

export default CalendarNavigation;