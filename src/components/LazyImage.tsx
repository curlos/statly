import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Spinner from './Loaders/Spinner';

interface LazyImageProps {
	src: string;
	alt?: string;
	className?: string;
	onLoad?: () => void;
	onError?: () => void;
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

	if (!isInView) {
		return (
			<div ref={placeholderRef}>
				<Spinner size="md" />
			</div>
		);
	}

	if (hasError) {
		return <span className="text-xs text-red-500">Failed to load</span>;
	}

	const hasSpecificWidth = className.includes('w-[') || className.includes('w-') || className.includes('max-w') || className.includes('min-w');
	const containerStyle = hasSpecificWidth ? { minWidth: 'max-content' } : {};

	return (
		<div ref={placeholderRef} className={classNames('relative', className)} style={containerStyle}>
			{!isLoaded && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<Spinner size="md" />
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
