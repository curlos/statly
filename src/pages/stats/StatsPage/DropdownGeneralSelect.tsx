import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Icon from '../../../components/Icon';
import { useThemeContext } from '../../../contexts/useThemeContext';

interface DropdownGeneralSelectProps {
	toggleRef: React.RefObject<HTMLElement>;
	isVisible: boolean;
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	customClasses?: string;
	selected: string;
	setSelected: (selected: string) => void;
	selectedOptions: string[];
	onClick?: (name: string) => void;
	align?: 'left' | 'right';
	listboxId?: string;
}

const DropdownGeneralSelect: React.FC<DropdownGeneralSelectProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selected,
	setSelected,
	selectedOptions,
	onClick,
	align,
	listboxId,
}) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor } = chosenColorObj;
	const listboxRef = useRef<HTMLUListElement>(null);

	// Focus the selected (or first) option when the listbox opens
	useEffect(() => {
		if (isVisible && listboxRef.current) {
			const selectedEl = listboxRef.current.querySelector('[aria-selected="true"]') as HTMLElement | null;
			const firstEl = listboxRef.current.querySelector('[role="option"]') as HTMLElement | null;
			(selectedEl || firstEl)?.focus();
		}
	}, [isVisible]);

	const handleSelect = (name: string) => {
		setSelected(name);
		setIsVisible(false);
		if (onClick) onClick(name);
		toggleRef.current?.focus();
	};

	const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
		const options = Array.from(listboxRef.current?.querySelectorAll('[role="option"]') ?? []) as HTMLElement[];
		const index = options.indexOf(document.activeElement as HTMLElement);

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				options[Math.min(index + 1, options.length - 1)]?.focus();
				break;
			case 'ArrowUp':
				e.preventDefault();
				options[Math.max(index - 1, 0)]?.focus();
				break;
			case 'Home':
				e.preventDefault();
				options[0]?.focus();
				break;
			case 'End':
				e.preventDefault();
				options[options.length - 1]?.focus();
				break;
			case 'Tab':
				// Trap focus within the listbox — cycle forward or backward
				e.preventDefault();
				if (e.shiftKey) {
					options[index <= 0 ? options.length - 1 : index - 1]?.focus();
				} else {
					options[index >= options.length - 1 ? 0 : index + 1]?.focus();
				}
				break;
			case 'Escape':
				e.preventDefault();
				e.stopPropagation();
				setIsVisible(false);
				toggleRef.current?.focus();
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (index >= 0) handleSelect(selectedOptions[index]);
				break;
		}
	};

	const SelectOption = ({ name }: { name: string }) => {
		return (
			<li
				role="option"
				aria-selected={selected === name}
				tabIndex={-1}
				className={classNames(
					'flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-color-gray-200 focus:bg-color-gray-200 focus:outline-none list-none'
				)}
				onClick={(e) => {
					e.stopPropagation();
					handleSelect(name);
				}}
			>
				<span className={selected === name ? textColor : ''}>{name}</span>
				{selected === name && (
					<Icon
						name="check"
						fill={0}
						aria-hidden="true"
						customClass={classNames(textColor, '!text-[18px]')}
					/>
				)}
			</li>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-100 rounded-lg w-[150px]', customClasses)}
			align={align}
		>
			<ul
				ref={listboxRef}
				role="listbox"
				id={listboxId}
				aria-label="Select option"
				className="p-1 max-h-[250px] overflow-y-auto gray-scrollbar m-0 list-none"
				onKeyDown={handleListboxKeyDown}
			>
				{selectedOptions.map((name) => (
					<SelectOption key={name} name={name} />
				))}
			</ul>
		</Dropdown>
	);
};

export default DropdownGeneralSelect;
