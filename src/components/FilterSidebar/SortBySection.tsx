import classNames from 'classnames';
import CustomRadioButton from '../CustomRadioButton';
import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';

interface SortBySectionProps {
	sortByOptions: string[];
}

const SortBySection: React.FC<SortBySectionProps> = ({ sortByOptions }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by');

	const { chosenColorObj } = useThemeContext();

	const isSortByOptionChecked = (sortByOption: string) => {
		if (sortByOption === 'Newest' && !sortBy) {
			return true;
		}

		return sortBy === sortByOption;
	};

	const handleSortByChange = useDebouncedCallback((sortByOption: string) => {
		if (sortByOption === 'Newest') {
			updateQueryParams({ 'sort-by': '', page: '' });
		} else {
			updateQueryParams({ 'sort-by': sortByOption, page: '' });
		}
	}, 500, true);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Sort By</h3>
						<Icon
							name="swap_vert"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
					</div>
				}
				openByDefault={true}
			>
				<fieldset className="space-y-1 border-0 p-0 m-0">
					<legend className="sr-only">Sort by</legend>
					{sortByOptions.map((sortByOption) => {
						return (
							<CustomRadioButton
								key={sortByOption + 'radio'}
								label={sortByOption}
								name="sort-by"
								checked={isSortByOptionChecked(sortByOption)}
								onChange={() => handleSortByChange(sortByOption)}
								customOuterCircleClasses={classNames('!w-[20px] !h-[20px]')}
								customInnerCircleClasses={classNames('!w-[10px] !h-[10px]')}
								customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
								customInnerCircleBgColorClasses={chosenColorObj.bgColor}
							/>
						);
					})}
				</fieldset>
			</Accordion>
		</div>
	);
};

export default SortBySection;
