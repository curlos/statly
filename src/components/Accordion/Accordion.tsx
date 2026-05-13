import { useId, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Icon from '../Icon';
import classNames from 'classnames';

interface AccordionProps {
	title: React.ReactNode;
	children: React.ReactNode;
	setIsOpenForParent?: (isOpen: boolean) => void;
	openByDefault?: boolean;

	showArrowNextToText?: boolean;
	customClasses?: string;
	customToggleOpen?: () => void;
	preventOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
	title,
	children,
	setIsOpenForParent,
	openByDefault,

	showArrowNextToText,
	customClasses,
	customToggleOpen,
	preventOpen,
}) => {
	const [isOpen, setIsOpen] = useState(openByDefault ? true : false);
	const [overflowHidden, setOverflowHidden] = useState(!openByDefault);
	const panelId = useId();
	const shouldReduceMotion = useReducedMotion();

	const toggleOpen = () => {
		if (customToggleOpen) {
			customToggleOpen();
		}

		if (preventOpen) {
			return;
		}

		if (isOpen) {
			setOverflowHidden(true);
		}

		setIsOpen(!isOpen);

		if (setIsOpenForParent) {
			setIsOpenForParent(!isOpen);
		}
	};

	return (
		<div className={customClasses ? customClasses : ''}>
			<button
				onClick={toggleOpen}
				aria-expanded={isOpen}
				aria-controls={panelId}
				className={classNames(
					'w-full text-left flex gap-2 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded mb-3',
					showArrowNextToText ? 'justify-start' : 'justify-between'
				)}
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
						id={panelId}
						initial={{ opacity: 0, height: shouldReduceMotion ? 'auto' : 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: shouldReduceMotion ? 'auto' : 0 }}
						transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
						className={overflowHidden ? 'overflow-hidden' : 'overflow-visible'}
						onAnimationComplete={() => { if (isOpen) setOverflowHidden(false); }}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Accordion;
