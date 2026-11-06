import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import Icon from '../Icon';

import { UI_THEME_GROUPS, type UiTheme } from './uiThemes';

// Vite resolves these to the bundled asset URLs (paths starting with "/" are public files)
const iconUrl = (file: string) =>
	file.startsWith('/') ? file : new URL(`../../assets/themes/icons/${file}`, import.meta.url).href;

const DEFAULT_THEME: UiTheme = { key: 'default', label: 'Default', icon: '/checklist-icon.svg' };

const UiThemeList = () => {
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const { chosenColorObj, uiTheme } = useThemeContext();
	const { borderColor, bgColor, textColor } = chosenColorObj;

	const handleChangeUiTheme = async (key: string) => {
		localStorage.setItem('ui-theme', key);
		await editUserSettings({ theme: { ...userSettings?.theme, uiTheme: key } });
	};

	// One selectable theme row (icon or emoji + label).
	const renderThemeButton = ({ key, label, icon, emoji }: UiTheme) => (
		<button
			key={key}
			type="button"
			aria-pressed={uiTheme === key}
			className={classNames(
				'flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl cursor-pointer border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
				uiTheme === key ? classNames(borderColor, bgColor) : 'border-color-gray-300 bg-color-gray-300'
			)}
			onClick={() => uiTheme !== key && handleChangeUiTheme(key)}
		>
			{icon ? (
				<img src={iconUrl(icon)} alt="" aria-hidden="true" className="w-[40px] h-[40px] object-contain" />
			) : (
				<span className="text-2xl" aria-hidden="true">
					{emoji}
				</span>
			)}
			<span className={classNames('text-[14px] font-bold', uiTheme === key ? '' : 'text-color-gray-25')}>
				{label}
			</span>
			{uiTheme === key && (
				<span className="ml-auto flex items-center gap-1 text-[12px] font-bold">
					<Icon name="check_circle" fill={1} customClass="!text-[18px]" aria-hidden={true} />
					Selected
				</span>
			)}
		</button>
	);

	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-color-gray-25 text-[14px] text-center">
				Restyle the whole site after a video game UI. Game themes use their own colors and fonts. Your theme
				color, font, and color mode come back when you switch to Default.
			</p>
			<div className="flex flex-col w-full gap-2">
				<div className="mb-3">{renderThemeButton(DEFAULT_THEME)}</div>
				{UI_THEME_GROUPS.map(({ label, themes }) => {
					const selectedTheme = themes.find((theme) => theme.key === uiTheme);

					return (
						<Accordion
							key={label}
							openByDefault={!!selectedTheme}
							title={
								<div className="flex items-center gap-2 min-w-0">
									<img
										src={iconUrl(themes[0].icon ?? '')}
										alt=""
										aria-hidden="true"
										className="w-[24px] h-[24px] object-contain"
									/>
									<span className={classNames('font-semibold', selectedTheme && textColor)}>
										{label} ({themes.length})
									</span>
									{selectedTheme && (
										<span
											className={classNames(
												'flex items-center gap-1 text-[12px] truncate',
												textColor
											)}
										>
											<Icon
												name="check_circle"
												fill={1}
												customClass="!text-[16px]"
												aria-hidden={true}
											/>
											{selectedTheme.label}
										</span>
									)}
								</div>
							}
						>
							<div className="flex flex-col gap-2 mb-3">{themes.map(renderThemeButton)}</div>
						</Accordion>
					);
				})}
			</div>
		</div>
	);
};

export default UiThemeList;
