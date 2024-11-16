import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const Accordion = ({ title, children, setIsOpenForParent, openByDefault, isChildDropdownOpen }) => {
	const [isOpen, setIsOpen] = useState(openByDefault ? true : false);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
		setIsOpenForParent(!isOpen);
	};

	return (
		<div>
			<button
				onClick={toggleOpen}
				className="w-full text-left flex justify-between items-center focus:outline-none rounded-xl mb-2"
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
						className={isOpen && isChildDropdownOpen ? 'overflow-visible' : 'overflow-hidden'}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Accordion;
