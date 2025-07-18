import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/Icon';
import { useState } from 'react';
import classNames from 'classnames';
import ModalChangeCardImage from './ModalChangeCardImage';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useThemeContext } from '../../../contexts/useThemeContext';
import FilterSidebar from '../../../components/FilterSidebar/FilterSidebar';

const ChallengesAndMedalsSettingsModal = ({ isSidebarModalOpen, setIsSidebarModalOpen, page }) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	const {
		challengesPageSettings: { selectedChallengeCardImage },
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const isForChallengesPage = page === 'challenges';

	const [selectedTab, setSelectedTab] = useState('Filter');

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[13.5px] sm:text-[16px] py-1 px-3 cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-semibold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

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
						<div className="font-bold text-[18px]">
							{isForChallengesPage ? 'Challenges' : 'Medals'} - Settings
						</div>
						<hr className="border-color-gray-200 my-4" />

						<div className="flex gap-2 my-4">
							<div
								className={selectedTab === 'Filter' ? selectedButtonStyle : unselectedButtonStyle}
								onClick={() => setSelectedTab('Filter')}
							>
								Filter
							</div>

							<div
								className={selectedTab === 'Images' ? selectedButtonStyle : unselectedButtonStyle}
								onClick={() => setSelectedTab('Images')}
							>
								Images
							</div>
						</div>

						{selectedTab === 'Filter' && (
							<div className="space-y-4">
								<FilterSidebar
									{...{
										setIsOpen: setIsSidebarModalOpen,
										isForModal: false,
										useSlidingMotion: false,
										page,
									}}
								/>
							</div>
						)}

						{selectedTab === 'Images' && (
							<div className="space-y-4">
								<CardImage
									cardType="Focus"
									imageSrc={
										isForChallengesPage
											? selectedChallengeCardImage?.focus
											: selectedMedalCardImage?.focus
									}
									isForChallengesPage={isForChallengesPage}
								/>
								<CardImage
									cardType="Tasks"
									imageSrc={
										isForChallengesPage
											? selectedChallengeCardImage?.tasks
											: selectedMedalCardImage?.tasks
									}
									isForChallengesPage={isForChallengesPage}
								/>
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const CardImage = ({ cardType, imageSrc, isForChallengesPage }) => {
	const [hoverImage, setHoverImage] = useState(false);
	const [showModalChangeCardImage, setShowModalChangeCardImage] = useState(false);

	return (
		<div>
			<div className="font-bold mb-1">{cardType}</div>
			<div
				className="relative"
				onMouseOver={() => setHoverImage(true)}
				onMouseLeave={() => setHoverImage(false)}
				onClick={() => setShowModalChangeCardImage(!showModalChangeCardImage)}
			>
				{hoverImage && (
					<div className="absolute inset-0 flex justify-center items-center">
						<Icon name="edit" customClass="!text-[30px] text-color-gray-100 cursor-pointer" />
					</div>
				)}
				<img
					src={imageSrc}
					className={classNames('cursor-pointer max-h-[250px]', hoverImage && 'opacity-50')}
				/>
			</div>

			<ModalChangeCardImage
				{...{
					showModal: showModalChangeCardImage,
					setShowModal: setShowModalChangeCardImage,
					cardType: cardType.toLowerCase(),
					isForChallengesPage,
				}}
			/>
		</div>
	);
};

export default ChallengesAndMedalsSettingsModal;
