import React from 'react';
import ModalErrorMessenger from './ModalErrorMessenger';

/**
 * @description Modals in this list can be opened from anywhere on the site. In most cases, this'll be reserved for Modals that can be opened from multiple parts in the site such as the "Add Task Form Modal".
 */
const GlobalModalList = () => {
	return (
		<React.Fragment>
			{/* Error messenger needs to be at the bottom-most line so it always appears above every other modal. */}
			<ModalErrorMessenger />
		</React.Fragment>
	);
};

export default GlobalModalList;
