import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../../components/Icon';
import CustomRadioButton from '../../../../components/CustomRadioButton';
import classNames from 'classnames';
import useHandleError from '../../../../hooks/useHandleError';
import { useEditUserSettingsMutation } from '../../../../services/resources/userSettingsApi';
import FormPickDateRange from '../../../../components/FormPickDateRange';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useEffect, useState } from 'react';
import { debounce } from '../../../../utils/helpers.utils';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetAllProjectsQuery } from '../../../../services/resources/ticktickOneApi';
import SortBySection from './SortBySection';

const ModalFilterSidebar = ({
	isOpen,
	setIsOpen,
	searchTextFromUrl,
	groupBy,
	sortByOptions,
	GROUP_BY_OPTIONS,
	showCompletedTasks,
	setShowCompletedTasks,
}) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by');
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects');

	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const handleError = useHandleError();

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projects } = fetchedProjects || {};

	const isGroupByOptionChecked = (groupByOption) => {
		if (groupByOption === 'No Group' && !groupBy) {
			return true;
		}

		return groupBy === groupByOption;
	};

	const [localSearchText, setLocalSearchText] = useState(searchTextFromUrl);

	const handleDebouncedSearch = debounce(() => {
		updateQueryParams({ search: localSearchText });
	}, 1000);

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [localSearchText]);

	useEffect(() => {
		setLocalSearchText(searchTextFromUrl);
	}, [searchTextFromUrl]);

	const getProjectsFromUrlById = (projectsFromUrl) => {
		if (!projectsFromUrl) {
			return {};
		}

		const projectIdsArr = projectsFromUrl.split(',');
		const projectsFromUrlById = {};

		for (let projectId of projectIdsArr) {
			projectsFromUrlById[projectId] = true;
		}

		return projectsFromUrlById;
	};

	const projectsFromUrlById = getProjectsFromUrlById(projectsFromUrl);

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
								value={localSearchText}
								onChange={(e) => {
									setLocalSearchText(e.target.value);
								}}
								className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
							/>
						</div>

						{/* Sort By */}
						<hr className="border-color-gray-200 my-4" />
						<SortBySection {...{ sortByOptions }} />

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
											customOuterCircleClasses="!w-[20px] !h-[20px]"
											customInnerCircleClasses="!w-[10px] !h-[10px]"
											customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
											customInnerCircleBgColorClasses={chosenColorObj.bgColor}
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
									startDate: new Date(startDateFromUrl),
									setStartDate: (value) => {
										updateQueryParams({ 'start-date': value });
									},
									endDate: new Date(endDateFromUrl),
									setEndDate: (value) => {
										updateQueryParams({ 'end-date': value });
									},
									confirmBeforeUpdating: true,
									onUpdateStartOrEndDate: (newStartDate, newEndDate) => {
										if (newStartDate) {
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
										chosenColorObj.textColor,
										nextLightestColorObj.hover.textColor
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

						{/* Projects */}
						<hr className="border-color-gray-200 my-4" />
						<div>
							<div className="flex items-center gap-1 mb-3">
								<h3 className="text-[16px] font-bold">Projects</h3>
								<Icon
									name="construction"
									fill={0}
									customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
								/>
							</div>

							<div>
								{projects?.map((project) => (
									<CheckboxProject
										key={project.id}
										{...{
											project,
											chosenColorObj,
											nextLightestColorObj,
											projectsFromUrlById,
											updateQueryParams,
										}}
									/>
								))}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const CheckboxProject = ({ project, chosenColorObj, nextLightestColorObj, projectsFromUrlById, updateQueryParams }) => {
	const isChecked = projectsFromUrlById[project.id];

	return (
		<div className="flex items-center gap-1">
			<Icon
				name={isChecked ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames(
					'!text-[22px] cursor-pointer',
					chosenColorObj.textColor,
					nextLightestColorObj.hover.textColor
				)}
				onClick={() => {
					if (isChecked) {
						projectsFromUrlById[project.id] = false;
					} else {
						projectsFromUrlById[project.id] = true;
					}

					const commaSeparatedSelectedProjects = getCommaSeparatedSelectedProjects(projectsFromUrlById);
					updateQueryParams({ projects: commaSeparatedSelectedProjects });
				}}
			/>
			<div>{project.name}</div>
		</div>
	);
};

const getCommaSeparatedSelectedProjects = (projectsFromUrlById) => {
	const selectedProjectsArr = [];

	for (let projectId of Object.keys(projectsFromUrlById)) {
		const isChecked = projectsFromUrlById[projectId];

		if (isChecked) {
			selectedProjectsArr.push(projectId);
		}
	}

	return selectedProjectsArr.join(',');
};

export default ModalFilterSidebar;
