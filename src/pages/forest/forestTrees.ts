export const DEFAULT_TREE = 'pine_tree';

// File names (without .png) in public/images/forest
export const TREE_NAMES = [
	'acorn_tree_blue',
	'acorn_tree_green',
	'acorn_tree_pink',
	'acorn_tree_purple',
	'acorn_tree_yellow',
	'anniversary_cake_10_fairies',
	'anniversary_cake_5',
	'anniversary_cake_6',
	'anniversary_cake_7',
	'anniversary_cake_8_squirrels',
	'anniversary_cake_9',
	'apple_tree',
	'bamboo',
	'banana_tree',
	'baobab_tree',
	'bird_of_paradise',
	'bird_tree',
	'bird_tree_christmas',
	'blue_hydrangea',
	'bonsai_tree',
	'cake_berry_cheesecake',
	'cake_black_forest',
	'cake_blueberry',
	'cake_lemon',
	'cake_matcha',
	'cake_strawberry_chocolate',
	'cake_strawberry_shortcake',
	'cake_tiramisu',
	'calla_lilies',
	'camellia_bush',
	'candy_tree',
	'carnations',
	'castle_tree',
	'castle_tree_christmas',
	'cat_tree',
	'checkmark_bubble_statue',
	'chibi_black_bucket_hat',
	'chibi_black_hair_headband',
	'chibi_blonde_hair',
	'chibi_brown_hair_red_outfit',
	'chibi_gray_hair_bandana',
	'chibi_mint_hair_pink_flowers',
	'chibi_silver_hair_blue_flowers',
	'christmas_wreath',
	'clock_tree',
	'cosmos_flowers',
	'cowboy_cactus',
	'crane_cloud_tree',
	'daffodils',
	'decorated_christmas_tree',
	'dog_tree',
	'fairy_boy_leaf',
	'fairy_christmas_tree',
	'fairy_girl_purple_flowers',
	'flower_bush',
	'flower_tree',
	'flower_tree_christmas',
	'flytrap_plant',
	'ghost_plant',
	'ginkgo_tree',
	'glowing_blue_flower',
	'glowing_orange_flower',
	'glowing_pine_tree',
	'glowing_teal_tree',
	'golden_rice',
	'haunted_ghost_tree',
	'heart_couple_trees',
	'ice_cream_tree',
	'jacaranda_tree',
	'jack_o_lantern',
	'lavender',
	'leaf_orb',
	'lemon_tree',
	'lemon_tree_christmas',
	'lotus_pond',
	'lunar_new_year_bamboo',
	'lunar_new_year_pussy_willow',
	'maple_tree',
	'monstera',
	'moon_rabbit_tree',
	'moon_tree',
	'mooncake_rabbits',
	'octopus_fountain_tree',
	'orange_sphere_tree',
	'orange_tree',
	'osmanthus_tree',
	'palm_tree',
	'pastel_crystal_tree',
	'pear_house',
	'pine_tree',
	'pine_tree_christmas',
	'pink_plum_blossom_tree',
	'pumpkin_scarecrow',
	'purple_hydrangea',
	'rafflesia',
	'rainbow_flower',
	'red_mushroom',
	'red_roses',
	'round_cactus',
	'sakura_tree',
	'spiky_grass',
	'star_coral_flower',
	'star_ufo_tree',
	'sunflowers',
	'teal_blossom_tree',
	'tree_house',
	'tree_house_christmas',
	'tulips',
	'unicorn_flowers',
	'water_heart_fountain',
	'watermelon',
	'white_glowing_tree',
	'white_lilies',
	'willow_tree',
	'winged_golden_pinecone',
	'wisteria_tree',
	'witch_hat_mushroom',
	'yellow_blossom_tree',
	'yellow_clover',
];

const TREE_NAMES_SET = new Set(TREE_NAMES);

export const getTreeImageSrc = (treeName: string) => `/images/forest/${treeName}.png`;

// A length of time as a screen reader should say it: 4200 -> "1 hour 10 minutes"
export const getSpokenDuration = (seconds: number) => {
	const totalMinutes = Math.floor(seconds / 60);

	if (totalMinutes < 1) {
		const wholeSeconds = Math.round(seconds);
		return `${wholeSeconds} ${wholeSeconds === 1 ? 'second' : 'seconds'}`;
	}

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const hoursText = hours > 0 ? `${hours.toLocaleString()} ${hours === 1 ? 'hour' : 'hours'}` : '';
	const minutesText = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';

	return [hoursText, minutesText].filter(Boolean).join(' ');
};

// "pine_tree_christmas" -> "Pine Tree Christmas"
export const getTreeDisplayName = (treeName: string) =>
	treeName
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

export const getAssignedTree = (projectId: string, projectTrees: Record<string, string>) => {
	const assignedTree = projectTrees[projectId];
	return assignedTree && TREE_NAMES_SET.has(assignedTree) ? assignedTree : DEFAULT_TREE;
};

// Trees from December records use their Christmas image if they have one.
export const getSeasonalTree = (treeName: string, startTime: string) => {
	const christmasTree = `${treeName}_christmas`;
	return new Date(startTime).getMonth() === 11 && TREE_NAMES_SET.has(christmasTree) ? christmasTree : treeName;
};

// The trees really planted for each project, most common first. This can be more than the one tree assigned to the project, because December records plant the Christmas version.
export const getPlantedTreeNames = (trees: { projectId: string; startTime: string }[], projectTrees: Record<string, string>) => {
	const countsByProject = new Map<string, Map<string, number>>();

	trees.forEach(({ projectId, startTime }) => {
		const treeName = getSeasonalTree(getAssignedTree(projectId, projectTrees), startTime);
		const counts = countsByProject.get(projectId) ?? new Map<string, number>();
		counts.set(treeName, (counts.get(treeName) ?? 0) + 1);
		countsByProject.set(projectId, counts);
	});

	return new Map(
		[...countsByProject].map(([projectId, counts]) => [projectId, [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([treeName]) => treeName)])
	);
};
