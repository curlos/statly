import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';

// Vite resolves these to the bundled asset URLs
const iconUrl = (file: string) => new URL(`../../assets/themes/icons/${file}`, import.meta.url).href;

// Add future game UI themes (Witcher 3, etc.) here. Game themes use the game's desktop icon (from its Steam PC release).
const UI_THEMES: { key: string; label: string; icon?: string; emoji?: string }[] = [
	{ key: 'default', label: 'Default', icon: '/checklist-icon.svg' },
	{ key: 'p3r', label: 'Persona 3 Reload', icon: iconUrl('p3r.png') },
	{ key: 'p4', label: 'Persona 4 Golden', icon: iconUrl('p4.png') },
	{ key: 'p5', label: 'Persona 5', icon: iconUrl('p5.png') },
	{ key: 'cyberpunk', label: 'Cyberpunk 2077', icon: iconUrl('cyberpunk.png') },
	{ key: 'hades', label: 'Hades', icon: iconUrl('hades.png') },
	{ key: 'ff7r', label: 'Final Fantasy VII Remake', icon: iconUrl('ff7r.png') },
	{ key: 'mgs', label: 'Metal Gear Solid', icon: iconUrl('mgs.png') },
	{ key: 'rdr2', label: 'Red Dead Redemption 2', icon: iconUrl('rdr2.png') },
	{ key: 'ink-marker', label: 'Ink & Marker', emoji: '🖋️' },
];

const UiThemeList = () => {
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const { chosenColorObj, uiTheme } = useThemeContext();
	const { borderColor, bgColor } = chosenColorObj;

	const handleChangeUiTheme = async (key: string) => {
		localStorage.setItem('ui-theme', key);
		await editUserSettings({ theme: { ...userSettings?.theme, uiTheme: key } });
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-color-gray-25 text-[14px] text-center">
				Restyle the whole site after a video game UI. Game themes use their own colors and fonts. Your theme color, font, and color mode come back when you switch to Default.
			</p>
			<div className="flex flex-wrap justify-center gap-3">
				{UI_THEMES.map(({ key, label, icon, emoji }) => (
					<button
						key={key}
						type="button"
						aria-pressed={uiTheme === key}
						className={classNames(
							'flex flex-col items-center gap-2 px-6 py-4 rounded-xl cursor-pointer border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
							uiTheme === key ? classNames(borderColor, bgColor) : 'border-color-gray-300 bg-color-gray-300'
						)}
						onClick={() => uiTheme !== key && handleChangeUiTheme(key)}
					>
						{icon ? (
							<img src={icon} alt="" aria-hidden="true" className="w-[40px] h-[40px] object-contain" />
						) : (
							<span className="text-2xl" aria-hidden="true">{emoji}</span>
						)}
						<span className={classNames('text-[14px] font-bold', uiTheme === key ? '' : 'text-color-gray-25')}>
							{label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default UiThemeList;
