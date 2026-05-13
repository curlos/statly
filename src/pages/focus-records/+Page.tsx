import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import Pagination from '../../components/Pagination';
import Navbar from '../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getFormattedDuration } from '../../utils/helpers.utils';
import { useFocusRecordsQuery } from './useFocusRecordsQuery';

const Page = () => {
	return <FocusRecordsPage />;
};

const FocusRecordsPage = () => {
	const { updateQueryParams } = useSearchParamsContext();

	const {
		focusRecordsPageSettings: {
			showTotalFocusDuration,
			showEmotionCount,
			showNoteStats,
			showTotalNumberOfFocusRecords,
		},
	} = useUserSettingsContext();

	const {
		focusRecords,
		total,
		totalPages,
		onlyTasksTotalDuration,
		emotionCounts,
		noteStats,
		isLoading,
		isFetching,
		sortBy,
		currentPageFromUrl,
		taskIdFromUrl,
		searchTextFromUrl,
		projectsFromUrl,
	} = useFocusRecordsQuery();

	const focusRecordListRef = useRef<HTMLDivElement>(null);

	// For Filter Sidebar and Filter Bar
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);
	const sortByOptions = ['Newest', 'Oldest', 'Focus Time: Most-Least', 'Focus Time: Least-Most', 'Emotional Intensity: High-Low', 'Emotional Intensity: Low-High'];
	
	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [sortBy, searchTextFromUrl, taskIdFromUrl, projectsFromUrl]);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
		document.getElementById('main-content')?.focus({ preventScroll: true });
	}, [currentPageFromUrl]);

	const getFilterBarHeaderContent = () => {
		return (
			<div>
				<h1 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
					Focus Records {showTotalNumberOfFocusRecords && !isLoading && `(${total?.toLocaleString() || 0})`}
					{showTotalFocusDuration && !isLoading && ` - ${getFormattedDuration(onlyTasksTotalDuration ?? 0, false)}`}
				</h1>

				{showNoteStats && !isLoading && noteStats &&
					<div className="text-color-gray-25">
						<span className="font-bold">Notes: </span><span>{`${noteStats.totalCharacters.toLocaleString()} characters · ${noteStats.totalWords.toLocaleString()} words`}</span>
					</div>
				}
			</div>
		);
	};

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700 pb-10">
				<Navbar page="focus-records-page" />

				<main id="main-content" tabIndex={-1} className="outline-none">
				<FilterBar
					{...{
						isFetching,
						showFilterSidebar,
						setShowFilterSidebar,
						headerContent: getFilterBarHeaderContent(),
					}}
				/>

				<div className="w-full flex flex-col">
					<a href="#pagination" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-1 focus:rounded focus:text-sm">Skip to pagination</a>
					<div className="flex-1 flex justify-center bg-color-gray-700">
						<div className="container p-1">
							<FocusRecordList
								{...{
									isFetching,
									focusRecords: focusRecords || [],
									emotionCounts: emotionCounts || {},
									showEmotionCount,
									sortBy,
									currentPage: currentPageFromUrl,
									sortByOptions,
									showFilterSidebar,
									setShowFilterSidebar,
									focusRecordListRef,
								}}
							/>
						</div>
					</div>

					{totalPages && totalPages > 0 ? (
						<div id="pagination" className="flex justify-center pt-1 pb-2 bg-color-gray-700">
							<Pagination
								total={totalPages}
								currentPage={!currentPageFromUrl ? 1 : Number(currentPageFromUrl)}
								setCurrentPage={(value) => {
									updateQueryParams({ page: value === 1 ? '' : String(value) });
								}}
								totalPages={totalPages}
							/>
						</div>
					) : null}
				</div>
				</main>
			</div>
		</div>
	);
};

export default Page;
