import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import Icon from '../Icon';

interface AppliedFilterItemProps {
	name?: string; // Optional - if provided, shows "name: value" format
	value: string; // The display text
	onRemove: () => void; // Callback when X is clicked
}

const AppliedFilterItem = ({ name, value, onRemove }: AppliedFilterItemProps) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { bgColorHalfOpacity } = chosenColorObj;

	return (
		<div className="flex">
			<div className={classNames('px-2 py-1 text-[14px] text-white rounded-xl', bgColorHalfOpacity)}>
				<div className="overflow-hidden">
					{name && <span className="font-bold">{name}: </span>}
					<span className="text-wrap break-all">{value}</span>
				</div>
			</div>

			<div onClick={onRemove} className={classNames('mt-[-9px] ml-[-10px]')}>
				<Icon
					name="close"
					fill={0}
					customClass={'text-black rounded-full !text-[14px] bg-white cursor-pointer p-[2px]'}
				/>
			</div>
		</div>
	);
};

export default AppliedFilterItem;
