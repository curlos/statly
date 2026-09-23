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
	titleHasLinks?: boolean;
	mutedArrow?: boolean;
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
	titleHasLinks,
	mutedArrow,
}) => {
	const [isOpen, setIsOpen] = useState(openByDefault ? true : false);
	const [overflowHidden, setOverflowHidden] = useState(!openByDefault);
	const panelId = useId();
	const titleId = useId();
	const toggleId = useId();
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
			{titleHasLinks ? (
				<div
					className={classNames('w-full flex gap-2 items-center rounded mb-3', showArrowNextToText ? 'justify-start' : 'justify-between')}
					onClick={(e) => {
						if (!(e.target as HTMLElement).closest('a, button')) toggleOpen();
					}}
				>
					<div id={titleId} className="min-w-0 break-words">{title}</div>
					<button
						id={toggleId}
						type="button"
						onClick={toggleOpen}
						aria-expanded={isOpen}
						aria-controls={panelId}
						aria-label="Toggle"
						aria-labelledby={`${toggleId} ${titleId}`}
						className="bg-transparent border-0 p-0 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded"
					>
						<Icon
							name={isOpen ? 'keyboard_arrow_down' : 'chevron_right'}
							fill={1}
							customClass={classNames(mutedArrow ? 'text-muted-inherit hover:text-inherit' : 'text-color-gray-50 hover:text-white', '!text-[20px] cursor-pointer')}
						/>
					</button>
				</div>
			) : (
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
						customClass={classNames(mutedArrow ? 'text-muted-inherit hover:text-inherit' : 'text-color-gray-50 hover:text-white', '!text-[20px] cursor-pointer')}
					/>
				</button>
			)}
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
