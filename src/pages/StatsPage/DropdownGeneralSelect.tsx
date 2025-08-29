import classNames from 'classnames';
import Dropdown from '../../components/Dropdown/Dropdown';
import Icon from '../../components/Icon';
import { useThemeContext } from '../../contexts/useThemeContext';

const DropdownGeneralSelect = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selected,
	setSelected,
	selectedOptions,
	onClick,
}) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor } = chosenColorObj;

	const SelectOption = ({ name }) => {
		return (
			<div
				className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-md cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setSelected(name);
					setIsVisible(false);

					if (onClick) {
						onClick(name);
					}
				}}
			>
				<div className={selected === name ? textColor : ''}>{name}</div>
				{selected === name && (
					<Icon
						name="check"
						fill={0}
						customClass={classNames(textColor, '!text-[18px] hover:text-white cursor-pointer')}
					/>
				)}
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg w-[175px]', customClasses)}
		>
			<div className="p-1 max-h-[230px] overflow-y-auto gray-scrollbar">
				{selectedOptions.map((name) => (
					<SelectOption key={name} name={name} />
				))}
			</div>
		</Dropdown>
	);
};

export default DropdownGeneralSelect;
