import { usePageContext } from 'vike-react/usePageContext';

const Link = (props) => {
	const { className, href } = props;
	const pageContext = usePageContext();
	const { urlPathname } = pageContext;
	const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href);
	const fullClassName = [className, isActive && 'is-active'].filter(Boolean).join(' ');
	return <a {...props} className={fullClassName} />;
};

export default Link;
