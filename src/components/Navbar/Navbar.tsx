import { useState } from 'react';
import Icon from '../Icon';
import SidebarModal from '../SidebarModal/SidebarModal';
import ModalSettingsSidebar from '../SettingsSidebar/ModalSettingsSidebar';
import ChecklistTimerIcon from '../ChecklistTimerIcon';

const Navbar = ({ page = null }) => {
	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);
	const [isSettingsSidebarModalOpen, setIsSettingsSidebarModalOpen] = useState(false);

	return (
		<div className="container pt-8 pb-3 flex items-center justify-between">
			<ChecklistTimerIcon customClassName="!w-[35px] !h-[35px]"/>

			<div className="flex items-center gap-3 mr-[15px]">
				<Icon
					name="settings"
					customClass={'!text-[30px] text-color-gray-100 cursor-pointer'}
					onClick={() => setIsSettingsSidebarModalOpen(!isSettingsSidebarModalOpen)}
				/>
				<Icon
					name="menu"
					customClass={'!text-[30px] text-white cursor-pointer'}
					onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
				/>
			</div>

			{isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />}
			{isSettingsSidebarModalOpen && (
				<ModalSettingsSidebar
					{...{
						isOpen: isSettingsSidebarModalOpen,
						setIsOpen: setIsSettingsSidebarModalOpen,
						page,
					}}
				/>
			)}
		</div>
	);
};

export default Navbar;
