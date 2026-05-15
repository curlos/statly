import classNames from "classnames";
import Icon from "../../Icon";
import { formatDateWithoutTimezone } from "../../../utils/date.utils";
import { Streak } from "./types";

// Streak Display Component
const StreakDisplay = ({
    title,
    streak,
    iconName,
    iconColor,
}: {
    title: string;
    streak?: Streak;
    iconName: string;
    iconColor: string;
}) => (
    <div role="group" aria-label={title} className="bg-color-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-2 text-color-gray-25">
            <span>{title}</span>
            <Icon name={iconName} customClass={classNames(iconColor, '!text-[24px]')} />
        </div>
        <div className="text-2xl font-bold mb-1">{streak?.days || 0} Days</div>
        {streak?.from && streak?.to && (
            <div
                className="text-color-gray-25 text-xs"
                aria-label={`${formatDateWithoutTimezone(streak.from)} to ${formatDateWithoutTimezone(streak.to)}`}
            >
                {formatDateWithoutTimezone(streak.from)}{' '}
                -{' '}
                {formatDateWithoutTimezone(streak.to)}
            </div>
        )}
    </div>
);

export default StreakDisplay;