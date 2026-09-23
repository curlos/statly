import TimelineItemSkeleton from '../../../components/Skeletons/TimelineItemSkeleton';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';

const DayWithCompletedTasksSkeleton = ({ isLastItem = false }) => {
	const {
		focusRecordsPageSettings: { lowerCardOpacity },
	} = useUserSettingsContext();

	return (
		<TimelineItemSkeleton
			isLastItem={isLastItem}
			lowerOpacity={lowerCardOpacity}
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
