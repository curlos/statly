import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { getReadableTextColor, getHalfOpacityFillColor } from '../../utils/color.utils';
import Icon from '../Icon';

interface AppliedFilterItemProps {
	name?: string; // Optional - if provided, shows "name: value" format
	value: string; // The display text
	onRemove: () => void; // Callback when X is clicked
}

const AppliedFilterItem = ({ name, value, onRemove }: AppliedFilterItemProps) => {
	const themeContext = useThemeContext();
	const { chosenColorObj, colorMode } = themeContext;
	const { bgColor, bgColorHalfOpacity } = chosenColorObj;

	const {
		focusRecordsPageSettings: { lowerCardOpacity },
	} = useUserSettingsContext();

	return (
		<div className="flex">
			<div
				className={classNames('px-2 py-1 text-[14px] rounded-xl', lowerCardOpacity ? bgColorHalfOpacity : bgColor)}
				style={lowerCardOpacity ? { color: getReadableTextColor(getHalfOpacityFillColor(chosenColorObj.hexColor, colorMode)) } : undefined}
			>
				<div className="overflow-hidden">
					{name && <span className="font-bold">{name}: </span>}
					<span className="text-wrap break-all">{value}</span>
				</div>
			</div>

			<button
				type="button"
				aria-label={`Remove filter for ${name ? name + ': ' : ''}${value}`}
				onClick={onRemove}
				className={classNames('mt-[-20px] ml-[-10px] bg-transparent border-0 p-0 cursor-pointer')}
			>
				<Icon
					name="close"
					fill={0}
					customClass={classNames('rounded-full !text-[14px] p-[2px]', colorMode === 'light' ? 'text-[#ffffff] bg-black' : 'text-black bg-white')}
				/>
			</button>
		</div>
	);
};

export default AppliedFilterItem;
