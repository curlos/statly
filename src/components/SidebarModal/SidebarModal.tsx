import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from 'vike/client/router';
import Icon from '../Icon';
import SyncSection from './SyncSection';
import UserProfileSection from './UserProfileSection';
import useGetDefaultMedalDates from '../../pages/medals/useGetDefaultMedalDates';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';

const SidebarModal = ({ isSidebarModalOpen, setIsSidebarModalOpen }) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	const LinkLi = ({ name, linkUrl, iconName }) => {
		return (
			<div
				className="group flex items-center gap-2 cursor-pointer"
				onClick={() => {
					navigate(linkUrl);
					setIsSidebarModalOpen(false);
				}}
			>
				<div className="group-hover:underline">{name}</div>

				{iconName && <Icon name={iconName} fill={1} customClass={'text-color-gray-50 !text-[24px]'} />}
			</div>
		);
	};

	const { startDate, endDate, dateInterval } = useGetDefaultMedalDates();
	const { buildUrlWithQueryParams } = useSearchParamsContext();

	const getMedalsLinkUrl = () => {
		if (dateInterval !== 'All' && startDate && endDate) {
			return buildUrlWithQueryParams(
				{ 'start-date': startDate, 'end-date': endDate, 'date-interval': dateInterval },
				'/medals/focus/daily',
				false // Don't preserve existing params from current page
			);
		}
		return '/medals/focus/daily';
	};

	return (
		<AnimatePresence>
			{isSidebarModalOpen && (
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
						onClick={() => setIsSidebarModalOpen(false)}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar flex flex-col"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="flex-1">
							<div className="font-bold text-[24px]">
								<LinkLi name="Stats" linkUrl="/stats/overview" iconName="network_intelligence_history" />
								<LinkLi name="Focus Hours Goal" linkUrl="/focus-hours-goal" iconName="clock_loader_20" />
								<LinkLi name="Focus Records" linkUrl="/focus-records" iconName="timeline" />
								<LinkLi name="Completed Tasks" linkUrl="/completed-tasks" iconName="select_check_box" />
								<LinkLi name="Medals" linkUrl={getMedalsLinkUrl()} iconName="workspace_premium" />
								<LinkLi name="Challenges" linkUrl="/challenges/focus" iconName="swords" />
							</div>

							{/* Sync */}
							<hr className="border-color-gray-200 my-4" />
							<SyncSection />

							{/* Theme Color */}
							{/* <hr className="border-color-gray-200 my-4" />
							<ThemeColorList /> */}

							{/* Font Families */}
							{/* <hr className="border-color-gray-200 my-4" />
							<FontFamilyList /> */}

							{/* Other */}
							{/* <hr className="border-color-gray-200 my-4" />
							<OtherSection /> */}
						</div>

						{/* User Profile */}
						<div className="pt-2">
							<UserProfileSection />
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SidebarModal;
