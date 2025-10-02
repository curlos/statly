import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { isFromServer } from '../../utils/focus-apps/helpers.utils';

interface IContextMenuGeneric {
	xPos: string;
	yPos: string;
	onClose: () => void;
}

const ContextMenuGeneric: React.FC<IContextMenuGeneric> = ({
	toggleRef,
	xPos,
	yPos,
	onClose,
	isDropdownVisible,
	setIsDropdownVisible,
	children,
}) => {
	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownVisible(true);
		} else {
			setIsDropdownVisible(true);
		}
	}, [xPos]);

	useEffect(() => {
		if (!isDropdownVisible) {
			onClose();
		}
	}, [isDropdownVisible]);

	if (!isFromServer()) {
		return createPortal(<div ref={toggleRef}>{children}</div>, document.body);
	}
};

export default ContextMenuGeneric;
