import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';
import { useEffect } from 'react';

const Page = () => {
	const pageContext = usePageContext();

	useEffect(() => {
		if (pageContext.is404) {
			navigate('/stats/overview');
		}
	}, [pageContext.is404]);

	return <div>Something went wrong fool!</div>;
};

export default Page;
