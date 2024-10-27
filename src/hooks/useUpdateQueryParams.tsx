import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';

export const useUpdateQueryParams = () => {
	const pageContext = usePageContext();

	const updateQueryParams = (newParams) => {
		// Preserve existing query params
		const searchParams = new URLSearchParams(location.search);

		// Update or set new parameters
		Object.keys(newParams).forEach((key) => {
			searchParams.set(key, newParams[key]);
		});

		// Navigate to the new URL with updated query params
		navigate(`${pageContext.urlParsed.pathname}?${searchParams.toString()}`, { replace: true });
	};

	return updateQueryParams;
};
