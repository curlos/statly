import TimelineItemSkeleton from '../../components/Skeletons/TimelineItemSkeleton';

const FocusRecordSkeleton = ({ isLastItem = false }) => {
	return (
		<TimelineItemSkeleton
			isLastItem={isLastItem}
			iconName="timer"
			headerHeight="h-[24px]"
			headerWidth="w-[300px]"
			contentLines={[
				{ height: 'h-[28px]', width: 'w-[70%]' },
				{ height: 'h-[20px]', width: 'w-[90%]' },
				{ height: 'h-[20px]', width: 'w-[85%]' },
				{ height: 'h-[20px]', width: 'w-[80%]' },
			]}
		/>
	);
};

export default FocusRecordSkeleton;
