import { useThemeContext } from '../../contexts/useThemeContext';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';

const FontFamilyList = () => {
	const handleError = useHandleError();

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const fontFamilies = [
		'',
		'Mozilla Headline',
		'Mozilla Text',
		// 'Kanit',
		// 'Roboto Condensed',
		// 'Space Mono',
		// 'Noto Sans',
		// 'Michroma',
		// 'Oxygen',
		// 'Google Sans Code',
		// 'Lobster',
		// 'Lobster Two',
		// 'Bebas Neue',
		'BF Modernista',
		'Kirsty',
		'Jost',
	];

	const handleChangeFontFamily = (fontFamilyKey) => {
		handleError(async () => {
			const restOfThemeKeysAndVals = userSettings?.theme;

			const payload = {
				theme: {
					...restOfThemeKeysAndVals,
					fontFamily: fontFamilyKey,
				},
			};

			await editUserSettings(payload).unwrap();
		});
	};

	const themeContext = useThemeContext();
	const { selectedFontFamilyKey } = themeContext;

	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<h3 className="text-[20px] font-bold">Font Family</h3>
				<Icon name="font_download" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>
			{fontFamilies.map((fontFamilyName) => {
				const fontFamilyKey = fontFamilyName ? fontFamilyName : 'Default';

				return (
					<div key={fontFamilyKey} style={{ fontFamily: fontFamilyName }}>
						<CustomRadioButton
							key={fontFamilyKey + 'radio'}
							label={fontFamilyKey}
							name={fontFamilyKey}
							checked={selectedFontFamilyKey === fontFamilyKey}
							onChange={() => handleChangeFontFamily(fontFamilyKey)}
							customOuterCircleClasses="!w-[20px] !h-[20px]"
							customInnerCircleClasses="!w-[10px] !h-[10px]"
						/>
					</div>
				);
			})}
		</div>
	);
};

export default FontFamilyList;
