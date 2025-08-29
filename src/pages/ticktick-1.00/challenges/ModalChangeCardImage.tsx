import { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal/Modal';
import LazyImage from '../../../components/LazyImage';
import useHandleError from '../../../hooks/useHandleError';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';
import classNames from 'classnames';
import GeneralSelectButtonAndDropdown from '../../StatsPage/GeneralSelectButtonAndDropdown';
import { MEDALS_GAMES, URL_TO_GAME_MEDAL_MAP } from '../medals/medalsLinks';
import { useThemeContext } from '../../../contexts/useThemeContext';
import Fuse from 'fuse.js';
import { debounce } from '../../../utils/focus-apps/helpers.utils';

const ModalChangeCardImage: React.FC = ({ showModal, setShowModal, cardType, page, imageSrc }) => {
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

	const getGameAndMedalTypeFromImageSrc = (imageSrc: string) => {
		if (!imageSrc) {
			return {
				game: page === 'challenges' ? 'BO2 (CALLING CARDS)' : 'BF1 (MEDALS)',
				medalType: page === 'challenges' ? 'GENERAL' : 'COMBAT',
			};
		}

		// O(1) lookup using the module-level map
		const result = URL_TO_GAME_MEDAL_MAP.get(imageSrc);
		if (result) {
			return result;
		}

		// Fallback if not found
		return {
			game: page === 'challenges' ? 'BO2 (CALLING CARDS)' : 'BF1 (MEDALS)',
			medalType: page === 'challenges' ? 'GENERAL' : 'COMBAT',
		};
	};

	const { game: initialGame, medalType: initialMedalType } = getGameAndMedalTypeFromImageSrc(imageSrc);
	const [selectedGame, setSelectedGame] = useState(initialGame);
	const [selectedMedalType, setSelectedMedalType] = useState(initialMedalType);
	const [searchText, setSearchText] = useState('');
	const [filteredCardImageSrcs, setFilteredCardImageSrcs] = useState([]);
	const scrollContainerRef = useRef(null);

	const medalCardImageSrcs = MEDALS_GAMES[selectedGame]['MEDALS_OBJ'][selectedMedalType];

	// Initialize Fuse.js for Pokemon card search
	const fuse =
		selectedGame === 'POKEMON TCG CARDS'
			? new Fuse(medalCardImageSrcs, {
					includeScore: true,
					keys: ['name'],
				})
			: null;

	// Debounced search function
	const handleDebouncedSearch = debounce(() => {
		if (selectedGame !== 'POKEMON TCG CARDS') return;

		let searchedItems;
		if (searchText.trim() === '') {
			searchedItems = medalCardImageSrcs.map((item) => ({ item }));
		} else {
			searchedItems = fuse?.search(searchText) || [];
		}
		setFilteredCardImageSrcs(searchedItems.map((result) => result.item));
		
		// Scroll to top after search results are updated
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}
	}, 300);

	// Effect to handle search
	useEffect(() => {
		if (selectedGame === 'POKEMON TCG CARDS') {
			handleDebouncedSearch();
		}

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText, selectedGame, selectedMedalType]);

	// Reset search when game or medal type changes
	useEffect(() => {
		setSearchText('');
		setFilteredCardImageSrcs([]);
	}, [selectedGame, selectedMedalType]);

	const getGridClasses = (selectedGame: string) => {
		switch (selectedGame) {
			case 'POKEMON TCG CARDS':
			case 'AC7 (MEDALS)':
			case 'BO2 (MEDALS)':
				return 'grid-cols-3 lg:grid-cols-4';
			default:
				return 'grid-cols-2 lg:grid-cols-3';
		}
	};

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
								'BF4 (MEDALS)',
								'BF4 (RIBBONS)',
								'BFV (RIBBONS)',
								'BF HARDLINE (MEDALS)',
								'BO2 (CALLING CARDS)',
								'BO2 (MEDALS)',
								'AC7 (MEDALS)',
								'POKEMON TCG CARDS',
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

					{selectedGame === 'POKEMON TCG CARDS' && (
						<div className="flex items-center gap-1 p-1 px-2 mb-2 border border-color-gray-100 rounded-full">
							<Icon
								name="search"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
							<input
								placeholder={'Search Pokemon cards...'}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
							/>
						</div>
					)}

					<div ref={scrollContainerRef} className="overflow-auto h-[250px] lg:h-[420px] gray-scrollbar">
						<div className={classNames('grid gap-2', getGridClasses(selectedGame))}>
							{(selectedGame === 'POKEMON TCG CARDS' && searchText.trim() !== ''
								? filteredCardImageSrcs
								: medalCardImageSrcs
							).map((obj) => {
								const imageSrc = selectedGame !== 'POKEMON TCG CARDS' ? obj : obj.imgurImageUrl;
								const isSelected = imageSrc === selectedImageSrc;
								const uniqueKey = selectedGame === 'POKEMON TCG CARDS' ? `${obj.name}-${imageSrc}` : imageSrc;

								return (
									<div
										key={uniqueKey}
										className="cursor-pointer relative"
										onClick={() => setSelectedImageSrc(imageSrc)}
									>
										<LazyImage src={imageSrc} alt="Medal/Card image" />

										{isSelected && (
											<div className="absolute bottom-[10px] right-[10px] z-10">
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
