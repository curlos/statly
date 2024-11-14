import { createContext, useContext, useEffect, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';

const SearchParamsContext = createContext();

export const useSearchParamsContext = () => {
	return useContext(SearchParamsContext);
};

export const SearchParamsProvider = ({ children }) => {
	const searchParams = useSearchParamsCustom();
	return <SearchParamsContext.Provider value={searchParams}>{children}</SearchParamsContext.Provider>;
};

export const useSearchParamsCustom = () => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));

	useEffect(() => {
		// This effect will update the searchParams state whenever the URL search part changes
		const newSearchParams = new URLSearchParams(location.search);
		setSearchParams(newSearchParams);
	}, [location.search]);

	const updateQueryParams = (newParams) => {
		// Preserve existing query params
		const searchParams = new URLSearchParams(location.search);

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
			? `${pageContext.urlParsed.pathname}?${queryString}`
			: pageContext.urlParsed.pathname;

		// Navigate to the new URL with updated query params
		navigate(newUrl, { replace: true });
	};

	return {
		searchParams,
		updateQueryParams,
	};
};
