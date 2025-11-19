import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import AnalyzeNoteEmotions from '../FilterSidebar/AnalyzeNoteEmotions';

const SyncUpdateSection = () => {
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
			</Accordion>
		</div>
	);
};

export default SyncUpdateSection;
