import { useState, useEffect, useRef } from 'react';

interface SimpleColorPickerProps {
	color: string;
	onColorChange: (color: string) => void;
	ariaLabel?: string;
}

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

const SimpleColorPicker = ({ color, onColorChange, ariaLabel }: SimpleColorPickerProps) => {
	const [localColor, setLocalColor] = useState(color);
	const [hexInput, setHexInput] = useState(color);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Update local color when prop changes
	useEffect(() => {
		setLocalColor(color);
		setHexInput(color);
	}, [color]);

	const applyColor = (newColor: string) => {
		setLocalColor(newColor);
		setHexInput(newColor);
		if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
		debounceTimerRef.current = setTimeout(() => {
			onColorChange(newColor);
		}, 1000);
	};

	const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setHexInput(val);
		const normalized = val.startsWith('#') ? val : `#${val}`;
		if (HEX_REGEX.test(normalized)) {
			applyColor(normalized);
		}
	};

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
		};
	}, []);

	return (
		<div className="flex items-center gap-2">
			<label className="cursor-pointer">
				<input
					type="color"
					value={localColor}
					onChange={(e) => applyColor(e.target.value)}
					aria-label={ariaLabel}
					className="w-10 h-10 rounded-lg cursor-pointer border-2 border-color-gray-500"
				/>
			</label>
			<input
				type="text"
				value={hexInput}
				onChange={handleHexInputChange}
				placeholder="#000000"
				maxLength={7}
				className="w-[90px] px-2 py-1 text-[13px] rounded border border-color-gray-500 bg-color-gray-600 text-color-gray-100 font-mono"
				aria-label={`${ariaLabel ?? 'Color'} hex value`}
			/>
		</div>
	);
};

export default SimpleColorPicker;
