import { useState } from 'react';
import Icon from '../Icon';
import SidebarModal from './SidebarModal';

const SidebarButtonAndModal = () => {
	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);

	return (
		<>
			<Icon
				name="menu"
				customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
				onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
			/>

			{isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />}
		</>
	);
};

export default SidebarButtonAndModal;
