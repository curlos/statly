import { useRef, useState } from 'react';
import Icon from '../../../components/Icon';
import DropdownGeneralSelect from './DropdownGeneralSelect';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';

interface GeneralSelectButtonAndDropdownProps {
	selected: string;
	setSelected: (value: string) => void;
	selectedOptions: string[];
	onClick?: (selectedOption: string) => void;
	isDropdownOpenForParent?: boolean;
	setIsDropdownOpenForParent?: (value: boolean) => void;
	align?: 'left' | 'right';
}

const GeneralSelectButtonAndDropdown: React.FC<GeneralSelectButtonAndDropdownProps> = ({
	selected,
	setSelected,
	selectedOptions,
	onClick,
	isDropdownOpenForParent,
	setIsDropdownOpenForParent,
	align,
}) => {
	const dropdownRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { hover } = chosenColorObj;

	return (
		<div className="relative">
			<div
				ref={dropdownRef}
				className={classNames(
					'flex gap-[2px] items-center justify-between px-2 py-[2px] pl-3 border border-color-gray-50 rounded-full bg-color-gray-300 text-color-gray-50 cursor-pointer',
					`${hover.textColor} ${hover.borderColor}`
				)}
				onClick={() => {
					setIsDropdownVisible(!isDropdownVisible);

					if (isDropdownOpenForParent !== undefined) {
						setIsDropdownOpenForParent?.(!isDropdownOpenForParent);
					}
				}}
			>
				<div>{selected}</div>
				<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
			</div>

			<DropdownGeneralSelect
				toggleRef={dropdownRef}
				isVisible={isDropdownVisible}
				setIsVisible={(value) => {
					setIsDropdownVisible(value);

					if (isDropdownOpenForParent !== undefined && typeof value === 'boolean') {
						setIsDropdownOpenForParent?.(value);
					}
				}}
				selected={selected}
				setSelected={setSelected}
				selectedOptions={selectedOptions}
				onClick={onClick}
				align={align}
			/>
		</div>
	);
};

export default GeneralSelectButtonAndDropdown;
