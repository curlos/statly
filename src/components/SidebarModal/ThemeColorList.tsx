import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import { toTitleCase } from '../../utils/helpers.utils';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';

const ThemeColorList = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	const themeContext = useThemeContext();
	const { themeColorKey, cssStyles, chosenColorObj } = themeContext;

	const handleChangeThemeColor = useDebouncedCallback(async (colorKey: string) => {
		const payload = {
			theme: {
				...userSettings?.theme,
				color: colorKey,
			},
		};
		await editUserSettings(payload).unwrap();
		localStorage.setItem('theme-color', colorKey);
	}, 500);

	return (
		<div>
			<div className="mb-3 flex items-center gap-2">
				<div className="font-semibold">Current Color: </div>
				<div className="flex items-center gap-1">
					<div className={classNames(chosenColorObj.bgColor, 'w-[15px] h-[15px] rounded-full')} />
					<div className={chosenColorObj.textColor}>{themeColorKey}</div>
				</div>
			</div>

			<div className="space-y-2">
				{Object.keys(cssStyles).map((groupedColorName) => {
					const colorsFromGroup = cssStyles[groupedColorName];
					const color500VariantObj = colorsFromGroup[`${groupedColorName}-500`];
					const isColorFromGroupChosen = chosenColorObj.textColor.includes(groupedColorName);

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
												checked={themeColorKey === colorKey}
												onChange={() => handleChangeThemeColor(colorKey)}
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
	);
};

export default ThemeColorList;
