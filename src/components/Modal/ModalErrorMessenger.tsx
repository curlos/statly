import { useRef, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import type { RootState } from '../../types/redux';
import { useThemeContext } from '../../contexts/useThemeContext';

/**
 * Returns helpful context for known TickTick error messages
 */
const getErrorContext = (errorMessage: string) => {
	const contexts: Record<string, string> = {
		'user_not_sign_on': 'Your TickTick cookie may be invalid or expired. Please update your cookie.',
		// Can add more error codes here as we discover them
	};

	return contexts[errorMessage] || null;
};

const ModalErrorMessenger: React.FC = () => {
	const modal = useSelector((state: RootState) => state.modals.modals['ModalErrorMessenger']);
	const dispatch = useDispatch();
	const { colorMode } = useThemeContext();

	const { isOpen, props } = modal || {};
	const { error } = props || {};
	const { status, data, message, endpoint } = (error || {}) as { status?: number; data?: { message?: string }; message?: string; endpoint?: string };
	const errorMessage = data?.message || message;
	const contextMessage = getErrorContext(errorMessage || '');

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalErrorMessenger', isOpen: false }));

	const messageRef = useRef<HTMLParagraphElement>(null);
	const contextRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen || !error) return;
		const timer = setTimeout(() => {
			(contextMessage ? contextRef.current : messageRef.current)?.focus();
		}, 100);
		return () => clearTimeout(timer);
	}, [isOpen, error, contextMessage]);

	if (!isOpen || !error) return null;

	return (
		<Modal isOpen={isOpen} onClose={closeModal} customClasses="!w-[700px]" ariaLabelledBy="error-modal-title" role="alertdialog">
			<div className="rounded-lg shadow-lg bg-color-gray-600 p-4 pt-2">
				<div className="flex justify-end">
					<button
						type="button"
						aria-label="Close error dialog"
						className="bg-transparent border-0 p-0 cursor-pointer"
						onClick={closeModal}
					>
						<Icon
							name="close"
							customClass={'!text-[22px] text-color-gray-100 hover:text-white'}
							aria-hidden={true}
						/>
					</button>
				</div>
				<h2 id="error-modal-title" className="font-bold text-[24px] mt-[-12px] text-red-500">Error</h2>
				{endpoint && (
					<p className="font-bold mt-1">
						Endpoint: <span className="font-normal">{endpoint}</span>
					</p>
				)}
				{status && (
					<p className="font-bold mt-1">
						Status: <span className="font-normal">{status}</span>
					</p>
				)}
				<p ref={messageRef} tabIndex={-1} className="font-bold mt-1 outline-none">
					Message: <span className="font-normal">{errorMessage}</span>
				</p>

				{/* Additional context for known error types */}
				{contextMessage && (
					<div ref={contextRef} tabIndex={-1} className="mt-3 p-3 bg-yellow-500/20 rounded border border-yellow-500/40 outline-none">
						<p className={`text-sm mt-0 ${colorMode === 'dark' ? 'text-yellow-200' : 'text-yellow-700'}`}>{contextMessage}</p>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ModalErrorMessenger;
