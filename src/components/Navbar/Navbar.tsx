import { useState } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import Icon from '../Icon';
import SidebarModal from '../SidebarModal/SidebarModal';

const Navbar = ({ topHeaderRef, setHeaderHeight }) => {
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);

	return (
		<div ref={topHeaderRef} className="container pt-4 pb-2">
			<img src="/gundam-nu-icon.webp" className="h-[40px]" />

			<Icon
				name="menu"
				customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
				onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
			/>

			{isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />}
		</div>
	);
};

export default Navbar;
