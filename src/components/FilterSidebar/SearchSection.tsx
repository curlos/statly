import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { debounce } from '../../utils/helpers.utils';
import CheckboxOther from './CheckboxOther';
import Tooltip from '../Tooltip';
import { SEARCH_OPTIONS } from '../../utils/constants/constants.utils';

const SEARCH_HELP = (
	<div className="flex flex-col gap-1">
		<div>Separate multiple terms with commas.</div>
		<div>• <b>McDonald's, McD's</b> → either term</div>
		<div>• <b>Bleach, TYBW</b> + Match all terms → both terms</div>
		<div>• <b>AI</b> + Match case + Whole word → "AI" but not "gain"</div>
		<div>Regex treats the text as a regular expression (commas aren't split).</div>
	</div>
);

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
		<div className="mt-4">
			<div className="flex items-center gap-1 p-1 px-2 bg-color-gray-300 rounded-3xl">
				<Icon
					name="search"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
				<input
					type="search"
					aria-label="Search"
					placeholder="Search"
					value={localSearchText}
					onChange={(e) => {
						setLocalSearchText(e.target.value);
					}}
					className="text-[16px] bg-transparent placeholder:text-color-gray-50 mb-0 w-full outline-none resize-none p-1"
				/>
			</div>

			<div className="flex flex-col gap-1 mt-2 px-1 text-[14px]">
				{/* Left-aligned so the tooltip opens to the right and isn't cut off by the sidebar edge */}
				<Tooltip content={SEARCH_HELP} position="bottom" align="left" className="!w-[260px]" ariaLabel="Search help">
					<div className="flex items-center gap-1 text-color-gray-50 cursor-help">
						<span>Search options</span>
						<Icon
							name="help_outline"
							fill={0}
							customClass="!text-[18px] text-color-gray-100 hover:text-white"
						/>
					</div>
				</Tooltip>
				{SEARCH_OPTIONS.map(({ name, param }) => {
					const isChecked = searchParams.get(param) === 'true';
					return (
						<CheckboxOther
							key={param}
							name={name}
							showValue={isChecked}
							handleCheckboxClick={() => updateQueryParams({ [param]: isChecked ? '' : 'true', page: '' })}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default SearchSection;
