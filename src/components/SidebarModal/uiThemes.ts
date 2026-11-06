// UI theme data shared by the theme picker and the theme context (plain data, so tests can import it).

export type UiTheme = { key: string; label: string; icon?: string; emoji?: string };

// Game UI themes ignore the user's theme color and always use their signature accent color.
export const GAME_THEME_COLORS: Record<string, string> = {
	hades: '#D9B650',
	p3r: '#3FE3F5',
	p5: '#E5191C',
	cyberpunk: '#FF5C57',
	p4: '#FFE200',
	ff7r: '#3AA0FF',
	mgs: '#7DFFB0',
	rdr2: '#C01D1D',
	bf1: '#EDE8DD',
	'bf1-blue': '#43B0D8',
	'bf1-red': '#FF5A3C',
	warzone: '#F2A93B',
	hades2: '#6BE3B0',
	sotn: '#B3202A',
	'mario-wonder': '#FAD02C',
	'pokemon-rse': '#E03030',
	'pokemon-plat': '#E8702A',
	'dk-bananza': '#FFF200',
};

// Game UI themes with a light look (the rest force dark mode).
export const LIGHT_GAME_THEMES = ['p4', 'mario-wonder', 'pokemon-rse', 'pokemon-plat'];

// Game UI themes grouped by series (one accordion each). `icon` is a file in src/assets/themes/icons (the game's Steam desktop icon when it has one).
export const UI_THEME_GROUPS: { label: string; themes: UiTheme[] }[] = [
	{
		label: 'Mario & Donkey Kong',
		themes: [
			{ key: 'mario-wonder', label: 'Super Mario Bros. Wonder', icon: 'mario-wonder.png' },
			{ key: 'dk-bananza', label: 'Donkey Kong Bananza', icon: 'dk-bananza.png' },
		],
	},
	{
		label: 'Pokémon',
		themes: [
			{ key: 'pokemon-rse', label: 'Pokémon Ruby, Sapphire & Emerald', icon: 'pokemon-rse.svg' },
			{ key: 'pokemon-plat', label: 'Pokémon Platinum', icon: 'pokemon-plat.svg' },
		],
	},
	{
		label: 'Persona',
		themes: [
			{ key: 'p3r', label: 'Persona 3 Reload', icon: 'p3r.png' },
			{ key: 'p4', label: 'Persona 4 Golden', icon: 'p4.png' },
			{ key: 'p5', label: 'Persona 5', icon: 'p5.png' },
		],
	},
	{
		label: 'Hades',
		themes: [
			{ key: 'hades', label: 'Hades', icon: 'hades.png' },
			{ key: 'hades2', label: 'Hades II', icon: 'hades2.png' },
		],
	},
	{
		label: 'Battlefield & Call of Duty',
		themes: [
			{ key: 'bf1', label: 'Battlefield 1', icon: 'bf1.png' },
			{ key: 'bf1-blue', label: 'Battlefield 1 (Blue Team)', icon: 'bf1.png' },
			{ key: 'bf1-red', label: 'Battlefield 1 (Red Team)', icon: 'bf1.png' },
			{ key: 'warzone', label: 'Call of Duty: Warzone', icon: 'warzone.png' },
		],
	},
	{
		label: 'Konami',
		themes: [
			{ key: 'mgs', label: 'Metal Gear Solid', icon: 'mgs.png' },
			{ key: 'sotn', label: 'Castlevania: Symphony of the Night', icon: 'sotn.png' },
		],
	},
	{
		label: 'More',
		themes: [
			{ key: 'cyberpunk', label: 'Cyberpunk 2077', icon: 'cyberpunk.png' },
			{ key: 'ff7r', label: 'Final Fantasy VII Remake', icon: 'ff7r.png' },
			{ key: 'rdr2', label: 'Red Dead Redemption 2', icon: 'rdr2.png' },
			{ key: 'ink-marker', label: 'Ink & Marker', emoji: '🖋️' },
		],
	},
];
