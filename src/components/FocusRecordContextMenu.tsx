import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useOutsideClick from '../hooks/useOutsideClick';
import FocusRecordMenuItems from './FocusRecordMenuItems';

interface ContextMenuItem {
	icon: string;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	isDanger?: boolean;
}

interface FocusRecordContextMenuProps {
	isVisible: boolean;
	position: { x: number; y: number };
	menuItems: ContextMenuItem[];
	onClose: () => void;
}

const FocusRecordContextMenu: React.FC<FocusRecordContextMenuProps> = ({
	isVisible,
	position,
	menuItems,
	onClose,
}) => {
	const menuRef = useRef<HTMLDivElement>(null);
	const dummyToggleRef = useRef(null);

	useOutsideClick(menuRef, dummyToggleRef, [], onClose);

	// Auto-focus first item and handle keyboard navigation
	useEffect(() => {
		if (!isVisible || !menuRef.current) return;
		const el = menuRef.current;
		const first = el.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
		first?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				onClose();
				return;
			}
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				const items = Array.from(el.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
				if (!items.length) return;
				const idx = items.indexOf(document.activeElement as HTMLElement);
				const next = e.key === 'ArrowDown'
					? items[(idx + 1) % items.length]
					: items[(idx - 1 + items.length) % items.length];
				next?.focus();
			}
		};

		el.addEventListener('keydown', handleKeyDown);
		return () => el.removeEventListener('keydown', handleKeyDown);
	}, [isVisible, onClose]);

	// Close on scroll
	useEffect(() => {
		if (isVisible) {
			const handleScroll = () => onClose();
			window.addEventListener('scroll', handleScroll, true);
			return () => window.removeEventListener('scroll', handleScroll, true);
		}
	}, [isVisible, onClose]);

	// Adjust position if menu would go off-screen
	useEffect(() => {
		if (isVisible && menuRef.current) {
			const rect = menuRef.current.getBoundingClientRect();
			const adjustedStyle: { left?: string; top?: string } = {};

			if (rect.right > window.innerWidth) {
				adjustedStyle.left = `${position.x - rect.width}px`;
			}
			if (rect.bottom > window.innerHeight) {
				adjustedStyle.top = `${position.y - rect.height}px`;
			}

			Object.assign(menuRef.current.style, adjustedStyle);
		}
	}, [isVisible, position]);

	const shouldReduceMotion = useReducedMotion();
	const variants = {
		hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
		visible: { opacity: 1, scale: 1 },
	};

	if (!isVisible) return null;

	return createPortal(
		<AnimatePresence>
			<motion.div
				ref={menuRef}
				initial="hidden"
				animate="visible"
				exit="hidden"
				variants={variants}
				transition={{ duration: 0.15 }}
				role="menu"
				aria-label="Record options"
				className="fixed z-[999] bg-color-gray-600 rounded-lg shadow-xl border border-color-gray-150 min-w-[200px]"
				style={{ left: `${position.x}px`, top: `${position.y}px` }}
			>
				<FocusRecordMenuItems menuItems={menuItems} onItemClick={onClose} />
			</motion.div>
		</AnimatePresence>,
		document.body
	);
};

export default FocusRecordContextMenu;
