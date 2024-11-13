import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from 'vike/client/router';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';
import { useThemeContext } from '../../pages/ticktick-1.00/focus-records/useThemeContext';

const SidebarModal = ({ isSidebarModalOpen, setIsSidebarModalOpen }) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	const LinkLi = ({ name, linkUrl }) => {
		return (
			<div
				className="cursor-pointer hover:underline"
				onClick={() => {
					navigate(linkUrl);
					setIsSidebarModalOpen(false);
				}}
			>
				{name}
			</div>
		);
	};

	const themeContext = useThemeContext();
	const { bgColorKey, setBgColorKey, cssStyles } = themeContext['/ticktick-1.00/focus-records'];
	const { bgColor } = cssStyles[bgColorKey];

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
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="font-bold text-[24px]">
							<LinkLi name="Focus Hours Goal" linkUrl="/ticktick-1.00/focus-hours-goal" />
							<LinkLi name="Focus Records" linkUrl="/ticktick-1.00/focus-records" />
							<LinkLi name="Stats" linkUrl="/stats/overview" />
						</div>

						{/* Theme Color */}
						<hr className="border-color-gray-200 my-4" />
						<div>
							<div className="flex items-center gap-1 mb-3">
								<h3 className="text-[16px] font-bold">Theme Color</h3>
								<Icon
									name="palette"
									fill={1}
									customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
								/>
							</div>
							<div className="space-y-2">
								{Object.keys(cssStyles).map((colorKey) => {
									const { borderColor, bgColor, textColor } = cssStyles[colorKey];

									return (
										<CustomRadioButton
											key={colorKey + 'radio'}
											label={colorKey}
											name={colorKey}
											checked={bgColorKey === colorKey}
											onChange={() => {
												setBgColorKey(colorKey);
											}}
											customLabelClass={textColor}
											customOuterCircleClasses={classNames('!w-[20px] !h-[20px]', borderColor)}
											customInnerCircleClasses={classNames('!w-[10px] !h-[10px]', bgColor)}
										/>
									);
								})}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SidebarModal;
