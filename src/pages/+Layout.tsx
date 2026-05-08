import { useEffect } from 'react';
import { usePageContext } from 'vike-react/usePageContext';

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const pageContext = usePageContext();

	// Because this is an SPA, when you go to a new page, it doesn't do a full reload and this causes an issue for screen reader users because if they focused on an element from the previous page, when they go to the new page, they will STILL be focused on the element from the previous page which will now be an invisible, detached element that's no longer in the DOM. To prevent any weird screen reader issues, it's better to always re-focus on the page's main content each time the URL changes.
	useEffect(() => {
		document.getElementById('main-content')?.focus({ preventScroll: true });
	}, [pageContext.urlPathname]);

	return (
		<div className="text-white">
			{/* This is a link meant for screen reader or keyboard-only users to be able to skip redundant header content on each page. */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none"
			>
				Skip to main content
			</a>
			{children}
		</div>
	);
};
