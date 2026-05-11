import classNames from 'classnames';
import Icon from './Icon';

interface MenuItem {
	icon: string;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	isDanger?: boolean;
}

interface FocusRecordMenuItemsProps {
	menuItems: MenuItem[];
	onItemClick?: () => void;
}

const FocusRecordMenuItems: React.FC<FocusRecordMenuItemsProps> = ({ menuItems, onItemClick }) => {
	return (
		<div className="py-1">
			{menuItems.map((item, index) => (
				<button
					key={index}
					role="menuitem"
					onClick={() => {
						if (!item.disabled) {
							item.onClick();
							onItemClick?.();
						}
					}}
					disabled={item.disabled}
					className={classNames(
						'w-full px-4 py-2 text-left flex items-center gap-3 text-[14px] transition-colors',
						item.disabled
							? 'text-gray-500 cursor-not-allowed'
							: item.isDanger
							? 'text-red-400 hover:bg-color-gray-200 cursor-pointer'
							: 'text-white hover:bg-color-gray-200 cursor-pointer'
					)}
				>
					<Icon name={item.icon} customClass="!text-[18px]" />
					<span>{item.label}</span>
				</button>
			))}
		</div>
	);
};

export default FocusRecordMenuItems;
