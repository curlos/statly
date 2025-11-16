import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import Pagination from '../../components/Pagination';
import Navbar from '../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { useFocusRecordsQuery } from './useFocusRecordsQuery';

const Page = () => {
	return <FocusRecordsPage />;
};

const FocusRecordsPage = () => {
	const { updateQueryParams } = useSearchParamsContext();

	const {
		focusRecordsPageSettings: {
			showTotalFocusDuration,
		},
	} = useUserSettingsContext();

	const {
		focusRecords,
		total,
		totalPages,
		onlyTasksTotalDuration,
		isLoading,
		isFetching,
		sortBy,
		currentPageFromUrl,
		taskIdFromUrl,
		searchTextFromUrl,
		projectsFromUrl,
	} = useFocusRecordsQuery();

	const focusRecordListRef = useRef(null);

	// For Filter Sidebar and Filter Bar
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);
	const sortByOptions = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	
	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [sortBy, searchTextFromUrl, taskIdFromUrl, projectsFromUrl]);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [currentPageFromUrl]);

	const getFilterBarHeaderContent = () => {
		return (
			<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
				Focus Records {!isLoading && `(${total?.toLocaleString()})`}
				{showTotalFocusDuration && !isLoading && ` - ${getFormattedDuration(onlyTasksTotalDuration, false)}`}
			</h2>
		);
	};

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				<FilterBar
					{...{
						isFetching,
						showFilterSidebar,
						setShowFilterSidebar,
						headerContent: getFilterBarHeaderContent(),
					}}
				/>

				<div className="w-full flex flex-col">
					<div className="flex-1 flex justify-center bg-color-gray-700">
						<div className="container p-1">
							<FocusRecordList
								{...{
									isFetching,
									focusRecords,
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
						<div className="flex justify-center pt-1 pb-2 bg-color-gray-700">
							<Pagination
								total={totalPages}
								currentPage={!currentPageFromUrl ? 1 : Number(currentPageFromUrl)}
								setCurrentPage={(value) => {
									updateQueryParams({ page: value === 1 ? '' : value });
								}}
								totalPages={totalPages}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Page;
