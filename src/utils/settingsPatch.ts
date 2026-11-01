// Applies a settings change to a copy of the user's settings, the way the server will. A key like "pages.forest.landStyle" means a value deep inside the settings, and it is set by following that path. Other keys replace the top-level value, as before.
export const applySettingsPatch = (settings: Record<string, unknown>, patch: Record<string, unknown>) => {
	Object.entries(patch).forEach(([key, value]) => {
		if (!key.includes('.')) {
			settings[key] = value;
			return;
		}

		const path = key.split('.');
		const lastKey = path.pop() as string;
		let target = settings;

		path.forEach((step) => {
			const next = target[step];
			target[step] = next && typeof next === 'object' ? next : {};
			target = target[step] as Record<string, unknown>;
		});

		target[lastKey] = value;
	});
};
