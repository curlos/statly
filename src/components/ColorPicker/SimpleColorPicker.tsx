import { useState, useEffect, useRef } from 'react';

interface SimpleColorPickerProps {
	color: string;
	onColorChange: (color: string) => void;
	ariaLabel?: string;
}

const SimpleColorPicker = ({ color, onColorChange, ariaLabel }: SimpleColorPickerProps) => {
	const [localColor, setLocalColor] = useState(color);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Update local color when prop changes
	useEffect(() => {
		setLocalColor(color);
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

	return (
		<label className="cursor-pointer">
			<input
				type="color"
				value={localColor}
				onChange={handleColorPickerChange}
				aria-label={ariaLabel}
				className="w-10 h-10 rounded-lg cursor-pointer border-2 border-color-gray-500"
			/>
		</label>
	);
};

export default SimpleColorPicker;
