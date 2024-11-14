import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../../components/Icon';
import CustomRadioButton from '../../../../components/CustomRadioButton';
import classNames from 'classnames';
import useHandleError from '../../../../hooks/useHandleError';
import { useEditUserSettingsMutation } from '../../../../services/resources/userSettingsApi';
import FormPickDateRange from '../../../../components/FormPickDateRange';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import { useSearchParamsCustom } from '../../../../hooks/useSearchParamsCustom';

const ModalFilterSidebar = ({
	isOpen,
	setIsOpen,
	searchText,
	setSearchText,
	groupBy,
	sortByOptions,
	GROUP_BY_OPTIONS,
	showCompletedTasks,
	setShowCompletedTasks,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	const { searchParams, updateQueryParams } = useSearchParamsCustom();
	const sortBy = searchParams.get('sort-by');

	const handleError = useHandleError();

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	const isSortByOptionChecked = (sortByOption) => {
		if (sortByOption === 'Newest' && !sortBy) {
			return true;
		}

		return sortBy === sortByOption;
	};

	const isGroupByOptionChecked = (groupByOption) => {
		if (groupByOption === 'No Group' && !groupBy) {
			return true;
		}

		return groupBy === groupByOption;
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial="hidden"
					animate="visible"
					exit="hidden"
					className="fixed inset-0 z-40 flex justify-end"
				>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={backdropVariants}
						className="overlay absolute bg-black inset-0"
						onClick={() => setIsOpen(false)}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="flex justify-between items-center">
							<h2 className="font-bold text-[18px]">Filter</h2>
							<Icon
								name="close"
								fill={0}
								customClass={
									'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer bg-color-gray-600 rounded-2xl p-1'
								}
								onClick={() => setIsOpen(false)}
							/>
						</div>

						<div className="flex items-center gap-1 p-1 px-2 bg-color-gray-600 rounded-3xl mt-4">
							<Icon
								name="search"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
							<input
								placeholder="Search"
								value={searchText}
								onChange={(e) => {
									setSearchText(e.target.value);
									updateQueryParams({ search: searchText });
								}}
								className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
							/>
						</div>

						{/* Sort By */}
						<hr className="border-color-gray-200 my-4" />
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
											customOuterCircleClasses="!border-blue-500 !w-[20px] !h-[20px]"
											customInnerCircleClasses="!bg-blue-500 !w-[10px] !h-[10px]"
										/>
									);
								})}
							</div>
						</div>

						{/* Group By */}
						<hr className="border-color-gray-200 my-4" />
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
											customOuterCircleClasses="!border-blue-500 !w-[20px] !h-[20px]"
											customInnerCircleClasses="!bg-blue-500 !w-[10px] !h-[10px]"
										/>
									);
								})}
							</div>
						</div>

						{/* Date Range */}
						<hr className="border-color-gray-200 my-4" />
						<div>
							<div className="flex items-center gap-1 mb-3">
								<h3 className="text-[16px] font-bold">Date Range</h3>
								<Icon
									name="diversity_2"
									fill={0}
									customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
								/>
							</div>

							<FormPickDateRange
								{...{
									startDate,
									setStartDate,
									endDate,
									setEndDate,
									useLocalDatesFirst: false,
									onUpdateStartOrEndDate: (newStartDate, newEndDate) => {
										if (newStartDate) {
											// TODO: Get these up in the filter bar or page components.
											updateQueryParams({
												'start-date': getFormattedShortMonthDay(newStartDate),
											});
										} else if (newEndDate) {
											updateQueryParams({ 'end-date': getFormattedShortMonthDay(newEndDate) });
										}
									},
								}}
							/>
						</div>

						{/* Other */}
						<hr className="border-color-gray-200 my-4" />
						<div>
							<div className="flex items-center gap-1 mb-3">
								<h3 className="text-[16px] font-bold">Other</h3>
								<Icon
									name="diversity_2"
									fill={0}
									customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
								/>
							</div>
							<div className="flex items-center gap-1">
								<Icon
									name={showCompletedTasks ? 'check_box' : 'check_box_outline_blank'}
									fill={1}
									customClass={classNames(
										'!text-[22px] cursor-pointer',
										'text-blue-500 hover:text-blue-400'
									)}
									onClick={() => {
										const newShowCompletedTasks = !showCompletedTasks;
										setShowCompletedTasks(newShowCompletedTasks);

										handleError(async () => {
											const payload = {
												tickTickOne: {
													pages: {
														focusRecords: {
															showCompletedTasks: newShowCompletedTasks,
														},
													},
												},
											};

											await editUserSettings(payload).unwrap();
										});
									}}
								/>
								<div>Show Completed Tasks</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ModalFilterSidebar;
