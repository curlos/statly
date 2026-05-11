import classNames from 'classnames';
import { navigate } from 'vike/client/router';
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
	let buttonUrl = `/medals/${newType}/${newInterval}`;

	if (pageContext.urlParsed.pathname.includes('/challenges')) {
		buttonUrl = `/challenges/${newType}`;
	}

	if (queryParams) {
		buttonUrl += `?${new URLSearchParams(queryParams).toString()}`;
	}

	return (
		<button
			type="button"
			aria-pressed={isSelected}
			className={isSelected ? selectedButtonStyle : unselectedButtonStyle}
			onClick={() => navigate(buttonUrl)}
		>
			{name}
		</button>
	);
};

export default TopButtonList;
