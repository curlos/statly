import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import AnalyzeNoteEmotions from '../FilterSidebar/AnalyzeNoteEmotions';
import CheckboxOther from '../FilterSidebar/CheckboxOther';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';

const SyncUpdateSection = () => {
	const {
		focusRecordsPageSettings: {
			analyzeNoteEmotionsWhileSyncingFocusRecords,
		},
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('focusRecords', userSettingProperty, newShowValue);
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Sync & Update</h3>
						<Icon
							name="sync"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				setIsOpenForParent={undefined}
				isChildDropdownOpen={true}
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				<AnalyzeNoteEmotions />

				<div className="mt-4 ml-6">
					<CheckboxOther
						{...{
							name: 'Analyze Note Emotions While Syncing Focus Records',
							showValue: analyzeNoteEmotionsWhileSyncingFocusRecords,
							handleCheckboxClick: () => handleCheckboxClick(analyzeNoteEmotionsWhileSyncingFocusRecords, 'analyzeNoteEmotionsWhileSyncingFocusRecords'),
						}}
					/>
				</div>
			</Accordion>
		</div>
	);
};

export default SyncUpdateSection;
