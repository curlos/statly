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
		localStorage.setItem('theme-color', colorKey);
		localStorage.setItem('theme-use-custom-color', 'false');
		await editUserSettings({ theme: { ...userSettings?.theme, color: colorKey, useCustomColor: false } }).unwrap();
	}, 500, true);

	const handleChangeCustomColor = useDebouncedCallback(async (hex: string) => {
		localStorage.setItem('theme-custom-color', hex);
		localStorage.setItem('theme-use-custom-color', 'true');
		await editUserSettings({ theme: { ...userSettings?.theme, customColor: hex, useCustomColor: true } }).unwrap();
	}, 500, true);

	// Favorites are stored newest first
	const favoriteCustomColors = userSettings?.theme?.favoriteCustomColors ?? [];
	const isCurrentColorFavorited = favoriteCustomColors.some((hex) => hex.toLowerCase() === customColorHex.toLowerCase());

	const handleAddFavoriteColor = async () => {
		if (isCurrentColorFavorited) return;
		await editUserSettings({ theme: { ...userSettings?.theme, favoriteCustomColors: [customColorHex, ...favoriteCustomColors] } }).unwrap();
	};

	const handleRemoveFavoriteColor = async (hexToRemove: string) => {
		await editUserSettings({ theme: { ...userSettings?.theme, favoriteCustomColors: favoriteCustomColors.filter((hex) => hex !== hexToRemove) } }).unwrap();
	};

	const handleToggleColorMode = async (mode: 'tailwind' | 'custom') => {
		localStorage.setItem('theme-use-custom-color', String(mode === 'custom'));
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

					{/* Favorite custom colors */}
					<button
						type="button"
						onClick={handleAddFavoriteColor}
						disabled={isCurrentColorFavorited}
						className={classNames(
							'mt-3 flex items-center gap-1 px-3 py-1 rounded border border-color-gray-100',
							isCurrentColorFavorited ? 'opacity-60 cursor-default' : 'cursor-pointer hover:bg-color-gray-600'
						)}
					>
						<Icon name="favorite" fill={isCurrentColorFavorited ? 1 : 0} customClass="!text-[18px]" aria-hidden={true} />
						{isCurrentColorFavorited ? 'In Favorites' : 'Add to Favorites'}
					</button>

					<div className="mt-3">
						<Accordion
							title={
								<div className="flex items-center gap-2">
									<div className="font-semibold">Favorites ({favoriteCustomColors.length})</div>
									<div className="flex items-center gap-1" aria-hidden="true">
										{favoriteCustomColors.slice(0, 5).map((hex) => (
											<div key={hex} className="w-[15px] h-[15px] rounded-full" style={{ backgroundColor: hex }} />
										))}
									</div>
								</div>
							}
						>
							<div className="pl-3 space-y-1">
								{favoriteCustomColors.length === 0 && (
									<div className="text-color-gray-100">No favorite colors yet.</div>
								)}
								{favoriteCustomColors.map((hex) => (
									<div key={hex} className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => handleChangeCustomColor(hex)}
											className="flex items-center gap-2 cursor-pointer rounded px-1 hover:bg-color-gray-600"
											aria-label={`Use color ${hex}`}
										>
											<div className="w-[15px] h-[15px] rounded-full" style={{ backgroundColor: hex }} />
											<span>{hex}</span>
										</button>
										<button
											type="button"
											onClick={() => handleRemoveFavoriteColor(hex)}
											className="cursor-pointer text-color-gray-100 hover:text-white flex items-center"
											aria-label={`Remove ${hex} from favorites`}
										>
											<Icon name="close" customClass="!text-[16px]" aria-hidden={true} />
										</button>
									</div>
								))}
							</div>
						</Accordion>
					</div>
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
