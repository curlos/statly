import { motion, AnimatePresence } from 'framer-motion';
import ProjectsTickTickSection from '../../../components/FilterSidebar/ProjectsTickTickSection';

const ChallengesSettingsModal = ({ isSidebarModalOpen, setIsSidebarModalOpen }) => {
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
						<div className="font-bold text-[18px]">Challenges - Settings</div>
						<hr className="border-color-gray-200 my-4" />

						<div className="space-y-4">
							<div>
								<div className="font-bold mb-1">Focus</div>
								<img src="https://i.imgur.com/6xLKg5k.jpeg" />
							</div>

							<div>
								<div className="font-bold mb-1">Tasks</div>
								<img src="https://i.imgur.com/x084PtQ.png" />
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ChallengesSettingsModal;
