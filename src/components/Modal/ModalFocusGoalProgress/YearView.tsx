import classNames from "classnames";
import { useState, useRef, useEffect } from "react";
import { useThemeContext } from "../../../contexts/useThemeContext";
import { getAllMonths } from "../../../utils/date.utils";

// Year View Component
const YearView = ({
    currentDate,
    setCurrentDate,
    setShowYearView,
}: {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setShowYearView: (value: boolean) => void;
}) => {
    const { chosenColorObj } = useThemeContext();
    const monthsOfYear = getAllMonths(currentDate);
    const [focusedIndex, setFocusedIndex] = useState(currentDate.getMonth());
    const gridRef = useRef<HTMLDivElement>(null);
    const pendingFocusIndex = useRef<number | null>(null);

    useEffect(() => {
        if (pendingFocusIndex.current === null || !gridRef.current) return;
        const idx = pendingFocusIndex.current;
        pendingFocusIndex.current = null;
        setFocusedIndex(idx);
        gridRef.current.querySelectorAll<HTMLButtonElement>('button')[idx]?.focus();
    }, [currentDate]);

    const focusMonth = (index: number) => {
        if (index < 0) {
            pendingFocusIndex.current = 11;
            setCurrentDate(new Date(currentDate.getFullYear() - 1, 11, 1));
        } else if (index > 11) {
            pendingFocusIndex.current = 0;
            setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
        } else {
            setFocusedIndex(index);
            gridRef.current?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus();
        }
    };

    return (
        <div ref={gridRef} className="grid grid-cols-3 gap-2 my-3">
            {monthsOfYear.map((monthDate, i) => {
                const monthName = monthDate.toLocaleString('default', { month: 'short' });
                const isSelected =
                    monthDate.getFullYear() === currentDate.getFullYear() &&
                    monthDate.getMonth() === currentDate.getMonth();

                return (
                    <button
                        key={`${monthName}-${monthDate.getFullYear()}`}
                        type="button"
                        tabIndex={i === focusedIndex ? 0 : -1}
                        aria-pressed={isSelected}
                        aria-label={monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        className="flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                        onFocus={() => setFocusedIndex(i)}
                        onKeyDown={(e) => {
                            switch (e.key) {
                                case 'ArrowRight': e.preventDefault(); focusMonth(i + 1); break;
                                case 'ArrowLeft':  e.preventDefault(); focusMonth(i - 1); break;
                                case 'ArrowDown':  e.preventDefault(); focusMonth(i + 3); break;
                                case 'ArrowUp':    e.preventDefault(); focusMonth(i - 3); break;
                                case 'Home':       e.preventDefault(); focusMonth(0); break;
                                case 'End':        e.preventDefault(); focusMonth(11); break;
                            }
                        }}
                        onClick={() => { setCurrentDate(monthDate); setShowYearView(false); }}
                    >
                        <div
                            className={classNames(
                                'flex justify-center items-center h-[40px] w-[60px] cursor-pointer rounded-full',
                                isSelected ? chosenColorObj.bgColor : 'bg-color-gray-600 hover:bg-color-gray-500'
                            )}
                        >
                            {monthName}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default YearView