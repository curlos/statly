import { useState, useRef } from 'react';

interface TooltipProps {
	content: string | React.ReactNode;
	children: React.ReactNode;
	className?: string;
	position?: 'top' | 'bottom';
}

const Tooltip = ({ content, children, className = '', position = 'top' }: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate alignment when mouse enters
	const handleMouseEnter = () => {
		setIsVisible(true);
	};

	const handleMouseLeave = () => {
		setIsVisible(false);
	};

	// Determine alignment based on container position
	const getAlignment = (): 'left' | 'right' | 'center' => {
		if (!containerRef.current) return 'right';

		const rect = containerRef.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;

		// If element is in the left third of viewport, align left
		if (rect.left < viewportWidth / 3) {
			return 'left';
		}
		// If element is in the right third of viewport, align right
		if (rect.right > (viewportWidth * 2) / 3) {
			return 'right';
		}
		// Otherwise center
		return 'center';
	};

	const align = getAlignment();

	const positionClasses = position === 'top'
		? 'bottom-full mb-2'
		: 'top-full mt-2';

	const horizontalAlign = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

	const arrowClasses = position === 'top'
		? `absolute top-full ${align === 'left' ? 'left-2' : align === 'right' ? 'right-2' : 'left-1/2 -translate-x-1/2'} -mt-1`
		: `absolute bottom-full ${align === 'left' ? 'left-2' : align === 'right' ? 'right-2' : 'left-1/2 -translate-x-1/2'} -mb-1`;

	const arrowBorderClasses = position === 'top'
		? 'border-4 border-transparent border-t-color-gray-300'
		: 'border-4 border-transparent border-b-color-gray-300';

	return (
		<div
			ref={containerRef}
			className="relative inline-block"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			{isVisible && (
				<div
					className={`absolute ${positionClasses} ${horizontalAlign} px-3 py-2 bg-color-gray-300 border border-color-gray-200 text-white text-sm rounded z-50 ${className}`}
				>
					{content}
					<div className={arrowClasses}>
						<div className={arrowBorderClasses}></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Tooltip;
