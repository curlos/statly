import React from 'react';
import ModalErrorMessenger from './ModalErrorMessenger';
import ModalFirstSync from './ModalFirstSync';
import SidebarModal from '../SidebarModal/SidebarModal';

/**
 * @description Modals in this list can be opened from anywhere on the site. In most cases, this'll be reserved for Modals that can be opened from multiple parts in the site such as the "Add Task Form Modal".
 */
const GlobalModalList = ({ isAuthPage = false }: { isAuthPage?: boolean }) => {
	return (
		<React.Fragment>
			{/* First sync modal */}
			<ModalFirstSync />

			{/* Error messenger needs to be at the bottom-most line so it always appears above every other modal. */}
			<ModalErrorMessenger />

			{!isAuthPage && <SidebarModal />}
		</React.Fragment>
	);
};

export default GlobalModalList;
