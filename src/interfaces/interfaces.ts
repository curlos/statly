export interface DropdownProps {
	isVisible: boolean;
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	toggleRef: React.RefObject<HTMLElement>;
	customClasses?: string;
	align?: 'left' | 'right';
	innerClickElemRefs?: React.RefObject<HTMLElement>[];
	parentElemRef?: React.RefObject<HTMLElement>;
	role?: string;
}