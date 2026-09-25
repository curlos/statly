import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import CustomRadioButton from '../CustomRadioButton';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';

// Which UI themes use each font, shown next to its name in the list
const FONT_USED_IN: Record<string, string[]> = {
	Jost: ['Persona 3 Reload'],
	Cinzel: ['Hades'],
	'Alegreya Sans': ['Hades'],
	'Alegreya Sans SC': ['Hades'],
	Barlow: ['Persona 3 Reload', 'Ink & Marker'],
	'Barlow Condensed': ['Persona 3 Reload', 'Ink & Marker'],
	'M PLUS Rounded 1c': ['Persona 4 Golden'],
	'M PLUS 1p': ['Persona 4 Golden'],
	Anton: ['Persona 5'],
	Archivo: ['Persona 5'],
	'Abril Fatface': ['Persona 5'],
	Rajdhani: ['Cyberpunk 2077'],
	Belleza: ['Final Fantasy VII Remake'],
	VT323: ['Metal Gear Solid'],
	Kirsty: ['Red Dead Redemption 2'],
	'Zilla Slab': ['Red Dead Redemption 2'],
	'Playfair Display': ['Ink & Marker'],
};

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
		'BF Modernista',
		'Kirsty',
		'Jost',
		'Bio Sans',
		'Comic Neue',
		// Fonts from the game UI themes (each game theme still uses its own fonts; these can be picked
		// for the Default and Ink & Marker themes). Which games use them is listed in FONT_USED_IN.
		'Cinzel',
		'Alegreya Sans',
		'Alegreya Sans SC',
		'Barlow',
		'Barlow Condensed',
		'M PLUS Rounded 1c',
		'M PLUS 1p',
		'Anton',
		'Archivo',
		'Abril Fatface',
		'Rajdhani',
		'Belleza',
		'VT323',
		'Bebas Neue',
		'Zilla Slab',
		'Playfair Display',
	];

	const handleChangeFontFamily = useDebouncedCallback(async (fontFamilyKey: string) => {
		const payload = {
			theme: {
				...userSettings?.theme,
				fontFamily: fontFamilyKey,
			},
		};

		await editUserSettings(payload).unwrap();
		localStorage.setItem('font-family', fontFamilyKey);
	}, 500, true);

	const themeContext = useThemeContext();
	const { selectedFontFamilyKey } = themeContext;

	return (
		<fieldset className="border-0 p-0 m-0">
			<legend className="sr-only">Font Family</legend>
			{fontFamilies.map((fontFamilyName) => {
				const fontFamilyKey = fontFamilyName ? fontFamilyName : 'Default';

				return (
					<div key={fontFamilyKey} style={{ fontFamily: fontFamilyName ? `'${fontFamilyName}'` : undefined }}>
						<CustomRadioButton
							key={fontFamilyKey + 'radio'}
							label={FONT_USED_IN[fontFamilyKey] ? `${fontFamilyKey} (${FONT_USED_IN[fontFamilyKey].join(', ')})` : fontFamilyKey}
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
		</fieldset>
	);
};

export default FontFamilyList;
