import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useThemeContext } from '../../../contexts/useThemeContext';

const DayWithCompletedTasksSkeleton = ({ isLastItem = false }) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor, bgColor } = chosenColorObj;

	return (
		<div className="m-0 list-none last:mb-[4px] w-full relative" style={{ minHeight: '54px' }}>
			<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
				<Icon name="check_box" customClass={classNames('!text-[20px]', textColor)} />
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
						{/* Date skeleton */}
						<div className={classNames("h-[28px] rounded-md w-[200px] animate-pulse", bgColor)}></div>

						{/* Task items skeleton */}
						<div className="space-y-2 pt-2">
							<div className={classNames("h-[20px] rounded-md w-[80%] animate-pulse", bgColor)}></div>
							<div className={classNames("h-[20px] rounded-md w-[80%] animate-pulse", bgColor)}></div>
							<div className={classNames("h-[20px] rounded-md w-[80%] animate-pulse", bgColor)}></div>
							<div className={classNames("h-[20px] rounded-md w-[80%] animate-pulse", bgColor)}></div>
							<div className={classNames("h-[20px] rounded-md w-[80%] animate-pulse", bgColor)}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayWithCompletedTasksSkeleton;
