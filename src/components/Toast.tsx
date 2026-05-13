import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { selectToast, hideToast } from '../slices/toastSlice';
import Icon from './Icon';

const DISMISS_MS = 3000;

const Toast: React.FC = () => {
	const dispatch = useDispatch();
	const { isVisible, message } = useSelector(selectToast);
	const shouldReduceMotion = useReducedMotion();
	const [announcedMessage, setAnnouncedMessage] = useState('');

	useEffect(() => {
		if (!isVisible) return;
		const timer = setTimeout(() => dispatch(hideToast()), DISMISS_MS);
		return () => clearTimeout(timer);
	}, [isVisible, dispatch]);

	// Delay the live region update so it fires after the focus-return announcement
	useEffect(() => {
		if (!isVisible) { setAnnouncedMessage(''); return; }
		const id = setTimeout(() => setAnnouncedMessage(message), 150);
		return () => clearTimeout(id);
	}, [isVisible, message]);

	return (
		<>
			{/* aria-live region always in DOM so announcements are picked up */}
			<div aria-live="assertive" aria-atomic="true" className="sr-only">
				{announcedMessage}
			</div>

			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
						transition={{ duration: 0.2 }}
						className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-color-gray-600 border border-color-gray-150 text-white px-4 py-3 rounded-lg shadow-xl text-[14px]"
						role="status"
					>
						<Icon name="check_circle" customClass="!text-[20px] text-green-400 flex-shrink-0" />
						<span>{message}</span>
						<button
							type="button"
							aria-label="Dismiss notification"
							onClick={() => dispatch(hideToast())}
							className="ml-2 flex items-center text-color-gray-100 hover:text-white transition-colors"
						>
							<Icon name="close" customClass="!text-[16px]" />
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Toast;
