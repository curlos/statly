import { useRef } from 'react';
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

	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleChangeFontFamily = (fontFamilyKey: string) => {
		if (debounceTimer.current) clearTimeout(debounceTimer.current);

		debounceTimer.current = setTimeout(async () => {
			const payload = {
				theme: {
					...userSettings?.theme,
					fontFamily: fontFamilyKey,
				},
			};

			await editUserSettings(payload).unwrap();
			localStorage.setItem('font-family', fontFamilyKey);
		}, 500);
	};

	const themeContext = useThemeContext();
	const { selectedFontFamilyKey } = themeContext;

	return (
		<div role="radiogroup" aria-label="Font Family">
			{fontFamilies.map((fontFamilyName) => {
				const fontFamilyKey = fontFamilyName ? fontFamilyName : 'Default';

				return (
					<div key={fontFamilyKey} style={{ fontFamily: fontFamilyName }}>
						<CustomRadioButton
							key={fontFamilyKey + 'radio'}
							label={fontFamilyKey}
							name="fontFamily"
							value={fontFamilyKey}
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
