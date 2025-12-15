export interface DropdownProps {
	isVisible: boolean;
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	toggleRef: React.MutableRefObject<null>;
	customClasses?: string;
	align?: 'left' | 'right';
	innerClickElemRefs?: React.RefObject<HTMLElement>[];
	parentElemRef?: React.RefObject<HTMLElement>;
}