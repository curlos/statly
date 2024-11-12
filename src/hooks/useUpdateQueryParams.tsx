import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';

export const useUpdateQueryParams = () => {
	const pageContext = usePageContext();

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

	return updateQueryParams;
};
