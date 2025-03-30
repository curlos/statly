import { useEffect, useState } from 'react';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal/Modal';
import useHandleError from '../../../hooks/useHandleError';

const ModalChangeChallengeCardImage: React.FC = ({ showModal, setShowModal }) => {
	const handleError = useHandleError();

	const challengeCardImageSrcs = [
		'https://i.imgur.com/x084PtQ.png',
		'https://i.imgur.com/wB7IC8I.png',
		'https://i.imgur.com/QPGlCRU.jpeg',
		'https://i.imgur.com/6xLKg5k.jpeg',
		'https://i.imgur.com/RJwESL1.jpeg',
		'https://i.imgur.com/xgI5YX3.jpeg',
	];

	const [selectedImageSrc, setSelectedImageSrc] = useState('https://i.imgur.com/6xLKg5k.jpeg');

	return (
		<Modal
			isOpen={showModal}
			onClose={() => setShowModal(false)}
			position="top-center"
			customClasses="lg:w-[750px]"
		>
			<div className="bg-color-gray-600 rounded-lg">
				<div className="flex items-center justify-between p-5">
					<h3 className="font-bold text-[16px]">Change Challenge Card Image</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setShowModal(false)}
					/>
				</div>

				<div className="px-5 pb-5">
					<div className="grid grid-cols-2 gap-2 overflow-auto max-h-[250px]">
						{challengeCardImageSrcs.map((imageSrc) => {
							const isSelected = imageSrc === selectedImageSrc;

							return (
								<div
									className="cursor-pointer flex items-end"
									onClick={() => setSelectedImageSrc(imageSrc)}
								>
									<img src={imageSrc} />

									{isSelected && (
										<div className="ml-[-25px] mb-[10px]">
											<div className="bg-blue-500 rounded-full h-[20px] w-[20px] flex items-center justify-center">
												<Icon
													name="check"
													customClass={
														'!text-[20px] text-white group-hover:text-white cursor-pointer'
													}
												/>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={() => setShowModal(false)}
						>
							Close
						</button>

						<button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px] disabled:opacity-50 disabled:cursor-not-allowed">
							Ok
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalChangeChallengeCardImage;
