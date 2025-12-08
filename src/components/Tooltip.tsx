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
		if (!containerRef.current) return 'center';

		const rect = containerRef.current.getBoundingClientRect();

		// Find the nearest scrollable parent (modal or viewport)
		let scrollParent = containerRef.current.parentElement;
		while (scrollParent) {
			const overflow = window.getComputedStyle(scrollParent).overflow;
			if (overflow === 'auto' || overflow === 'scroll' || scrollParent === document.body) {
				break;
			}
			scrollParent = scrollParent.parentElement;
		}

		const containerRect = scrollParent?.getBoundingClientRect() || { left: 0, right: window.innerWidth };
		const availableWidth = containerRect.right - containerRect.left;
		const elementCenter = rect.left + rect.width / 2 - containerRect.left;

		// Estimate tooltip width (roughly 150-200px for these tooltips)
		const estimatedTooltipWidth = 180;
		const spaceOnLeft = elementCenter;
		const spaceOnRight = availableWidth - elementCenter;

		// If not enough space on right for center-aligned tooltip, align right
		if (spaceOnRight < estimatedTooltipWidth / 2 + 20) {
			return 'right';
		}
		// If not enough space on left for center-aligned tooltip, align left
		if (spaceOnLeft < estimatedTooltipWidth / 2 + 20) {
			return 'left';
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
