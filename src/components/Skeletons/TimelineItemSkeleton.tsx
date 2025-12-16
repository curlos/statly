import Icon from '../Icon';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';

interface TimelineItemSkeletonProps {
	isLastItem?: boolean;
	iconName?: string;
	headerHeight?: string;
	headerWidth?: string;
	contentLines?: Array<{ height: string; width: string }>;
}

const TimelineItemSkeleton = ({
	isLastItem = false,
	iconName = 'timer',
	headerHeight = 'h-[24px]',
	headerWidth = 'w-[300px]',
	contentLines = [
		{ height: 'h-[28px]', width: 'w-[70%]' },
		{ height: 'h-[20px]', width: 'w-[90%]' },
		{ height: 'h-[20px]', width: 'w-[85%]' },
		{ height: 'h-[20px]', width: 'w-[80%]' },
	],
}: TimelineItemSkeletonProps) => {
	const themeContext = useThemeContext();
	const { chosenColorObj, nextDarkestColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	return (
		<div className="m-0 list-none last:mb-[4px] w-full relative" style={{ minHeight: '54px' }}>
			<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
				<Icon name={iconName} customClass={classNames('!text-[20px]', textColor)} />
			</div>

			{!isLastItem && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="ml-[25px] sm:ml-[40px] relative m-0 break-words" style={{ marginTop: 'unset' }}>
				{!isLastItem && (
					<div
						className={classNames(
							'absolute left-[-18px] sm:left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600',
							borderColor
						)}
						style={{ top: '34px' }}
					></div>
				)}

				<div className={classNames(bgColorHalfOpacity, 'p-2 rounded-lg w-[95%] sm:w-full')}>
					<div className="space-y-2">
						{/* Header skeleton */}
						<div
							className={classNames(
								headerHeight,
								headerWidth,
								'rounded-md animate-pulse',
								nextDarkestColorObj?.bgColorHalfOpacity
							)}
						></div>

						{/* Content lines skeleton */}
						<div className="space-y-2 pt-2">
							{contentLines.map((line, index) => (
								<div
									key={index}
									className={classNames(
										line.height,
										line.width,
										'rounded-md animate-pulse',
										nextDarkestColorObj?.bgColorHalfOpacity
									)}
								></div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimelineItemSkeleton;
