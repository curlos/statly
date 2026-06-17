import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import { toTitleCase } from '../../utils/helpers.utils';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';
import SimpleColorPicker from '../ColorPicker/SimpleColorPicker';

const ThemeColorList = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	const themeContext = useThemeContext();
	const { themeColorKey, cssStyles, chosenColorObj } = themeContext;

	const useCustomColor = userSettings?.theme?.useCustomColor ?? false;
	const customColorHex = userSettings?.theme?.customColor || localStorage.getItem('theme-custom-color') || '#3b82f6';

	const handleChangeTailwindColor = useDebouncedCallback(async (colorKey: string) => {
		await editUserSettings({ theme: { ...userSettings?.theme, color: colorKey, useCustomColor: false } }).unwrap();
		localStorage.setItem('theme-color', colorKey);
	}, 500, true);

	const handleChangeCustomColor = useDebouncedCallback(async (hex: string) => {
		await editUserSettings({ theme: { ...userSettings?.theme, customColor: hex, useCustomColor: true } }).unwrap();
		localStorage.setItem('theme-custom-color', hex);
	}, 500, true);

	const handleToggleColorMode = async (mode: 'tailwind' | 'custom') => {
		await editUserSettings({ theme: { ...userSettings?.theme, useCustomColor: mode === 'custom' } }).unwrap();
	};

	return (
		<div>
			<div className="mb-3 flex items-center gap-2">
				<div className="font-semibold">Current Color: </div>
				<div className="flex items-center gap-1">
					<div className={classNames(chosenColorObj.bgColor, 'w-[15px] h-[15px] rounded-full')} />
					<div className={chosenColorObj.textColor}>{themeColorKey}</div>
				</div>
			</div>

			{/* Custom Color section */}
			<div className="mb-4">
				<div className="flex items-center gap-2 mb-2">
					<CustomRadioButton
						label="Custom Color"
						name="color-mode"
						value="custom"
						checked={useCustomColor}
						onChange={() => handleToggleColorMode('custom')}
						customLabelClass="font-semibold"
						customOuterCircleClasses={classNames('!w-[16px] !h-[16px]', chosenColorObj.borderColor)}
						customInnerCircleClasses={classNames('!w-[8px] !h-[8px]', chosenColorObj.bgColor)}
					/>
					{useCustomColor && (
						<>
							<Icon
								name="star"
								fill={1}
								customClass={classNames(chosenColorObj.textColor, '!text-[20px]')}
							/>
							<span className="sr-only">(current color)</span>
						</>
					)}
				</div>
				<div className="pl-6">
					<SimpleColorPicker
						color={customColorHex}
						ariaLabel="Custom theme color"
						onColorChange={(hex) => handleChangeCustomColor(hex)}
					/>
				</div>
			</div>

			{/* Tailwind Colors section */}
			<div>
				<div className="flex items-center gap-2 mb-2">
					<CustomRadioButton
						label="Tailwind Colors"
						name="color-mode"
						value="tailwind"
						checked={!useCustomColor}
						onChange={() => handleToggleColorMode('tailwind')}
						customLabelClass="font-semibold"
						customOuterCircleClasses={classNames('!w-[16px] !h-[16px]', chosenColorObj.borderColor)}
						customInnerCircleClasses={classNames('!w-[8px] !h-[8px]', chosenColorObj.bgColor)}
					/>
					{!useCustomColor && (
						<>
							<Icon
								name="star"
								fill={1}
								customClass={classNames(chosenColorObj.textColor, '!text-[20px]')}
							/>
							<span className="sr-only">(current color)</span>
						</>
					)}
				</div>
				<div className="space-y-2 pl-6">
					{Object.keys(cssStyles).map((groupedColorName) => {
						const colorsFromGroup = cssStyles[groupedColorName];
						const color500VariantObj = colorsFromGroup[`${groupedColorName}-500`];
						const isColorFromGroupChosen = !useCustomColor && chosenColorObj.textColor.includes(groupedColorName);

						return (
							<div key={groupedColorName}>
								<Accordion
									title={
										<div className="flex items-center gap-2">
											<div
												className={classNames(
													color500VariantObj.bgColor,
													'w-[15px] h-[15px] rounded-full'
												)}
											/>
											<div className={color500VariantObj.textColor}>
												{toTitleCase(groupedColorName)}
											</div>

											{isColorFromGroupChosen && (
												<>
													<Icon
														name="star"
														fill={1}
														customClass={classNames(
															color500VariantObj.textColor,
															'!text-[20px] hover:text-white cursor-pointer'
														)}
													/>
													<span className="sr-only">(current color)</span>
												</>
											)}
										</div>
									}
								>
									<fieldset className="border-0 p-0 m-0 pl-3">
										<legend className="sr-only">{toTitleCase(groupedColorName)}</legend>
										{Object.keys(colorsFromGroup).map((colorKey) => {
											const { borderColor, bgColor, textColor } = colorsFromGroup[colorKey];

											return (
												<CustomRadioButton
													key={colorKey + 'radio'}
													label={colorKey}
													name={groupedColorName}
													value={colorKey}
													checked={!useCustomColor && themeColorKey === colorKey}
													onChange={() => handleChangeTailwindColor(colorKey)}
													customLabelClass={textColor}
													customOuterCircleClasses={classNames(
														'!w-[20px] !h-[20px]',
														borderColor
													)}
													customInnerCircleClasses={classNames('!w-[10px] !h-[10px]', bgColor)}
												/>
											);
										})}
									</fieldset>
								</Accordion>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default ThemeColorList;
