import TimelineItemSkeleton from '../../components/Skeletons/TimelineItemSkeleton';
import { useUserSettingsContext } from './useUserSettingsContext';

const FocusRecordSkeleton = ({ isLastItem = false }) => {
	const {
		focusRecordsPageSettings: { lowerCardOpacity },
	} = useUserSettingsContext();

	return (
		<TimelineItemSkeleton
			isLastItem={isLastItem}
			lowerOpacity={lowerCardOpacity}
			iconName="timer"
			headerHeight="h-[24px]"
			headerWidth="w-[250px]"
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
