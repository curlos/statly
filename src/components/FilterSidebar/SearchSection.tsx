import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { debounce } from '../../utils/helpers.utils';

const SearchSection = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const searchTextFromUrl = searchParams.get('search') || '';

	const [localSearchText, setLocalSearchText] = useState(searchTextFromUrl);
	const [isInitialMount, setIsInitialMount] = useState(true);

	const handleDebouncedSearch = debounce(() => {
		updateQueryParams({
			search: localSearchText,
			'sort-by': '',
			page: '',
		});
	}, 1000);

	useEffect(() => {
		if (isInitialMount) {
			setIsInitialMount(false);
			return;
		}

		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localSearchText]);

	useEffect(() => {
		setLocalSearchText(searchTextFromUrl);
	}, [searchTextFromUrl]);

	return (
		<div className="flex items-center gap-1 p-1 px-2 bg-color-gray-300 rounded-3xl mt-4">
			<Icon
				name="search"
				fill={0}
				customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
			/>
			<input
				placeholder="Search"
				value={localSearchText}
				onChange={(e) => {
					setLocalSearchText(e.target.value);
				}}
				className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
			/>
		</div>
	);
};

export default SearchSection;
