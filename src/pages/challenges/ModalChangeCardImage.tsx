import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal/Modal';
import LazyImage from '../../components/LazyImage';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import { useGetCustomImagesQuery } from '../../services/resources/customImagesApi';
import classNames from 'classnames';
import GeneralSelectButtonAndDropdown from '../stats/StatsPage/GeneralSelectButtonAndDropdown';
import { MEDALS_GAMES, URL_TO_GAME_MEDAL_MAP } from '../medals/medalsLinks';
import { useThemeContext } from '../../contexts/useThemeContext';
import Fuse from 'fuse.js';
import { debounce } from '../../utils/helpers.utils';
import Pagination from '../../components/Pagination';
import CustomImagesSection from '../../components/CustomImagesSection/CustomImagesSection';
import { useCustomFolderNames } from '../../hooks/useCustomFolderNames';

type PageType = 'challenges' | 'medals' | 'focus-records' | 'completed-tasks';
type CardType = 'focus' | 'tasks' | 'background';

interface ModalChangeCardImageProps {
	showModal: boolean;
	setShowModal: (show: boolean) => void;
	cardType: CardType;
	page: PageType;
	imageSrc: string;
}

const ModalChangeCardImage: React.FC<ModalChangeCardImageProps> = ({ showModal, setShowModal, cardType, page, imageSrc }) => {
	const { chosenColorObj } = useThemeContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [editUserSettings] = useEditUserSettingsMutation();

	// RTK Query - Custom Images
	const { data: customImages } = useGetCustomImagesQuery();

	// Custom folder names hook
	const customFolderNames = useCustomFolderNames();

	const {
		challengesPageSettings: { selectedChallengeCardImage },
		medalsPageSettings: { selectedMedalCardImage },
		focusRecordsPageSettings,
	} = useUserSettingsContext();

	const defaultSelectedCardImage: Record<PageType, string | undefined> = {
		challenges: cardType !== 'background' ? selectedChallengeCardImage?.[cardType] : '',
		medals: cardType !== 'background' ? selectedMedalCardImage?.[cardType] : '',
		'focus-records': cardType === 'background'
			? focusRecordsPageSettings?.customDisplay?.backgroundImage
			: focusRecordsPageSettings?.selectedMedalImage,
		'completed-tasks': focusRecordsPageSettings?.selectedMedalImage,
	};

	const [selectedImageSrc, setSelectedImageSrc] = useState<string | undefined>(defaultSelectedCardImage[page]);

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

		if (cardType === 'background') {
			return {
				pages: {
					...restOfPagesKeysAndVals,
					focusRecords: {
						...restOfFocusRecordsKeysAndVals,
						customDisplay: {
							...restOfFocusRecordsKeysAndVals?.customDisplay,
							backgroundImage: selectedImageSrc,
						},
					},
				},
			};
		}

		// Existing logic for medal images
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

	const [selectedGame, setSelectedGame] = useState<string>(page === 'challenges' ? 'BO2 (CALLING CARDS)' : 'BF1 (MEDALS)');
	const [selectedMedalType, setSelectedMedalType] = useState<string>(page === 'challenges' ? 'GENERAL' : 'COMBAT');

	const getGameAndMedalTypeFromImageSrc = useCallback((imageSrc: string) => {
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

		// Check if image is from CUSTOM folder
		if (customImages) {
			const customImage = customImages.find(img => img.imageUrl === imageSrc);
			if (customImage) {
				return {
					game: 'CUSTOM',
					medalType: customImage.folder,
				};
			}
		}

		// Fallback if not found
		return {
			game: page === 'challenges' ? 'BO2 (CALLING CARDS)' : 'BF1 (MEDALS)',
			medalType: page === 'challenges' ? 'GENERAL' : 'COMBAT',
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customImages]);

	// Update selectedGame and selectedMedalType when imageSrc changes
	useEffect(() => {
		const { game, medalType } = getGameAndMedalTypeFromImageSrc(imageSrc);
		setSelectedGame(game);
		setSelectedMedalType(medalType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageSrc]);

	// Initial setup when customImages first loads (only runs once when customImages becomes available)
	useEffect(() => {
		if (customImages && customImages.length > 0) {
			const { game, medalType } = getGameAndMedalTypeFromImageSrc(imageSrc);
			// Only update if it's a custom image
			if (game === 'CUSTOM') {
				setSelectedGame(game);
				setSelectedMedalType(medalType);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customImages?.length ? 'loaded' : 'loading']);

	const [searchText, setSearchText] = useState('');
	const [filteredCardImageSrcs, setFilteredCardImageSrcs] = useState<unknown[]>([]);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const pendingFocusRef = useRef(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 24;

	// Get medal card image sources - use empty array for CUSTOM game (images handled by CustomImagesSection)
	const medalCardImageSrcs = selectedGame === 'CUSTOM'
		? []
		: (MEDALS_GAMES as unknown as Record<string, Record<string, Record<string, unknown[]>>>)[selectedGame]['MEDALS_OBJ'][selectedMedalType];

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

	// Calculate pagination for CUSTOM sections
	const customImagesByFolder = customImages?.filter(img => img.folder === selectedMedalType) || [];
	const totalPagesCustom = Math.ceil(customImagesByFolder.length / itemsPerPage);

	// Calculate pagination for game medals
	const totalPages = Math.ceil(allItems.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = allItems.slice(startIndex, endIndex);

	// Determine which totalPages to use
	const displayTotalPages = selectedGame === 'CUSTOM' ? totalPagesCustom : totalPages;

	// Debounced search function
	const handleDebouncedSearch = debounce(() => {
		if (selectedGame !== 'POKEMON TCG CARDS') return;

		let searchedItems;
		if (searchText.trim() === '') {
			searchedItems = medalCardImageSrcs.map((item: unknown) => ({ item }));
		} else {
			searchedItems = fuse?.search(searchText) || [];
		}
		setFilteredCardImageSrcs(searchedItems.map((result: { item: unknown }) => result.item));

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const handlePageChange = (page: number) => {
		pendingFocusRef.current = true;
		setCurrentPage(page);
	};

	useEffect(() => {
		if (!pendingFocusRef.current) return;
		pendingFocusRef.current = false;
		const radios = gridRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
		if (!radios?.length) return;
		const selectedIndex = currentItems.findIndex((obj: unknown) => {
			const src = selectedGame !== 'POKEMON TCG CARDS'
				? (obj as string)
				: ((obj as Record<string, unknown>).imgurImageUrl as string);
			return src === selectedImageSrc;
		});
		radios[selectedIndex !== -1 ? selectedIndex : 0]?.focus();
	}, [currentPage, currentItems, selectedGame, selectedImageSrc]);

	const getGridClasses = (selectedGame: string) => {
		switch (selectedGame) {
			case 'POKEMON TCG CARDS':
			case 'AC7 (MEDALS)':
			case 'MW2019 (WEAPON CAMOS)':
			case 'BO2 (MEDALS)':
				return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
			default:
				return 'grid-cols-2 md:grid-cols-3';
		}
	};

	const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
		if (!keys.includes(e.key)) return;
		e.preventDefault();

		const srcs = currentItems.map((obj: unknown) => {
			const objRecord = obj as Record<string, unknown>;
			return selectedGame !== 'POKEMON TCG CARDS'
				? (obj as unknown as string)
				: (objRecord.imgurImageUrl as string);
		});

		const currentIndex = srcs.indexOf(selectedImageSrc ?? '');
		let nextIndex = currentIndex;

		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			nextIndex = currentIndex < srcs.length - 1 ? currentIndex + 1 : 0;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			nextIndex = currentIndex > 0 ? currentIndex - 1 : srcs.length - 1;
		} else if (e.key === 'Home') {
			nextIndex = 0;
		} else if (e.key === 'End') {
			nextIndex = srcs.length - 1;
		}

		setSelectedImageSrc(srcs[nextIndex]);
		const grid = e.currentTarget;
		const radios = grid.querySelectorAll<HTMLDivElement>('[role="radio"]');
		radios[nextIndex]?.focus();
	};

	const pageType: Record<string, string> = {
		challenges: 'Challenges',
		medals: 'Medals',
		loader: 'Loader',
	};

	const pageName = pageType[page];

	return createPortal(
		<Modal
			isOpen={showModal}
			onClose={() => setShowModal(false)}
			customClasses="md:w-[700px] lg:w-[750px]"
			ariaLabelledBy="change-card-image-title"
		>
			<div className="bg-color-gray-600 rounded-lg text-white">
				<div className="flex items-center justify-between p-5">
					<h3 id="change-card-image-title" className="font-bold text-[16px]">Change {pageName} Card Image</h3>
					<button
						aria-label="Close dialog"
						className="text-color-gray-100 hover:text-white cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-white rounded p-0"
						onClick={() => setShowModal(false)}
					>
						<Icon name="close" customClass={'!text-[20px]'} aria-hidden />
					</button>
				</div>

				<div className="px-5 pb-5">
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
						<GeneralSelectButtonAndDropdown
							selected={selectedGame}
							setSelected={setSelectedGame}
							selectedOptions={[
								"AC7 (MEDALS)",
								"APPLE FITNESS (AWARDS)",
								"BF HARDLINE (MEDALS)",
								"BF1 (MEDALS)",
								"BF1 (RIBBONS)",
								"BF3 (MEDALS)",
								"BF3 (RIBBONS)",
								"BF4 (MEDALS)",
								"BF4 (RIBBONS)",
								"BFV (RIBBONS)",
								"BO2 (CALLING CARDS)",
								"BO2 (MEDALS)",
								"MW2019 (WEAPON CAMOS)",
								"POKEMON TCG CARDS",
								"TICKTICK (BADGES)",
								"CUSTOM",
							]}
							onClick={(selectedOption: string) => {
								setSelectedGame(selectedOption);
								const gamesData = MEDALS_GAMES as Record<string, { MEDALS_ORDER: string[] }>;
								setSelectedMedalType(gamesData[selectedOption]['MEDALS_ORDER'][0]);
							}}
						/>

						<GeneralSelectButtonAndDropdown
							selected={selectedMedalType}
							setSelected={setSelectedMedalType}
							selectedOptions={
								selectedGame === 'CUSTOM'
									? customFolderNames
									: (MEDALS_GAMES as Record<string, { MEDALS_ORDER: string[] }>)[selectedGame]['MEDALS_ORDER']
							}
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
								placeholder={'Search Pokémon cards'}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
							/>
						</div>
					)}

					{selectedGame === 'CUSTOM' ? (
						<CustomImagesSection
							selectedMedalType={selectedMedalType}
							setSelectedMedalType={setSelectedMedalType}
							selectedImageSrc={selectedImageSrc}
							setSelectedImageSrc={setSelectedImageSrc}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							itemsPerPage={itemsPerPage}
						/>
					) : (
						<div ref={scrollContainerRef} className="overflow-auto h-[250px] md:h-[420px] gray-scrollbar">
							<div
								ref={gridRef}
								role="radiogroup"
								aria-label="Select card image"
								className={classNames('grid gap-2', getGridClasses(selectedGame))}
								onKeyDown={handleGridKeyDown}
							>
								{(() => {
									const hasSelectionInCurrentPage = currentItems.some((obj: unknown) => {
										const objRecord = obj as Record<string, unknown>;
										const src = selectedGame !== 'POKEMON TCG CARDS' ? (obj as unknown as string) : (objRecord.imgurImageUrl as string);
										return src === selectedImageSrc;
									});

									return currentItems.map((obj: unknown, index: number) => {
										const objRecord = obj as Record<string, unknown>;
										const imageSrc = selectedGame !== 'POKEMON TCG CARDS' ? (obj as unknown as string) : (objRecord.imgurImageUrl as string);
										const isSelected = imageSrc === selectedImageSrc;
										const uniqueKey =
											selectedGame === 'POKEMON TCG CARDS' ? `${objRecord.name}-${imageSrc}` : imageSrc;
										const pageSuffix = currentPage > 1 ? `, Page ${currentPage}` : '';
										const itemLabel = selectedGame === 'POKEMON TCG CARDS'
											? `${objRecord.name as string}${pageSuffix}`
											: `Image ${index + 1}${pageSuffix}, ${selectedGame} ${selectedMedalType}`;
										const tabIndex = isSelected ? 0 : (index === 0 && !hasSelectionInCurrentPage ? 0 : -1);

										return (
											<div
												key={uniqueKey}
												role="radio"
												aria-checked={isSelected}
												aria-label={itemLabel}
												tabIndex={tabIndex}
												className={classNames(
														"cursor-pointer relative rounded focus-visible:outline-none focus-visible:after:content-[''] focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:border-2 focus-visible:after:border-white focus-visible:after:pointer-events-none",
														isSelected && "after:content-[''] after:absolute after:inset-0 after:border-2 after:border-white after:pointer-events-none"
													)}
												onClick={() => setSelectedImageSrc(imageSrc)}
											>
												<LazyImage
													src={imageSrc}
													alt={itemLabel}
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
									});
								})()}
							</div>
						</div>
					)}

					{displayTotalPages > 1 && (
						<div className="flex justify-center mt-4">
							<Pagination
								total={displayTotalPages}
								currentPage={currentPage}
								setCurrentPage={handlePageChange}
								totalPages={displayTotalPages}
							/>
						</div>
					)}

					<div className="flex justify-end gap-2 mt-4">
						<button
							className="border border-color-gray-100 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
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
		</Modal>,
		document.body
	);
};

export default ModalChangeCardImage;
