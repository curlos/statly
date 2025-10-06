import { useState } from 'react';

interface TooltipProps {
	content: string | React.ReactNode;
	children: React.ReactNode;
	className?: string;
	position?: 'top' | 'bottom';
}

const Tooltip = ({ content, children, className = '', position = 'top' }: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);

	const positionClasses = position === 'top'
		? 'bottom-full mb-2'
		: 'top-full mt-2';

	const arrowClasses = position === 'top'
		? 'absolute top-full right-2 -mt-1'
		: 'absolute bottom-full right-2 -mb-1';

	const arrowBorderClasses = position === 'top'
		? 'border-4 border-transparent border-t-color-gray-300'
		: 'border-4 border-transparent border-b-color-gray-300';

	return (
		<div
			className="relative inline-block"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{children}
			{isVisible && (
				<div className={`absolute ${positionClasses} right-0 px-3 py-2 bg-color-gray-300 border border-color-gray-200 text-white text-sm rounded z-50 ${className}`}>
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
