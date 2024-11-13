import classNames from 'classnames';
import useHandleError from '../../hooks/useHandleError';
import { useThemeContext } from '../../pages/ticktick-1.00/focus-records/useThemeContext';
import { useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import { toTitleCase } from '../../utils/helpers.utils';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';

const ThemeColorList = () => {
	const handleError = useHandleError();

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	const themeContext = useThemeContext();
	const { themeColorKey, setThemeColorKey, cssStyles } = themeContext;

	return (
		<div>
			<div className="flex items-center gap-1 mb-3">
				<h3 className="text-[16px] font-bold">Theme Color</h3>
				<Icon
					name="palette"
					fill={1}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
			</div>
			<div className="space-y-2">
				{Object.keys(cssStyles).map((groupedColorName) => {
					const colorsFromGroup = cssStyles[groupedColorName];

					return (
						<div>
							<div>{toTitleCase(groupedColorName)}</div>
							{Object.keys(colorsFromGroup).map((colorKey) => {
								const { borderColor, bgColor, textColor } = colorsFromGroup[colorKey];

								return (
									<CustomRadioButton
										key={colorKey + 'radio'}
										label={colorKey}
										name={colorKey}
										checked={themeColorKey === colorKey}
										onChange={() => {
											setThemeColorKey(colorKey);

											handleError(async () => {
												const payload = {
													theme: {
														color: colorKey,
													},
												};

												await editUserSettings(payload).unwrap();
											});
										}}
										customLabelClass={textColor}
										customOuterCircleClasses={classNames('!w-[20px] !h-[20px]', borderColor)}
										customInnerCircleClasses={classNames('!w-[10px] !h-[10px]', bgColor)}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ThemeColorList;
