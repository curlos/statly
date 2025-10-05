import { useState } from 'react';

interface TooltipProps {
	content: string;
	children: React.ReactNode;
	className?: string;
}

const Tooltip = ({ content, children, className = '' }: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div
			className="relative inline-block"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{children}
			{isVisible && (
				<div className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-color-gray-300 border border-color-gray-200 text-white text-sm rounded whitespace-nowrap z-50 ${className}`}>
					{content}
					<div className="absolute top-full right-2 -mt-1">
						<div className="border-4 border-transparent border-t-color-gray-300"></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Tooltip;
