import { useThemeContext } from '../../contexts/useThemeContext';

const LoaderMedal = () => {
	const themeContext = useThemeContext();
	const { selectedLoaderCardImage } = themeContext;

	return (
		<div className="">
			<img src={selectedLoaderCardImage} className="h-[120px] animate-pulse" />
		</div>
	);
};

export default LoaderMedal;
