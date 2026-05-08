import { motion } from 'framer-motion';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import Icon from '../Icon';
import classNames from 'classnames';
import OtherSectionFocusRecords from '../FilterSidebar/OtherSectionFocusRecords';
import OtherSectionCompletedTasks from '../FilterSidebar/OtherSectionCompletedTasks';
import ExportBackupSectionFocusRecords from '../FilterSidebar/ExportBackupSectionFocusRecords';
import ExportBackupSectionCompletedTasks from '../FilterSidebar/ExportBackupSectionCompletedTasks';
import SyncUpdateSection from './SyncUpdateSection';
import CardImage from '../../pages/challenges/CardImage';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import FocusHoursGoalPageSettingsSection from '../FilterSidebar/FocusHoursGoalPageSettingsSection';

interface SettingsSidebarProps {
	setIsOpen: (isOpen: boolean) => void;
	page: string;
	useSlidingMotion?: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ setIsOpen, page, useSlidingMotion = true }) => {
	const panelRef = useDialogFocus<HTMLDialogElement>(true, () => setIsOpen(false));
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const {
		challengesPageSettings: { selectedChallengeCardImage },
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const isForChallengesPage = page === 'challenges-page';
	const isForMedalsPage = page === 'medals-page';
	const showImagesSection = isForChallengesPage || isForMedalsPage;

	return (
		<motion.dialog
			ref={panelRef}
			open
			tabIndex={-1}
			aria-label="Settings"
			initial="hidden"
			animate="visible"
			exit="hidden"
			variants={useSlidingMotion ? sidebarVariants : undefined}
			className={classNames(
				'inset-y-0 bg-color-gray-700 text-white overflow-auto gray-scrollbar p-4 fixed right-0 left-auto w-[85%] max-w-[400px] h-full border-0 m-0 focus:outline-none',
			)}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex justify-between items-center">
				<h2 className="font-bold text-[18px]">Settings</h2>
				<div className="flex items-center gap-3">
					<Icon
						name="close"
						fill={0}
						customClass={
							'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer bg-color-gray-600 rounded-2xl p-1'
						}
						onClick={() => setIsOpen(false)}
					/>
				</div>
			</div>

			{/* Focus Records Page */}
			{page === 'focus-records-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<OtherSectionFocusRecords />
				</>
			)}
			{page === 'focus-records-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<SyncUpdateSection />
				</>
			)}
			{page === 'focus-records-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<ExportBackupSectionFocusRecords />
				</>
			)}
			
			{/* Completed Tasks Page */}
			{page === 'completed-tasks-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<OtherSectionCompletedTasks />
				</>
			)}
			{page === 'completed-tasks-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<ExportBackupSectionCompletedTasks />
				</>
			)}

			{/* Challenges & Medals Pages - Images Section */}
			{showImagesSection && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<div className="space-y-4">
						<CardImage
							cardType="Focus"
							imageSrc={
								isForChallengesPage
									? selectedChallengeCardImage?.focus || ''
									: selectedMedalCardImage?.focus || ''
							}
							page={isForChallengesPage ? 'challenges' : 'medals'}
						/>
						<CardImage
							cardType="Tasks"
							imageSrc={
								isForChallengesPage
									? selectedChallengeCardImage?.tasks || ''
									: selectedMedalCardImage?.tasks || ''
							}
							page={isForChallengesPage ? 'challenges' : 'medals'}
						/>
					</div>
				</>
			)}

			{page === 'focus-time-goal-page' && (
				<div>
					<hr className="border-color-gray-100 my-4" />
					<FocusHoursGoalPageSettingsSection />
				</div>
			)}
		</motion.dialog>
	);
};

export default SettingsSidebar;
