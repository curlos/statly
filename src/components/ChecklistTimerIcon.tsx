import classNames from "classnames";
import { useThemeContext } from "../contexts/useThemeContext";
import { STATLY_LOGO_PATHS } from "../utils/statlyLogo";

interface ChecklistTimerIconProps {
	customClassName?: string;
}

const ChecklistTimerIcon: React.FC<ChecklistTimerIconProps> = ({ customClassName }) => {
	const { chosenColorObj } = useThemeContext();

	return (
    <svg role="img" aria-label="Statly" className={classNames("w-[100px] h-[100px]", chosenColorObj.textColor, customClassName)} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        {STATLY_LOGO_PATHS.map((path) => (
            <path key={path} fill="currentColor" d={path} />
        ))}
    </svg>
	);
}

export default ChecklistTimerIcon