import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from 'vike/client/router';
import type { RootState } from '../../store/store';
import Icon from '../Icon';
import SyncSection from './SyncSection';
import UserProfileSection from './UserProfileSection';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import { useThemeContext } from '../../contexts/useThemeContext';
import DefaultDateRangeInterval from '../FilterSidebar/DefaultDateRangeInterval';

const SidebarModal = () => {
	const dispatch = useDispatch();
	const isSidebarModalOpen = useSelector((state: RootState) => state.modals.modals.ModalSidebar?.isOpen);
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const handleClose = () => {
		dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: false }));
	};
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	interface LinkLiProps {
		name: string;
		linkUrl: string;
		iconName?: string;
	}

	const LinkLi: React.FC<LinkLiProps> = ({ name, linkUrl, iconName }) => {
		return (
			<div
				className="group flex items-center gap-2 cursor-pointer"
				onClick={() => {
					navigate(linkUrl);
					handleClose();
				}}
			>
				<div className="group-hover:underline">{name}</div>

				{iconName && <Icon name={iconName} fill={1} customClass={`${chosenColorObj.textColor} !text-[24px]`} />}
			</div>
		);
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
						onClick={handleClose}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar flex flex-col"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="font-bold text-[24px]">
							<LinkLi name="Stats" linkUrl="/stats/overview" iconName="query_stats" />
							<LinkLi name="Focus Hours Goal" linkUrl="/focus-hours-goal" iconName="flag" />
							<LinkLi name="Focus Records" linkUrl="/focus-records" iconName="timer" />
							<LinkLi name="Completed Tasks" linkUrl="/completed-tasks" iconName="select_check_box" />
							<LinkLi name="Medals" linkUrl={"/medals/focus/daily"} iconName="workspace_premium" />
							<LinkLi name="Challenges" linkUrl="/challenges/focus" iconName="swords" />
						</div>

						{/* Sync */}
						<hr className="border-color-gray-200 my-4" />
						<SyncSection />

						<hr className="border-color-gray-200 my-4" />
						<DefaultDateRangeInterval />

						{/* User Profile */}
						<hr className="border-color-gray-200 my-4" />
						<UserProfileSection />
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SidebarModal;
