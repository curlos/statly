import { createContext, useContext, useEffect, useState } from 'react';

const FontLoadingContext = createContext({});

export const useFontLoadingContext = () => {
	return useContext(FontLoadingContext);
};

export const FontLoadingProvider = ({ children }: { children: React.ReactNode }) => {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		document.fonts.load('24px "Material Symbols Rounded"').then(() => {
			setFontsLoaded(true);
		}).catch((error) => {
			console.error('Failed to load Material Symbols font:', error);
			setFontsLoaded(true);
		});
	}, []);

	return <FontLoadingContext.Provider value={{ fontsLoaded }}>{children}</FontLoadingContext.Provider>;
};
