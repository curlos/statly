import TimelineItemSkeleton from '../../../components/Skeletons/TimelineItemSkeleton';

const DayWithCompletedTasksSkeleton = ({ isLastItem = false }) => {
	return (
		<TimelineItemSkeleton
			isLastItem={isLastItem}
			iconName="check_box"
			headerHeight="h-[28px]"
			headerWidth="w-[200px]"
			contentLines={[
				{ height: 'h-[20px]', width: 'w-[80%]' },
				{ height: 'h-[20px]', width: 'w-[80%]' },
				{ height: 'h-[20px]', width: 'w-[80%]' },
				{ height: 'h-[20px]', width: 'w-[80%]' },
				{ height: 'h-[20px]', width: 'w-[80%]' },
			]}
		/>
	);
};

export default DayWithCompletedTasksSkeleton;
