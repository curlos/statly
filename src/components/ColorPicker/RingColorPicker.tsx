import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import CheckboxOther from '../FilterSidebar/CheckboxOther';
import { useState, useEffect, useRef } from 'react';

interface RingColorPickerProps {
	color: string | null;
	useThemeColor: boolean;
	onColorChange: (color: string) => void;
	onUseThemeColorChange: (useThemeColor: boolean) => void;
}

const RingColorPicker = ({
	color,
	useThemeColor,
	onColorChange,
	onUseThemeColorChange
}: RingColorPickerProps) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const [localColor, setLocalColor] = useState(color || '#fa114f');
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Update local color when prop changes
	useEffect(() => {
		setLocalColor(color || '#fa114f');
	}, [color]);

	const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;

		// Update local state immediately for smooth UX
		setLocalColor(newColor);

		// Clear existing timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Set new timer to call onColorChange after 1 second
		debounceTimerRef.current = setTimeout(() => {
			onColorChange(newColor);
		}, 1000);
	};

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const displayColor = useThemeColor ? chosenColorObj.hexColor : localColor;

	return (
		<div>
			{/* Color Picker */}
			<div className="flex items-center gap-2 mb-3">
				<span className="text-[14px] text-color-gray-100">Choose color:</span>
				<label className="cursor-pointer">
					<input
						type="color"
						value={displayColor}
						onChange={handleColorPickerChange}
						disabled={useThemeColor}
						className="w-10 h-10 rounded-lg cursor-pointer border-2 border-color-gray-500"
						style={{ opacity: useThemeColor ? 0.5 : 1 }}
					/>
				</label>
				{useThemeColor && (
					<div className="text-[12px] text-orange-400 flex items-center gap-1">
						<Icon name="info" customClass="!text-[16px]" />
						Using theme color
					</div>
				)}
			</div>

			{/* Theme Color Override Checkbox */}
			<CheckboxOther
				name="Override with Site Theme Color"
				showValue={useThemeColor}
				handleCheckboxClick={() => onUseThemeColorChange(!useThemeColor)}
			/>
		</div>
	);
};

export default RingColorPicker;
