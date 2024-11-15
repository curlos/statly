import classNames from 'classnames';
import CustomRadioButton from '../../../../components/CustomRadioButton';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';

const SortBySection = ({ sortByOptions }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by');

	const { chosenColorObj } = useThemeContext();

	const isSortByOptionChecked = (sortByOption) => {
		if (sortByOption === 'Newest' && !sortBy) {
			return true;
		}

		return sortBy === sortByOption;
	};

	return (
		<div>
			<div className="flex items-center gap-1 mb-3">
				<h3 className="text-[16px] font-bold">Sort By</h3>
				<Icon
					name="swap_vert"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
			</div>

			<div className="space-y-2">
				{sortByOptions.map((sortByOption) => {
					return (
						<CustomRadioButton
							key={sortByOption + 'radio'}
							label={sortByOption}
							name={sortByOption}
							checked={isSortByOptionChecked(sortByOption)}
							onChange={() => {
								if (sortByOption === 'Newest') {
									updateQueryParams({ 'sort-by': '' });
								} else {
									updateQueryParams({ 'sort-by': sortByOption });
								}
							}}
							customOuterCircleClasses={classNames('!w-[20px] !h-[20px]')}
							customInnerCircleClasses={classNames('!w-[10px] !h-[10px]')}
							customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
							customInnerCircleBgColorClasses={chosenColorObj.bgColor}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default SortBySection;
