import { useState } from 'react';
import Icon from '../Icon';
import SidebarModal from '../SidebarModal/SidebarModal';
import ModalSettingsSidebar from '../SettingsSidebar/ModalSettingsSidebar';

const Navbar = ({ page = null }) => {
	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);
	const [isSettingsSidebarModalOpen, setIsSettingsSidebarModalOpen] = useState(false);

	return (
		<div className="container pt-4 pb-3 flex items-center justify-between">
			<img src="/gundam-nu-icon.webp" className="h-[40px]" />

			<div className="flex items-center gap-3 mt-[15px] mr-[15px]">
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
