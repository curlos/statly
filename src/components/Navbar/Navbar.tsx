import useResizeObserver from '../../hooks/useResizeObserver';

const Navbar = ({ topHeaderRef, setHeaderHeight }) => {
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	return (
		<div ref={topHeaderRef} className="container pt-4 pb-2">
			<img src="/gundam-nu-icon.webp" className="h-[40px]" />
		</div>
	);
};

export default Navbar;
