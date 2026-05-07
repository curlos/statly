import CheckboxOther from './CheckboxOther';
import SimpleColorPicker from '../ColorPicker/SimpleColorPicker';
import CardImage from '../../pages/challenges/CardImage';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { useState, useEffect, useRef } from 'react';

const CustomCardDisplay = () => {
	const {
		focusRecordsPageSettings: { customDisplay },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const {
		useBackgroundImage,
		backgroundImage,
		backgroundImageOpacity,
		useBackgroundColor,
		backgroundColor,
		useTextColor,
		textColor
	} = customDisplay;

	// Local state for opacity slider (for smooth UX)
	const [localOpacity, setLocalOpacity] = useState(backgroundImageOpacity);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Update local opacity when prop changes
	useEffect(() => {
		setLocalOpacity(backgroundImageOpacity);
	}, [backgroundImageOpacity]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	return (
		<div className="mb-4">
			<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Card Display</h4>

			{/* Background Image */}
			<CheckboxOther
				name="Use Background Image"
				showValue={useBackgroundImage}
				handleCheckboxClick={() =>
					handleUpdateUserSettingForPage('focusRecords', 'customDisplay', {
						...customDisplay,
						useBackgroundImage: !useBackgroundImage
					})
				}
			/>

			{useBackgroundImage && (
				<div className="pl-10 mt-2 space-y-3">
					<CardImage
						cardType="background"
						imageSrc={backgroundImage}
						page="focus-records"
					/>

					{/* Opacity Slider */}
					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<span className="text-[14px] text-color-gray-100">Opacity:</span>
							<span className="text-[14px] text-color-gray-100">{Math.round(localOpacity * 100)}%</span>
						</div>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={localOpacity}
							onChange={(e) => {
								const newOpacity = parseFloat(e.target.value);

								// Update local state immediately for smooth UX
								setLocalOpacity(newOpacity);

								// Clear existing timer
								if (debounceTimerRef.current) {
									clearTimeout(debounceTimerRef.current);
								}

								// Set new timer to save after 1 second
								debounceTimerRef.current = setTimeout(() => {
									handleUpdateUserSettingForPage('focusRecords', 'customDisplay', {
										...customDisplay,
										backgroundImageOpacity: newOpacity
									});
								}, 1000);
							}}
							className="w-full h-2 rounded-lg cursor-pointer bg-color-gray-500"
						/>
					</div>
				</div>
			)}

			{/* Background Color */}
			<CheckboxOther
				name="Use Background Color"
				showValue={useBackgroundColor}
				handleCheckboxClick={() =>
					handleUpdateUserSettingForPage('focusRecords', 'customDisplay', {
						...customDisplay,
						useBackgroundColor: !useBackgroundColor
					})
				}
			/>

			{useBackgroundColor && (
				<div className="pl-10 mt-2 flex items-center gap-2">
					<span className="text-[14px] text-color-gray-25">Choose color:</span>
					<SimpleColorPicker
						color={backgroundColor}
						onColorChange={(newColor) =>
							handleUpdateUserSettingForPage('focusRecords', 'customDisplay', {
								...customDisplay,
								backgroundColor: newColor
							})
						}
					/>
				</div>
			)}

			{/* Text Color */}
			<CheckboxOther
				name="Use Text Color"
				showValue={useTextColor}
				handleCheckboxClick={() =>
					handleUpdateUserSettingForPage('focusRecords', 'customDisplay', {
						...customDisplay,
						useTextColor: !useTextColor
					})
				}
			/>

			{useTextColor && (
				<div className="pl-10 mt-2 flex items-center gap-2">
					<span className="text-[14px] text-color-gray-25">Choose color:</span>
					<SimpleColorPicker
						color={textColor}
						onColorChange={(newColor) =>
							handleUpdateUserSettingForPage('focusRecords', 'customDisplay', {
								...customDisplay,
								textColor: newColor
							})
						}
					/>
				</div>
			)}
		</div>
	);
};

export default CustomCardDisplay;
