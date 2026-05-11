import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { usePageContext } from 'vike-react/usePageContext';

interface TopButtonListProps {
	BUTTONS_OBJ: Array<{ name: string; urlName: string }>;
	isForInterval?: boolean;
}

const TopButtonList: React.FC<TopButtonListProps> = ({ BUTTONS_OBJ, isForInterval = true }) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[13.5px] sm:text-[16px] py-1 px-3 cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-semibold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-25 bg-color-gray-300`;

	return (
		<div className="flex items-center gap-2 my-2">
			{BUTTONS_OBJ.map((buttonObj) => {
				return (
					<TopButton
						key={buttonObj.name}
						{...{ buttonObj, selectedButtonStyle, unselectedButtonStyle, isForInterval }}
					/>
				);
			})}
		</div>
	);
};

interface TopButtonProps {
	buttonObj: { name: string; urlName: string };
	selectedButtonStyle: string;
	unselectedButtonStyle: string;
	isForInterval: boolean;
}

const TopButton: React.FC<TopButtonProps> = ({ buttonObj, selectedButtonStyle, unselectedButtonStyle, isForInterval }) => {
	const pageContext = usePageContext();
	const { type, interval } = pageContext.routeParams;

	const queryParams = Object.keys(pageContext.urlParsed.search).length > 0 ? pageContext.urlParsed.search : null;

	const { name, urlName } = buttonObj;

	const isSelected = isForInterval ? urlName === interval : urlName === type;

	const newType = isForInterval ? type : urlName;
	const newInterval = isForInterval ? urlName : interval;

	const isChallengePage = pageContext.urlParsed.pathname.includes('/challenges');
	let buttonUrl = `/medals/${newType}/${newInterval}`;
	if (isChallengePage) {
		buttonUrl = `/challenges/${newType}`;
	}

	if (queryParams) {
		buttonUrl += `?${new URLSearchParams(queryParams).toString()}`;
	}

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
	const pageName = isChallengePage ? 'challenges' : 'medals';
	const ariaLabel = isChallengePage
		? `${capitalize(newType)} ${pageName}`
		: `${capitalize(newType)} ${capitalize(newInterval)} ${pageName}`;

	return (
		<a
			href={buttonUrl}
			aria-label={ariaLabel}
			aria-current={isSelected ? 'page' : undefined}
			className={isSelected ? selectedButtonStyle : unselectedButtonStyle}
		>
			{name}
		</a>
	);
};

export default TopButtonList;
