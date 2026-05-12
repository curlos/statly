import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { navigate } from 'vike/client/router';
import type { RootState } from '../../store/store';
import Icon from '../Icon';
import SyncSection from './SyncSection';
import UserProfileSection from './UserProfileSection';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import { useThemeContext } from '../../contexts/useThemeContext';
import DefaultDateRangeInterval from '../FilterSidebar/DefaultDateRangeInterval';
import { useDialogFocus } from '../../hooks/useDialogFocus';

const SidebarModal = () => {
	const dispatch = useDispatch();
	const isSidebarModalOpen = useSelector((state: RootState) => state.modals.modals.ModalSidebar?.isOpen);
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const handleClose = () => {
		dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: false }));
	};

	const panelRef = useDialogFocus<HTMLDialogElement>(isSidebarModalOpen ?? false, handleClose);
	const shouldReduceMotion = useReducedMotion();
	const sidebarVariants = {
		hidden: { x: shouldReduceMotion ? 0 : 300, opacity: 0, transition: { duration: 0.3 } },
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
			<a
				href={linkUrl}
				className="group flex items-center gap-2 rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
				onClick={(e) => {
					e.preventDefault();
					navigate(linkUrl);
					handleClose();
				}}
			>
				<span className="group-hover:underline">{name}</span>

				{iconName && (
					<span aria-hidden="true">
						<Icon name={iconName} fill={1} customClass={`${chosenColorObj.textColor} !text-[24px]`} />
					</span>
				)}
			</a>
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
					<motion.dialog
						ref={panelRef}
						open
						tabIndex={-1}
						aria-label="Main menu"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						aria-modal="true"
						className="fixed inset-y-0 right-0 left-auto w-[85%] max-w-[400px] h-full bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar flex flex-col border-0 m-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
						onClick={(e) => e.stopPropagation()}
					>
						<nav aria-label="Main navigation">
							<ul className="font-bold text-[24px] list-none p-0 m-0">
								<li><LinkLi name="Stats" linkUrl="/stats/overview" iconName="query_stats" /></li>
								<li><LinkLi name="Focus Time Goal" linkUrl="/focus-time-goal" iconName="flag" /></li>
								<li><LinkLi name="Focus Records" linkUrl="/focus-records" iconName="timer" /></li>
								<li><LinkLi name="Completed Tasks" linkUrl="/completed-tasks" iconName="select_check_box" /></li>
								<li><LinkLi name="Medals" linkUrl={"/medals/focus/daily"} iconName="workspace_premium" /></li>
								<li><LinkLi name="Challenges" linkUrl="/challenges/focus" iconName="swords" /></li>
							</ul>
						</nav>

						{/* Sync */}
						<hr aria-hidden="true" className="border-color-gray-100 my-4" />
						<SyncSection />

						<hr aria-hidden="true" className="border-color-gray-100 my-4" />
						<DefaultDateRangeInterval />

						{/* User Profile */}
						<hr aria-hidden="true" className="border-color-gray-100 my-4" />
						<UserProfileSection />
					</motion.dialog>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SidebarModal;
