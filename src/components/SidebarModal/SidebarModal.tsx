import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from 'vike/client/router';
import Icon from '../Icon';
import ThemeColorList from './ThemeColorList';

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
			<div className="flex items-center gap-2">
				<div
					className="cursor-pointer hover:underline"
					onClick={() => {
						navigate(linkUrl);
						setIsSidebarModalOpen(false);
					}}
				>
					{name}
				</div>

				{iconName && (
					<Icon
						name={iconName}
						fill={1}
						customClass={'text-color-gray-50 !text-[24px] hover:text-white cursor-pointer'}
					/>
				)}
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
						onClick={() => setIsSidebarModalOpen(false)}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="font-bold text-[24px]">
							<LinkLi
								name="Focus Hours Goal"
								linkUrl="/ticktick-1.00/focus-hours-goal"
								iconName="clock_loader_20"
							/>
							<LinkLi name="Focus Records" linkUrl="/ticktick-1.00/focus-records" iconName="timeline" />
							<LinkLi name="Stats" linkUrl="/stats/overview" iconName="network_intelligence_history" />
						</div>

						{/* Theme Color */}
						<hr className="border-color-gray-200 my-4" />
						<ThemeColorList />
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SidebarModal;
