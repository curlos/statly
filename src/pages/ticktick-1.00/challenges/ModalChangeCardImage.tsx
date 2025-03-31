import { useState } from 'react';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal/Modal';
import useHandleError from '../../../hooks/useHandleError';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';
import classNames from 'classnames';
import MedalsGameButtonList from '../medals/MedalsGameButtonList';
import { MEDALS_GAMES } from '../medals/medalsLinks';

const ModalChangeCardImage: React.FC = ({ showModal, setShowModal, cardType, isForChallengesPage }) => {
	const handleError = useHandleError();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [editUserSettings] = useEditUserSettingsMutation();

	const {
		challengesPageSettings: { selectedChallengeCardImage },
	} = useUserSettingsContext();

	const [selectedImageSrc, setSelectedImageSrc] = useState(
		selectedChallengeCardImage && selectedChallengeCardImage[cardType]
	);

	const handleChangeImageUserSetting = () => {
		const restOfChallengesKeysAndVals = userSettings?.tickTickOne?.pages?.challenges;
		const restOfSelectedChallengeCardImages =
			userSettings?.tickTickOne?.pages?.challenges?.selectedChallengeCardImage;

		handleError(async () => {
			const payload = {
				tickTickOne: {
					pages: {
						challenges: {
							...restOfChallengesKeysAndVals,
							selectedChallengeCardImage: {
								...restOfSelectedChallengeCardImages,
								[cardType]: selectedImageSrc,
							},
						},
					},
				},
			};

			await editUserSettings(payload).unwrap();
			setShowModal(false);
		});
	};

	const [selectedGame, setSelectedGame] = useState('BATTLEFIELD 1');
	const [selectedMedalType, setSelectedMedalType] = useState('COMBAT');

	const medalCardImageSrcs = MEDALS_GAMES[selectedGame]['MEDALS_OBJ'][selectedMedalType];

	const cardImagesToUse = isForChallengesPage ? challengeCardImageSrcs : medalCardImageSrcs;

	return (
		<Modal
			isOpen={showModal}
			onClose={() => setShowModal(false)}
			position="top-center"
			customClasses="lg:w-[750px]"
		>
			<div className="bg-color-gray-600 rounded-lg">
				<div className="flex items-center justify-between p-5">
					<h3 className="font-bold text-[16px]">
						Change {isForChallengesPage ? 'Challenges' : 'Medals'} Card Image
					</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setShowModal(false)}
					/>
				</div>

				<div className="px-5 pb-5">
					<MedalsGameButtonList
						{...{
							medalGameButtonType: 'GAME',
							buttonNamesList: ['BATTLEFIELD 1', 'BATTLEFIELD 3', 'BATTLEFIELD 4'],
							selectedGame,
							setSelectedGame,
							selectedMedalType,
							setSelectedMedalType,
						}}
					/>

					<MedalsGameButtonList
						{...{
							medalGameButtonType: 'MEDAL TYPE',
							buttonNamesList: MEDALS_GAMES[selectedGame]['MEDALS_ORDER'],
							selectedGame,
							setSelectedGame,
							selectedMedalType,
							setSelectedMedalType,
						}}
					/>

					<div
						className={classNames(
							'grid gap-2 overflow-auto max-h-[250px] lg:max-h-[400px]',
							isForChallengesPage ? 'lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
						)}
					>
						{cardImagesToUse.map((imageSrc) => {
							const isSelected = imageSrc === selectedImageSrc;

							return (
								<div
									key={imageSrc}
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

						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px] disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleChangeImageUserSetting}
						>
							Ok
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

const challengeCardImageSrcs = [
	'https://i.imgur.com/6xLKg5k.jpeg',
	'https://i.imgur.com/1YgsWfs.jpeg',
	'https://i.imgur.com/6XxU2gI.jpeg',
	'https://i.imgur.com/bxbNsXn.jpeg',
	'https://i.imgur.com/x084PtQ.png',
	'https://i.imgur.com/wB7IC8I.png',
	'https://i.imgur.com/RJwESL1.jpeg',
	'https://i.imgur.com/jWwQMre.jpeg',
	'https://i.imgur.com/H66q41n.jpeg',
	'https://i.imgur.com/nVSAETq.jpeg',
	'https://i.imgur.com/CHc4FZm.jpeg',
	'https://i.imgur.com/C5XRDHf.png',
	'https://i.imgur.com/NqLXU5k.png',
	'https://i.imgur.com/mjQR03J.png',
	'https://i.imgur.com/QPGlCRU.jpeg',
	'https://i.imgur.com/JF5yqRY.png',
	'https://i.imgur.com/xgI5YX3.jpeg',
	'https://i.imgur.com/ta2Mntd.png',
	'https://i.imgur.com/uynvJZh.png',
	'https://i.imgur.com/nmgjNAy.jpeg',
	'https://i.imgur.com/iy2ZSMF.jpeg',
	'https://i.imgur.com/TAhBlMG.jpeg',
	'https://i.imgur.com/crfh1D3.jpeg',
	'https://i.imgur.com/NUw06Bt.jpeg',
];

// const medalCardImageSrcs = ['https://i.imgur.com/dIvJYlX.png', 'https://i.imgur.com/91AMzBS.png'];

export default ModalChangeCardImage;
