import CustomRadioButton from '../../../../components/CustomRadioButton';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';

const GroupBySection = ({ GROUP_BY_OPTIONS }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const groupBy = searchParams.get('group-by');

	const { chosenColorObj } = useThemeContext();

	const isGroupByOptionChecked = (groupByOption) => {
		if (groupByOption === 'No Group' && !groupBy) {
			return true;
		}

		return groupBy === groupByOption;
	};

	return (
		<div>
			<div className="flex items-center gap-1 mb-3">
				<h3 className="text-[16px] font-bold">Group By</h3>
				<Icon
					name="diversity_2"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
			</div>

			<div className="space-y-2">
				{GROUP_BY_OPTIONS.map((groupByOption) => {
					return (
						<CustomRadioButton
							key={groupByOption + 'radio'}
							label={groupByOption}
							name={groupByOption}
							checked={isGroupByOptionChecked(groupByOption)}
							onChange={() => {
								if (groupByOption === 'No Group') {
									updateQueryParams({ 'group-by': '' });
								} else {
									updateQueryParams({ 'group-by': groupByOption });
								}
							}}
							customOuterCircleClasses="!w-[20px] !h-[20px]"
							customInnerCircleClasses="!w-[10px] !h-[10px]"
							customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
							customInnerCircleBgColorClasses={chosenColorObj.bgColor}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default GroupBySection;
