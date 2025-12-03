import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import Icon from '../../../components/Icon';
import SidebarModal from '../../../components/SidebarModal/SidebarModal';
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
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	const isSidebarModalOpen = useSelector((state: any) => state.modals.modals.ModalSidebar?.isOpen);
	const [isFilterSidebarModalOpen, setIsFilterSidebarModalOpen] = useState(false);

	const queryParamsObj = Object.keys(pageContext.urlParsed.search).length > 0 ? pageContext.urlParsed.search : {};
	const queryParams = new URLSearchParams(queryParamsObj).toString();
	const queryParamsStr = queryParams ? `?${queryParams}` : '';

	const getTabButtons = () => {
		return (
			<div className="flex justify-center gap-2">
				<div
					className={location.pathname.includes('overview') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => navigate('/stats/overview' + queryParamsStr)}
				>
					Overview
				</div>

				<div
					className={location.pathname.includes('task') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => navigate('/stats/task' + queryParamsStr)}
				>
					Task
				</div>

				<div
					className={location.pathname.includes('focus') ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => navigate('/stats/focus' + queryParamsStr)}
				>
					Focus
				</div>
			</div>
		);
	};

	const getModalButtons = () => {
		return (
			<div className="flex items-center gap-2">
				<Icon
					name="page_info"
					customClass={'!text-[30px] text-color-gray-100 cursor-pointer'}
					onClick={() => setIsFilterSidebarModalOpen(!isFilterSidebarModalOpen)}
				/>
				<Icon
					name="menu"
					customClass={'!text-[30px] text-white mr-[15px] cursor-pointer'}
					onClick={() => dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: !isSidebarModalOpen }))}
				/>
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
