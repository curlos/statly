import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from './FilterSidebar';

interface ModalFilterSidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	sortByOptions?: string[];
	page: string;
}

const ModalFilterSidebar: React.FC<ModalFilterSidebarProps> = ({ isOpen, setIsOpen, sortByOptions, page }) => {
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

					<FilterSidebar
						{...{
							setIsOpen,
							sortByOptions,
							isForModal: true,
							page,
						}}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ModalFilterSidebar;
