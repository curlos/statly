import { useState, useEffect, useRef } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal/Modal';
import LazyImage from '../../components/LazyImage';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import classNames from 'classnames';
import GeneralSelectButtonAndDropdown from '../stats/StatsPage/GeneralSelectButtonAndDropdown';
import { MEDALS_GAMES, URL_TO_GAME_MEDAL_MAP } from '../medals/medalsLinks';
import { useThemeContext } from '../../contexts/useThemeContext';
import Fuse from 'fuse.js';
import { debounce } from '../../utils/helpers.utils';
import Pagination from '../../components/Pagination';

const ModalChangeCardImage: React.FC = ({ showModal, setShowModal, cardType, page, imageSrc }) => {
	const { chosenColorObj } = useThemeContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
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
			case 'focus-records':
			case 'completed-tasks':
				return getFocusRecordsPagePayload();
		}
	};

	const handleChangeImageUserSetting = async () => {
		const payload = handleGetPayload();
		await editUserSettings(payload);
		setShowModal(false);
	};

	const getChallengesPagePayload = () => {
		const restOfPagesKeysAndVals = userSettings?.pages;
		const restOfChallengesKeysAndVals = userSettings?.pages?.challenges;
		const restOfSelectedChallengeCardImages =
			userSettings?.pages?.challenges?.selectedChallengeCardImage;

		const payload = {
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
		};

		return payload;
	};

	const getMedalsPagePayload = () => {
		const restOfPagesKeysAndVals = userSettings?.pages;
		const restOfMedalsKeysAndVals = userSettings?.pages?.medals;
		const restOfSelectedMedalCardImages = userSettings?.pages?.medals?.selectedMedalCardImage;

		const payload = {
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
		};

		return payload;
	};

	const getFocusRecordsPagePayload = () => {
		const restOfFocusRecordsKeysAndVals = userSettings?.pages?.focusRecords;
		const restOfPagesKeysAndVals = userSettings?.pages;

		const payload = {
			pages: {
				...restOfPagesKeysAndVals,
				focusRecords: {
					...restOfFocusRecordsKeysAndVals,
					selectedMedalImage: selectedImageSrc,
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
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 24;

	const medalCardImageSrcs = MEDALS_GAMES[selectedGame]['MEDALS_OBJ'][selectedMedalType];

	// Initialize Fuse.js for Pokemon card search
	const fuse =
		selectedGame === 'POKEMON TCG CARDS'
			? new Fuse(medalCardImageSrcs, {
					includeScore: true,
					keys: ['name'],
				})
			: null;

	// Determine which data to display based on game type and search
	const allItems =
		selectedGame === 'POKEMON TCG CARDS' && searchText.trim() !== ''
			? filteredCardImageSrcs
			: medalCardImageSrcs;

	// Calculate pagination
	const totalPages = Math.ceil(allItems.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = allItems.slice(startIndex, endIndex);

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
		setCurrentPage(1);
	}, [selectedGame, selectedMedalType]);

	// Reset currentPage when search results change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchText]);

	const getGridClasses = (selectedGame: string) => {
		switch (selectedGame) {
			case 'POKEMON TCG CARDS':
			case 'AC7 (MEDALS)':
			case 'BO2 (MEDALS)':
				return 'grid-cols-3 md:grid-cols-4';
			default:
				return 'grid-cols-2 md:grid-cols-3';
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
			customClasses="md:w-[700px] lg:w-[750px]"
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
								placeholder={'Search Pokémon cards...'}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
							/>
						</div>
					)}

					<div ref={scrollContainerRef} className="overflow-auto h-[250px] md:h-[420px] gray-scrollbar">
						<div className={classNames('grid gap-2', getGridClasses(selectedGame))}>
							{currentItems.map((obj) => {
								const imageSrc = selectedGame !== 'POKEMON TCG CARDS' ? obj : obj.imgurImageUrl;
								const isSelected = imageSrc === selectedImageSrc;
								const uniqueKey =
									selectedGame === 'POKEMON TCG CARDS' ? `${obj.name}-${imageSrc}` : imageSrc;

								return (
									<div
										key={uniqueKey}
										className="cursor-pointer relative"
										onClick={() => setSelectedImageSrc(imageSrc)}
									>
										<LazyImage
											src={imageSrc}
											alt="Medal/Card image"
										/>

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

					{totalPages > 1 && (
						<div className="flex justify-center mt-4">
							<Pagination
								total={totalPages}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								totalPages={totalPages}
							/>
						</div>
					)}

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
