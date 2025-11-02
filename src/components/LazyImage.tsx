import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Spinner from './Loaders/Spinner';
import { isPokemonTcgCard } from '../utils/focus-apps/helpers.utils';

interface LazyImageProps {
	src: string;
	alt?: string;
	className?: string;
	onLoad?: () => void;
	onError?: () => void;
	usePokemonCardSkeleton?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt = '', className = '', onLoad, onError }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const [hasError, setHasError] = useState(false);
	const placeholderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{
				threshold: 0.1,
				rootMargin: '50px',
			}
		);

		if (placeholderRef.current) {
			observer.observe(placeholderRef.current);
		}

		return () => observer.disconnect();
	}, []);

	const handleLoad = () => {
		setIsLoaded(true);
		onLoad?.();
	};

	const handleError = () => {
		setHasError(true);
		onError?.();
	};

	const usePokemonCardSkeleton = isPokemonTcgCard(src)

	if (!isInView) {
		const containerStyle = usePokemonCardSkeleton ? { aspectRatio: '162 / 226' } : {};

		return (
			<div ref={placeholderRef} className={classNames('relative', className)} style={containerStyle}>
				{usePokemonCardSkeleton ? (
					<div className="bg-color-gray-150 rounded-lg animate-pulse w-full h-full" />
				) : (
					<Spinner size="md" />
				)}
			</div>
		);
	}

	if (hasError) {
		return <span className="text-xs text-red-500">Failed to load</span>;
	}

	// Check if specific width/height classes are provided for Pokemon cards
	const hasSpecificDimensions = className.includes('w-[');

	const containerStyle = hasSpecificDimensions
		? { minWidth: 'max-content' }
		: usePokemonCardSkeleton
		? { aspectRatio: '162 / 226' }
		: {};

	return (
		<div ref={placeholderRef} className={classNames('relative', className)} style={containerStyle}>
			{!isLoaded && (
				<div className="absolute inset-0">
					{usePokemonCardSkeleton ? (
						<div className="bg-color-gray-150 rounded-lg animate-pulse w-full h-full" />
					) : (
						<Spinner size="md" />
					)}
				</div>
			)}
			<img
				src={src}
				alt={alt}
				className={classNames(
					'block transition-opacity duration-200',
					isLoaded ? 'opacity-100' : 'opacity-0',
					className
				)}
				onLoad={handleLoad}
				onError={handleError}
				loading="lazy"
				decoding="async"
			/>
		</div>
	);
};

export default LazyImage;
