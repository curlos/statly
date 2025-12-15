import { createContext, useContext, useEffect, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';

const useSearchParamsCustom = () => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));

	useEffect(() => {
		// This effect will update the searchParams state whenever the URL search part changes
		const newSearchParams = new URLSearchParams(location.search);
		setSearchParams(newSearchParams);
	}, [location.search]);

	const buildUrlWithQueryParams = (newParams: Record<string, string>, customNewUrl?: string, preserveExisting = true) => {
		// Preserve existing query params or start fresh
		const searchParams = preserveExisting
			? new URLSearchParams(location.search)
			: new URLSearchParams();

		// Update or set new parameters
		Object.keys(newParams).forEach((key) => {
			if (newParams[key] === '') {
				searchParams.delete(key); // Remove the param if the value is an empty string
			} else {
				searchParams.set(key, newParams[key]); // Otherwise, update or set the param
			}
		});

		// Construct the new URL
		const queryString = searchParams.toString();
		const newUrl = queryString
			? `${customNewUrl ? customNewUrl : pageContext.urlParsed.pathname}?${queryString}`
			: customNewUrl
				? customNewUrl
				: pageContext.urlParsed.pathname;

		return newUrl;
	};

	const updateQueryParams = (newParams: Record<string, string>, customNewUrl?: string) => {
		const newUrl = buildUrlWithQueryParams(newParams, customNewUrl);
		// Navigate to the new URL with updated query params
		navigate(newUrl);
	};

	return {
		searchParams,
		updateQueryParams,
		buildUrlWithQueryParams,
	};
};

type SearchParamsContextValue = ReturnType<typeof useSearchParamsCustom>;

const SearchParamsContext = createContext<SearchParamsContextValue | undefined>(undefined);

export const useSearchParamsContext = () => {
	const context = useContext(SearchParamsContext);
	if (!context) {
		throw new Error('useSearchParamsContext must be used within SearchParamsProvider');
	}
	return context;
};

interface SearchParamsProviderProps {
	children: React.ReactNode;
}

export const SearchParamsProvider: React.FC<SearchParamsProviderProps> = ({ children }) => {
	const value = useSearchParamsCustom();
	return <SearchParamsContext.Provider value={value}>{children}</SearchParamsContext.Provider>;
};

export { useSearchParamsCustom };
