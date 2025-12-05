import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../Icon';
import ModalSettingsSidebar from '../SettingsSidebar/ModalSettingsSidebar';
import ChecklistTimerIcon from '../ChecklistTimerIcon';
import { setModalState } from '../../slices/modalSlice';
import ModalFilterSidebar from '../FilterSidebar/ModalFilterSidebar';

const Navbar = ({ page = null, showFilterSidebarIcon = false }) => {
	const dispatch = useDispatch();
	const isSidebarModalOpen = useSelector((state: any) => state.modals.modals.ModalSidebar?.isOpen);
	const [isSettingsSidebarModalOpen, setIsSettingsSidebarModalOpen] = useState(false);
	const [isFilterSidebarModalOpen, setIsFilterSidebarModalOpen] = useState(false);

	return (
		<div className="container pt-8 pb-3 flex items-center justify-between">
			<ChecklistTimerIcon customClassName="!w-[35px] !h-[35px]"/>

			<div className="flex items-center gap-3 mr-[15px]">
				{showFilterSidebarIcon && (
					<Icon
						name="page_info"
						customClass={'!text-[30px] text-color-gray-100 cursor-pointer'}
						onClick={() => setIsFilterSidebarModalOpen(!isFilterSidebarModalOpen)}
					/>
				)}
				<Icon
					name="settings"
					customClass={'!text-[30px] text-color-gray-100 cursor-pointer'}
					onClick={() => setIsSettingsSidebarModalOpen(!isSettingsSidebarModalOpen)}
				/>
				<Icon
					name="menu"
					customClass={'!text-[30px] text-white cursor-pointer'}
					onClick={() => dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: !isSidebarModalOpen }))}
				/>
			</div>

			{isSettingsSidebarModalOpen && (
				<ModalSettingsSidebar
					{...{
						isOpen: isSettingsSidebarModalOpen,
						setIsOpen: setIsSettingsSidebarModalOpen,
						page,
					}}
				/>
			)}

			{isFilterSidebarModalOpen && (
				<ModalFilterSidebar
					{...{
						isOpen: isFilterSidebarModalOpen,
						setIsOpen: setIsFilterSidebarModalOpen,
						page,
					}}
				/>
			)}
		</div>
	);
};

export default Navbar;
