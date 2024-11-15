import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const Accordion = ({ title, children, setIsOpenForParent }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
		setIsOpenForParent(!isOpen);
	};

	return (
		<div>
			<button
				onClick={toggleOpen}
				className="p-2 w-full text-left flex justify-between items-center focus:outline-none hover:bg-color-gray-300 rounded-xl"
			>
				{title}
				<Icon
					name={isOpen ? 'keyboard_arrow_down' : 'chevron_right'}
					fill={1}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="pl-6">{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Accordion;
