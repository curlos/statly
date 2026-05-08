import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';
import type { RootState } from '../../../store/store';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useState } from 'react';
import ModalFilterSidebar from '../../../components/FilterSidebar/ModalFilterSidebar';
import ChecklistTimerIcon from '../../../components/ChecklistTimerIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';

const TopBar = () => {
	const dispatch = useDispatch();
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-semibold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-25 bg-color-gray-300`;

	const isSidebarModalOpen = useSelector((state: RootState) => state.modals.modals.ModalSidebar?.isOpen);
	const [isFilterSidebarModalOpen, setIsFilterSidebarModalOpen] = useState(false);

	const queryParamsObj = Object.keys(pageContext.urlParsed.search).length > 0 ? pageContext.urlParsed.search : {};
	const queryParams = new URLSearchParams(queryParamsObj).toString();
	const queryParamsStr = queryParams ? `?${queryParams}` : '';

	const getTabButtons = () => {
		return (
			<nav aria-label="Stats sections" className="flex justify-center gap-2">
				<a
					href={'/stats/overview' + queryParamsStr}
					aria-current={location.pathname.includes('overview') ? 'page' : undefined}
					className={location.pathname.includes('overview') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={(e) => { e.preventDefault(); navigate('/stats/overview' + queryParamsStr); }}
				>
					Overview
				</a>

				<a
					href={'/stats/task' + queryParamsStr}
					aria-current={location.pathname.includes('task') ? 'page' : undefined}
					className={location.pathname.includes('task') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={(e) => { e.preventDefault(); navigate('/stats/task' + queryParamsStr); }}
				>
					Task
				</a>

				<a
					href={'/stats/focus' + queryParamsStr}
					aria-current={location.pathname.includes('focus') ? 'page' : undefined}
					className={location.pathname.includes('focus') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={(e) => { e.preventDefault(); navigate('/stats/focus' + queryParamsStr); }}
				>
					Focus
				</a>
			</nav>
		);
	};

	const getModalButtons = () => {
		return (
			<div className="flex items-center gap-2">
				<button
					type="button"
					aria-label="Open filter sidebar"
					aria-expanded={isFilterSidebarModalOpen}
					className="bg-transparent border-0 p-0 cursor-pointer"
					onClick={() => setIsFilterSidebarModalOpen(!isFilterSidebarModalOpen)}
				>
					<Icon name="page_info" customClass={'!text-[30px] text-color-gray-100'} />
				</button>
				<button
					type="button"
					aria-label="Open main menu"
					aria-expanded={isSidebarModalOpen ?? false}
					className="bg-transparent border-0 p-0 cursor-pointer"
					onClick={() => dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: !isSidebarModalOpen }))}
				>
					<Icon name="menu" customClass={'!text-[30px] text-white mr-[15px]'} />
				</button>
			</div>
		);
	};

	return (
		<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
			<div className="flex items-center gap-3">
				<ChecklistTimerIcon customClassName="!w-[35px] !h-[35px]"/>
				<h1 className="text-[24px] font-medium">Statistics</h1>
			</div>

			<div className="hidden md:flex justify-center sm:mr-[110px]">{getTabButtons()}</div>

			<div className="hidden md:block">{getModalButtons()}</div>

			<div className="md:hidden flex items-center justify-between">
				<div className="sm:mr-[110px]">{getTabButtons()}</div>
				{getModalButtons()}
			</div>

			{isFilterSidebarModalOpen && (
				<ModalFilterSidebar
					{...{
						isOpen: isFilterSidebarModalOpen,
						setIsOpen: setIsFilterSidebarModalOpen,
						page: 'stats',
					}}
				/>
			)}
		</div>
	);
};

export default TopBar;
