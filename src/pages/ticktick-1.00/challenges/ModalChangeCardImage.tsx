import { useState } from 'react';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal/Modal';
import useHandleError from '../../../hooks/useHandleError';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';
import classNames from 'classnames';
import GeneralSelectButtonAndDropdown from '../../StatsPage/GeneralSelectButtonAndDropdown';
import { MEDALS_GAMES } from '../medals/medalsLinks';
import { useThemeContext } from '../../../contexts/useThemeContext';

const ModalChangeCardImage: React.FC = ({ showModal, setShowModal, cardType, page }) => {
	const handleError = useHandleError();
	const { chosenColorObj } = useThemeContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [editUserSettings] = useEditUserSettingsMutation();

	const {
		challengesPageSettings: { selectedChallengeCardImage },
		medalsPageSettings: { selectedMedalCardImage },
		focusRecordsPageSettings,
		completedTasksPageSettings,
	} = useUserSettingsContext();

	const defaultSelectedCardImage = {
		challenges: selectedChallengeCardImage && selectedChallengeCardImage[cardType],
		medals: selectedMedalCardImage && selectedMedalCardImage[cardType],
		'focus-records': focusRecordsPageSettings?.selectedMedalImage,
		'completed-tasks': focusRecordsPageSettings?.selectedMedalImage,
	};

	const [selectedImageSrc, setSelectedImageSrc] = useState(defaultSelectedCardImage[page]);

	const handleGetPayload = () => {
		switch (page) {
			case 'challenges':
				return getChallengesPagePayload();
			case 'medals':
				return getMedalsPagePayload();
			case 'loader':
				return getLoaderPayload();
			case 'focus-records':
			case 'completed-tasks':
				return getFocusRecordsPagePayload();
		}
	};

	const handleChangeImageUserSetting = () => {
		handleError(async () => {
			const payload = handleGetPayload();
			await editUserSettings(payload).unwrap();
			setShowModal(false);
		});
	};

	const getChallengesPagePayload = () => {
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;
		const restOfChallengesKeysAndVals = userSettings?.tickTickOne?.pages?.challenges;
		const restOfSelectedChallengeCardImages =
			userSettings?.tickTickOne?.pages?.challenges?.selectedChallengeCardImage;

		const payload = {
			tickTickOne: {
				pages: {
					...restOfPagesKeysAndVals,
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

		return payload;
	};

	const getMedalsPagePayload = () => {
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;
		const restOfMedalsKeysAndVals = userSettings?.tickTickOne?.pages?.medals;
		const restOfSelectedMedalCardImages = userSettings?.tickTickOne?.pages?.medals?.selectedMedalCardImage;

		const payload = {
			tickTickOne: {
				pages: {
					...restOfPagesKeysAndVals,
					medals: {
						...restOfMedalsKeysAndVals,
						selectedMedalCardImage: {
							...restOfSelectedMedalCardImages,
							[cardType]: selectedImageSrc,
						},
					},
				},
			},
		};

		return payload;
	};

	const getLoaderPayload = () => {
		const restOfThemeKeysAndVals = userSettings?.theme;

		const payload = {
			theme: {
				...restOfThemeKeysAndVals,
				loaderCardImage: selectedImageSrc,
			},
		};

		return payload;
	};

	const getFocusRecordsPagePayload = () => {
		const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

		const payload = {
			tickTickOne: {
				pages: {
					...restOfPagesKeysAndVals,
					focusRecords: {
						...restOfFocusRecordsKeysAndVals,
						selectedMedalImage: selectedImageSrc,
					},
				},
			},
		};

		return payload;
	};

	const [selectedGame, setSelectedGame] = useState(page === 'challenges' ? 'BO2 (CALLING CARDS)' : 'BF1 (MEDALS)');
	const [selectedMedalType, setSelectedMedalType] = useState(page === 'challenges' ? 'GENERAL' : 'COMBAT');
	const medalCardImageSrcs = MEDALS_GAMES[selectedGame]['MEDALS_OBJ'][selectedMedalType];

	const pageType = {
		challenges: 'Challenges',
		medals: 'Medals',
		loader: 'Loader',
	};

	const pageName = pageType[page];

	return (
		<Modal
			isOpen={showModal}
			onClose={() => setShowModal(false)}
			position="top-center"
			customClasses="lg:w-[750px]"
		>
			<div className="bg-color-gray-600 rounded-lg">
				<div className="flex items-center justify-between p-5">
					<h3 className="font-bold text-[16px]">Change {pageName} Card Image</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setShowModal(false)}
					/>
				</div>

				<div className="px-5 pb-5">
					<div className="flex gap-4 mb-4">
						<GeneralSelectButtonAndDropdown
							selected={selectedGame}
							setSelected={setSelectedGame}
							selectedOptions={[
								'BF1 (MEDALS)',
								'BF1 (RIBBONS)',
								'BF3 (MEDALS)',
								'BF3 (RIBBONS)',
								'BF4',
								'BO2 (CALLING CARDS)',
								'BO2 (MEDALS)',
							]}
							onClick={(selectedOption: string) => {
								setSelectedGame(selectedOption);
								setSelectedMedalType(MEDALS_GAMES[selectedOption]['MEDALS_ORDER'][0]);
							}}
						/>

						<GeneralSelectButtonAndDropdown
							selected={selectedMedalType}
							setSelected={setSelectedMedalType}
							selectedOptions={MEDALS_GAMES[selectedGame]['MEDALS_ORDER']}
						/>
					</div>

					<div className="overflow-auto h-[250px] lg:h-[350px]">
						<div className={classNames('grid gap-2 grid-cols-2 lg:grid-cols-3')}>
							{medalCardImageSrcs.map((imageSrc) => {
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
												<div
													className={classNames(
														chosenColorObj.bgColor,
														'rounded-full h-[20px] w-[20px] flex items-center justify-center'
													)}
												>
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
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={() => setShowModal(false)}
						>
							Close
						</button>

						<button
							className={classNames(
								chosenColorObj.bgColor,
								chosenColorObj.hover.bgColorHalfOpacity,
								'rounded py-1 cursor-pointer min-w-[114px] disabled:opacity-50 disabled:cursor-not-allowed'
							)}
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

export default ModalChangeCardImage;
