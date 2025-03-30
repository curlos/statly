import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/Icon';
import { useState } from 'react';
import classNames from 'classnames';
import ModalChangeChallengeCardImage from './ModalChangeChallengeCardImage';

const ChallengesSettingsModal = ({ isSidebarModalOpen, setIsSidebarModalOpen }) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	return (
		<AnimatePresence>
			{isSidebarModalOpen && (
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
						onClick={() => setIsSidebarModalOpen(false)}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="font-bold text-[18px]">Challenges - Settings</div>
						<hr className="border-color-gray-200 my-4" />

						<div className="space-y-4">
							<ChallengeCard cardType="Focus" imageSrc="https://i.imgur.com/6xLKg5k.jpeg" />
							<ChallengeCard cardType="Tasks" imageSrc="https://i.imgur.com/x084PtQ.png" />
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const ChallengeCard = ({ cardType, imageSrc }) => {
	const [hoverImage, setHoverImage] = useState(false);
	const [showModalChangeChallengeCardImage, setShowModalChangeChallengeCardImage] = useState(false);

	return (
		<div>
			<div className="font-bold mb-1">{cardType}</div>
			<div
				className="relative"
				onMouseOver={() => setHoverImage(true)}
				onMouseLeave={() => setHoverImage(false)}
				onClick={() => setShowModalChangeChallengeCardImage(!showModalChangeChallengeCardImage)}
			>
				{hoverImage && (
					<div className="absolute inset-0 flex justify-center items-center">
						<Icon name="edit" customClass="!text-[30px] text-color-gray-100 cursor-pointer" />
					</div>
				)}
				<img src={imageSrc} className={classNames('cursor-pointer', hoverImage && 'opacity-50')} />
			</div>

			<ModalChangeChallengeCardImage
				{...{
					showModal: showModalChangeChallengeCardImage,
					setShowModal: setShowModalChangeChallengeCardImage,
					cardType: cardType,
				}}
			/>
		</div>
	);
};

export default ChallengesSettingsModal;
