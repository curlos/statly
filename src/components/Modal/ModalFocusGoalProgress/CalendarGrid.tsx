import { useState, useRef, useEffect } from "react";
import { formatDateAsAPIKey, areDatesEqual } from "../../../utils/date.utils";
import { getFormattedDuration } from "../../../utils/helpers.utils";
import Icon from "../../Icon";
import FocusGoalCalendarDay from "../FocusGoalCalendarDay";
import { CombinedRing } from "./types";

// Calendar Grid Component
const CalendarGrid = ({
    mode,
    currentDate,
    setCurrentDate,
    dailyDurationsMap,
    themeColor,
    goalSeconds,
    ringColor,
    useThemeColor,
    selectedDaysOfWeek,
    restDays,
    customDailyFocusGoal,
    inactivePeriods,
    rings,
    focusGridOnMount,
}: {
    mode: 'single' | 'combined';
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    dailyDurationsMap?: { [dateKey: string]: number };
    themeColor: string;
    goalSeconds: number;
    ringColor?: string | null;
    useThemeColor?: boolean;
    selectedDaysOfWeek: Record<string, boolean>;
    restDays: Record<string, boolean>;
    customDailyFocusGoal: Record<string, number>;
    inactivePeriods: Array<{ startDate: string; endDate: string | null }>;
    rings?: CombinedRing[];
    focusGridOnMount?: React.MutableRefObject<boolean>;
}) => {
    const getDefaultFocusDate = (date: Date) => {
        const today = new Date();
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth()) {
            return today;
        }
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const [focusedDate, setFocusedDate] = useState<Date>(() => getDefaultFocusDate(currentDate));
    const gridRef = useRef<HTMLDivElement>(null);
    const pendingFocusKey = useRef<string | null>(null);

    // After returning from YearView, focus the default day button on mount
    useEffect(() => {
        if (!focusGridOnMount?.current || !gridRef.current) return;
        focusGridOnMount.current = false;
        const target = getDefaultFocusDate(currentDate);
        const key = `${target.getFullYear()}-${target.getMonth()}-${target.getDate()}`;
        gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!pendingFocusKey.current || !gridRef.current) return;
        const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${pendingFocusKey.current}"]`);
        if (btn) { pendingFocusKey.current = null; btn.focus(); }
    }, [currentDate]);

    useEffect(() => {
        if (pendingFocusKey.current !== null) return;
        setFocusedDate(getDefaultFocusDate(currentDate));
    }, [currentDate]);

    const handleKeyDown = (day: Date) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const y = day.getFullYear(), m = day.getMonth(), d = day.getDate();
        let newDate: Date | null = null;
        switch (e.key) {
            case 'ArrowRight': e.preventDefault(); newDate = new Date(y, m, d + 1); break;
            case 'ArrowLeft':  e.preventDefault(); newDate = new Date(y, m, d - 1); break;
            case 'ArrowDown':  e.preventDefault(); newDate = new Date(y, m, d + 7); break;
            case 'ArrowUp':    e.preventDefault(); newDate = new Date(y, m, d - 7); break;
            case 'Home':       e.preventDefault(); newDate = new Date(y, m, d - (day.getDay() + 6) % 7); break;
            case 'End':        e.preventDefault(); newDate = new Date(y, m, d + (7 - day.getDay()) % 7); break;
            case 'PageUp':     e.preventDefault(); newDate = new Date(y, m - 1, d); break;
            case 'PageDown':   e.preventDefault(); newDate = new Date(y, m + 1, d); break;
        }
        if (newDate) {
            const key = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
            const isSameMonth = newDate.getMonth() === currentDate.getMonth() && newDate.getFullYear() === currentDate.getFullYear();
            setFocusedDate(newDate);
            if (isSameMonth) {
                gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus();
            } else {
                pendingFocusKey.current = key;
                setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }
        }
    };

    // Determine which color to use for the ring
    const ringDisplayColor = useThemeColor ? themeColor : (ringColor || themeColor);

    // Get first day of month and last day
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Create array of all days in month
    const daysInMonth = lastDay.getDate();
    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day, 12, 0, 0));
    }

    // Map day headers to selectedDaysOfWeek keys
    const dayHeaders = [
        { label: 'Mo', key: 'monday' },
        { label: 'Tu', key: 'tuesday' },
        { label: 'We', key: 'wednesday' },
        { label: 'Th', key: 'thursday' },
        { label: 'Fr', key: 'friday' },
        { label: 'Sa', key: 'saturday' },
        { label: 'Su', key: 'sunday' },
    ];

    return (
        <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm text-color-gray-25 mb-2">
                {dayHeaders.map(({ label, key }) => {
                    const isDaySelected = selectedDaysOfWeek?.[key] ?? true;
                    const isFreebieDay = !isDaySelected;

                    return (
                        <div key={label} className="flex items-center justify-center gap-1">
                            <span>{label}</span>
                            {isFreebieDay && (
                                <Icon
                                    name="featured_seasonal_and_gifts"
                                    fill={1}
                                    customClass="!text-[14px] text-sky-300"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Calendar grid */}
            <div ref={gridRef} className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className={mode === 'combined' ? 'w-[50px] h-[50px]' : 'w-[40px] h-[40px]'}></div>;
                    }

                    const dateKey = formatDateAsAPIKey(day);
                    const isFocused = areDatesEqual(day, focusedDate);
                    const navKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                    const dateLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                    if (mode === 'combined' && rings) {
                        // Multi-ring mode: prepare data for each ring
                        const ringsData = rings.map(ring => {
                            const duration = ring.dailyDurationsMap?.[dateKey] || 0;
                            const customGoalForDay = ring.customDailyFocusGoal?.[dateKey];
                            const goalForDay = customGoalForDay !== undefined ? customGoalForDay : (ring.goalSeconds || 3600);
                            const percentage = (duration / goalForDay) * 100;

                            return {
                                ringId: ring.ringId,
                                ringName: ring.ringName,
                                color: ring.ringColor,
                                useThemeColor: ring.useThemeColor,
                                duration,
                                goal: goalForDay,
                                percentage,
                                restDays: ring.restDays || {},
                                selectedDaysOfWeek: ring.selectedDaysOfWeek || {},
                                customDailyFocusGoal: ring.customDailyFocusGoal || {},
                                inactivePeriods: ring.inactivePeriods || [],
                            };
                        });

                        const ringsInfo = ringsData.map(r =>
                            `${r.ringName}: ${getFormattedDuration(r.duration, false)} / ${getFormattedDuration(r.goal, false)} (${r.percentage.toFixed(2)}%)`
                        ).join(', ');
                        const ariaLabel = `${dateLabel} - ${ringsInfo}`;

                        return (
                            <button
                                key={index}
                                type="button"
                                data-date={navKey}
                                tabIndex={isFocused ? 0 : -1}
                                aria-label={ariaLabel}
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                                onFocus={(e) => {
                                    setFocusedDate(day);
                                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                                        (e.currentTarget.firstElementChild as HTMLElement | null)?.focus();
                                    }
                                }}
                                onKeyDown={handleKeyDown(day)}
                            >
                                <FocusGoalCalendarDay
                                    mode="combined"
                                    day={day}
                                    dateKey={dateKey}
                                    themeColor={themeColor}
                                    ringsData={ringsData}
                                    tabIndex={-1}
                                />
                            </button>
                        );
                    } else {
                        // Single ring mode: existing logic
                        const totalFocusDurationForDay = dailyDurationsMap?.[dateKey] || 0;
                        const customGoalForDay = customDailyFocusGoal?.[dateKey];
                        const goalForDay = customGoalForDay !== undefined ? customGoalForDay : goalSeconds;
                        const percentageOfFocusedGoalHours = (totalFocusDurationForDay / goalForDay) * 100;
                        const ariaLabel = `${dateLabel} - ${getFormattedDuration(totalFocusDurationForDay, false)} / ${getFormattedDuration(goalForDay, false)} - ${percentageOfFocusedGoalHours.toFixed(2)}%`;

                        const dayData = {
                            goalSeconds: goalForDay,
                            totalFocusDurationForDay,
                            percentageOfFocusedGoalHours,
                        };

                        return (
                            <button
                                key={index}
                                type="button"
                                data-date={navKey}
                                tabIndex={isFocused ? 0 : -1}
                                aria-label={ariaLabel}
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                                onFocus={(e) => {
                                    setFocusedDate(day);
                                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                                        (e.currentTarget.firstElementChild as HTMLElement | null)?.focus();
                                    }
                                }}
                                onKeyDown={handleKeyDown(day)}
                            >
                                <FocusGoalCalendarDay
                                    mode="single"
                                    day={day}
                                    dayData={dayData}
                                    themeColor={ringDisplayColor}
                                    goalSeconds={goalSeconds}
                                    restDays={restDays}
                                    dateKey={dateKey}
                                    selectedDaysOfWeek={selectedDaysOfWeek as unknown as Record<string, boolean>}
                                    customDailyFocusGoal={customDailyFocusGoal}
                                    inactivePeriods={inactivePeriods}
                                    tabIndex={-1}
                                />
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default CalendarGrid