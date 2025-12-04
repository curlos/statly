import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import CustomRadioButton from '../CustomRadioButton';

const FontFamilyList = () => {

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

	const handleChangeFontFamily = async (fontFamilyKey) => {
		const restOfThemeKeysAndVals = userSettings?.theme;

		const payload = {
			theme: {
				...restOfThemeKeysAndVals,
				fontFamily: fontFamilyKey,
			},
		};

		await editUserSettings(payload).unwrap();

		// Once the theme has been successfully set on the backend, update it in localStorage.
		localStorage.setItem('font-family', fontFamilyKey);
	};

	const themeContext = useThemeContext();
	const { selectedFontFamilyKey } = themeContext;

	return (
		<div>
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
