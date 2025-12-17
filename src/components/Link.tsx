import { usePageContext } from 'vike-react/usePageContext';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
}

const Link = (props: LinkProps) => {
	const { className, href } = props;
	const pageContext = usePageContext();
	const { urlPathname } = pageContext;
	const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href);
	const fullClassName = [className, isActive && 'is-active'].filter(Boolean).join(' ');
	return <a {...props} className={fullClassName} />;
};

export default Link;
