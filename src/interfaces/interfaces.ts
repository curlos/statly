export interface DropdownProps {
	isVisible: boolean;
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	toggleRef: React.MutableRefObject<null>;
	customClasses?: string;
	customStyling?: Object;
	align?: 'left' | 'right';
}