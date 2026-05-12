import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import classNames from 'classnames';
import { useDialogFocus } from '../../hooks/useDialogFocus';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	positionClasses?: string;
	customClasses?: string;
	children: React.ReactNode;
	contentRef?: React.RefObject<HTMLElement>;
	ariaLabelledBy?: string;
	ariaDescribedBy?: string;
	role?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, positionClasses, customClasses, children, contentRef, ariaLabelledBy, ariaDescribedBy, role }) => {
	const dialogRef = useDialogFocus<HTMLDialogElement>(isOpen, onClose);
	const shouldReduceMotion = useReducedMotion();

	const setRef = (node: HTMLDialogElement | null) => {
		(dialogRef as React.MutableRefObject<HTMLDialogElement | null>).current = node;
		if (contentRef) {
			(contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
		}
	};

	const containerVariants = {
		hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, transition: { duration: 0.3 } },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 0.7 },
	};

	const containerClasses = `z-50 relative p-3 max-w-full w-[500px] max-h-[90vh] overflow-y-auto gray-scrollbar bg-transparent text-white`;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div
					className={classNames(
						'text-white fixed inset-0 z-50 overflow-auto flex justify-center items-center',
						positionClasses ? positionClasses : ''
					)}
				>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={backdropVariants}
						className="fixed inset-0 bg-black"
						onClick={onClose}
						style={{ zIndex: 49 }}
					/>
					<motion.dialog
						ref={setRef}
						open
						aria-labelledby={ariaLabelledBy}
						aria-describedby={ariaDescribedBy}
						role={role ?? 'dialog'}
						tabIndex={-1}
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={containerVariants}
						aria-modal="true"
						className={classNames(containerClasses, customClasses, 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 border-0 m-0')}
					>
						{children}
					</motion.dialog>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
};

export default Modal;
