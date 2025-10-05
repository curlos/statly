import Icon from '../../components/Icon';
import AppliedFilterItemList from './AppliedFilterItemList';
import SyncButton from '../../components/SyncButton';

const FilterBar = ({ showFilterSidebar, setShowFilterSidebar, headerContent, isFetching = false }) => {
	return (
		<div className="bg-color-gray-700 sticky top-0 z-[1] pt-2">
			<div className="flex justify-between items-center pb-5 container">
				<div className="flex justify-between items-center gap-3 w-full">
					<div className="flex items-center gap-4">
						{headerContent}

						<div className="hidden lg:block">
							<AppliedFilterItemList />
						</div>
					</div>

					<div className="text-nowrap text-[16px] cursor-pointer flex items-center gap-2">
						<div
							className="flex items-center gap-2 rounded-3xl border border-color-gray-200 px-4 py-1"
							onClick={() => !isFetching && setShowFilterSidebar(!showFilterSidebar)}
							style={{ opacity: isFetching ? 0.5 : 1, cursor: isFetching ? 'not-allowed' : 'pointer' }}
						>
							<div className="hidden sm:block">Filter & Sort</div>
							<Icon
								name="page_info"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
						</div>

						<SyncButton showText={false} showTooltip={true} customClass="hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed h-[20px] mt-[3px]" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;
