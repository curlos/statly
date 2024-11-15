import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../../components/Icon';
import SortBySection from './SortBySection';
import GroupBySection from './GroupBySection';
import DateRangeSection from './DateRangeSection';
import OtherSection from './OtherSection';
import ProjectsSection from './ProjectsSection';
import SearchSection from './SearchSection';

const ModalFilterSidebar = ({
	isOpen,
	setIsOpen,
	sortByOptions,
	GROUP_BY_OPTIONS,
	showCompletedTasks,
	setShowCompletedTasks,
	showTotalFocusDuration,
	setShowTotalFocusDuration,
}) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial="hidden"
					animate="visible"
					exit="hidden"
					className="fixed inset-0 z-40 flex justify-end"
				>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={backdropVariants}
						className="overlay absolute bg-black inset-0"
						onClick={() => setIsOpen(false)}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="flex justify-between items-center">
							<h2 className="font-bold text-[18px]">Filter</h2>
							<Icon
								name="close"
								fill={0}
								customClass={
									'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer bg-color-gray-600 rounded-2xl p-1'
								}
								onClick={() => setIsOpen(false)}
							/>
						</div>

						<SearchSection />

						<hr className="border-color-gray-200 my-4" />
						<SortBySection {...{ sortByOptions }} />

						<hr className="border-color-gray-200 my-4" />
						<GroupBySection {...{ GROUP_BY_OPTIONS }} />

						<hr className="border-color-gray-200 my-4" />
						<DateRangeSection />

						<hr className="border-color-gray-200 my-4" />
						<OtherSection
							{...{
								showCompletedTasks,
								setShowCompletedTasks,
								showTotalFocusDuration,
								setShowTotalFocusDuration,
							}}
						/>

						<hr className="border-color-gray-200 my-4" />
						<ProjectsSection />
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ModalFilterSidebar;
