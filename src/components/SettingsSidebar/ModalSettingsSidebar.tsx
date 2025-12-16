import { motion, AnimatePresence } from 'framer-motion';
import SettingsSidebar from './SettingsSidebar';

interface ModalSettingsSidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	page: string;
}

const ModalSettingsSidebar: React.FC<ModalSettingsSidebarProps> = ({ isOpen, setIsOpen, page }) => {
	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.3, transition: { duration: 0.3 } },
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

					<SettingsSidebar
						{...{
							setIsOpen,
							page,
						}}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ModalSettingsSidebar;
