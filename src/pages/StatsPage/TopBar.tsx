import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';

const TopBar = () => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
			<h1 className="text-[24px] font-medium">Statistics</h1>

			<div className="flex justify-center gap-1 sm:mr-[110px]">
				<div
					className={location.pathname.includes('overview') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => navigate('/stats/overview')}
				>
					Overview
				</div>

				<div
					className={location.pathname.includes('task') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => navigate('/stats/task')}
				>
					Task
				</div>

				<div
					className={location.pathname.includes('focus') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => navigate('/stats/focus')}
				>
					Focus
				</div>
			</div>

			<div></div>
		</div>
	);
};

export default TopBar;
