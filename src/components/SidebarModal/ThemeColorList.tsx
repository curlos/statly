import classNames from 'classnames';
import useHandleError from '../../hooks/useHandleError';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import { toTitleCase } from '../../utils/focus-apps/helpers.utils';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';

const ThemeColorList = () => {
	const handleError = useHandleError();

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	const themeContext = useThemeContext();
	const { themeColorKey, cssStyles, chosenColorObj } = themeContext;

	const handleChangeThemeColor = (colorKey) => {
		handleError(async () => {
			const payload = {
				theme: {
					color: colorKey,
				},
			};

			await editUserSettings(payload).unwrap();

			// Once the theme has been successfully set on the backend, update it in localStorage.
			localStorage.setItem('theme-color', colorKey);
		});
	};

	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<h3 className="text-[20px] font-bold">Theme Color</h3>
				<Icon name="palette" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

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
											<Icon
												name="star"
												fill={1}
												customClass={classNames(
													color500VariantObj.textColor,
													'!text-[20px] hover:text-white cursor-pointer'
												)}
											/>
										)}
									</div>
								}
							>
								<div className="pl-3">
									{Object.keys(colorsFromGroup).map((colorKey) => {
										const { borderColor, bgColor, textColor } = colorsFromGroup[colorKey];

										return (
											<CustomRadioButton
												key={colorKey + 'radio'}
												label={colorKey}
												name={colorKey}
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
								</div>
							</Accordion>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ThemeColorList;
