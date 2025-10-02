import classNames from 'classnames';
import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';
import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';
import { useStatsContext } from '../../../../contexts/useStatsContext';
import { checkIfInboxProject } from '../../../../utils/tickTickOne.util';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import DropdownCompletedSmallLabeList from './DropdownCompletedSmallLabeList';
import SmallLabel from './SmallLabel';

const noData = [
	{
		name: 'No Data',
		color: 'gray',
		value: 0,
		percentage: 100,
		id: 'No Data',
	},
];

const CompletionStatsCard = () => {
	const {
		completedTasksGroupedByDate,
		projectsById,
		todoistAllProjectsById,
		tagsByRawName,
		filteredDaysWithCompletedTasks,
	} = useStatsContext() || {};

	const selectedOptions = ['Project', 'Tag'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const [progressBarData, setProgressBarData] = useState(noData);
	const [numOfCompletedTasks, setNumOfCompletedTasks] = useState(0);
	const [thereIsNoData, setThereIsNoData] = useState(true);

	useEffect(() => {
		if (
			!completedTasksGroupedByDate ||
			!filteredDaysWithCompletedTasks ||
			!projectsById ||
			!todoistAllProjectsById
		) {
			return;
		}

		const allFilteredCompletedTasks = filteredDaysWithCompletedTasks.flatMap((day) => day.completedTasksForDay);
		const newNumOfCompletedTasks = allFilteredCompletedTasks.length;

		let newProgressBarData = progressBarData;

		switch (selected) {
			case 'Project':
				newProgressBarData = getDataByProjects(allFilteredCompletedTasks, newNumOfCompletedTasks);
				break;
			case 'Tag':
				newProgressBarData = getDataByTags(allFilteredCompletedTasks, newNumOfCompletedTasks);
				break;
			default:
				newProgressBarData = getDataByProjects(allFilteredCompletedTasks, newNumOfCompletedTasks);
		}

		const thereIsNoData = !newProgressBarData || newProgressBarData.length === 0;

		if (thereIsNoData) {
			newProgressBarData = noData;

			setThereIsNoData(true);
		} else {
			setThereIsNoData(false);
		}

		setNumOfCompletedTasks(newNumOfCompletedTasks);

		const sortedProgressBarData = newProgressBarData.sort((a, b) => b.value - a.value);
		setProgressBarData(sortedProgressBarData);
	}, [
		completedTasksGroupedByDate,
		projectsById,
		todoistAllProjectsById,
		tagsByRawName,
		selected,
		filteredDaysWithCompletedTasks,
	]);

	const getDataByProjects = (allFilteredCompletedTasks, newNumOfCompletedTasks) => {
		const completedTasksGroupedByProject = {};

		allFilteredCompletedTasks.forEach((task) => {
			const projectId = task['projectId'] || task['v2_project_id'] || task['project_id'];

			if (!completedTasksGroupedByProject[projectId]) {
				completedTasksGroupedByProject[projectId] = [];
			}

			completedTasksGroupedByProject[projectId].push(task);
		});

		return Object.keys(completedTasksGroupedByProject).map((projectId) => {
			const completedTasksArr = completedTasksGroupedByProject[projectId];
			const numOfCompletedTasks = completedTasksArr.length;
			const percentage = Number(((numOfCompletedTasks / newNumOfCompletedTasks) * 100).toFixed(2));

			const isFromInboxProject = checkIfInboxProject(projectId);

			let name = 'Inbox';
			let color = 'green';
			let id = name;

			if (!isFromInboxProject) {
				const project = projectsById[projectId] || todoistAllProjectsById[projectId];

				if (projectsById[projectId]) {
					name = project.name;
				} else {
					name = `${project.name} (Todoist)`;
					id = name;
				}

				color = project.color;
				id = project.id;
			} else {
				id = projectId;
			}

			return {
				name,
				color,
				value: numOfCompletedTasks,
				percentage,
				id,
			};
		});
	};

	const getDataByTags = (allFilteredCompletedTasks, newNumOfCompletedTasks) => {
		const completedTasksGroupedByTags = {};
		const UNCLASSIFIED_KEY = 'UNCLASSIFIED';

		allFilteredCompletedTasks.forEach((task) => {
			const { tags } = task;

			if (tags && tags.length > 0) {
				for (let tagName of tags) {
					if (!completedTasksGroupedByTags[tagName]) {
						completedTasksGroupedByTags[tagName] = [];
					}

					completedTasksGroupedByTags[tagName].push(task);
				}
			} else {
				// If the task is unclassified (no tags)
				if (!completedTasksGroupedByTags[UNCLASSIFIED_KEY]) {
					completedTasksGroupedByTags[UNCLASSIFIED_KEY] = [];
				}

				completedTasksGroupedByTags[UNCLASSIFIED_KEY].push(task);
			}
		});

		return Object.keys(completedTasksGroupedByTags).map((tagName) => {
			const completedTasksArr = completedTasksGroupedByTags[tagName];
			const numOfCompletedTasks = completedTasksArr.length;
			const percentage = Number(((numOfCompletedTasks / newNumOfCompletedTasks) * 100).toFixed(2));

			const isUnclassifiedTag = tagName === UNCLASSIFIED_KEY;

			let name = 'Unclassified';
			let color = 'black';
			let id = name;

			if (!isUnclassifiedTag) {
				const tag = tagsByRawName[tagName];
				name = tag.name;
				color = tag.color;
				id = tag.id;
			}

			return {
				name,
				color,
				value: numOfCompletedTasks,
				percentage,
				id,
			};
		});
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col min-h-[280px]">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Completion Stats</h3>

				<GeneralSelectButtonAndDropdown
					selected={selected}
					setSelected={setSelected}
					selectedOptions={selectedOptions}
				/>
			</div>

			<div
				className={classNames(
					'flex-1 mt-2 flex flex-col flex-row sm:flex-row md:flex-col lg:flex-row items-center gap-3 xl:gap-10 px-4',
					thereIsNoData && 'justify-center'
				)}
			>
				<div>
					<PieChart width={170} height={170}>
						<Pie
							data={progressBarData}
							cx={80}
							cy={80}
							innerRadius={70}
							outerRadius={85}
							paddingAngle={5}
							dataKey="percentage"
						>
							{progressBarData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
							))}

							<Label
								position="center"
								fill="white"
								content={({ viewBox }) => {
									const { cx, cy } = viewBox;

									// In Recharts, the Label component inside a Pie (or other chart types) does not support rendering HTML elements such as <div> directly because it operates within an SVG context. This is why "svg" elements like "<text>" are used instead to display the HTML elements.

									return (
										<g>
											{!thereIsNoData ? (
												<>
													<text
														x={cx}
														y={cy - 10}
														fill="white"
														textAnchor="middle"
														dominantBaseline="central"
														className="text-[24px] font-bold"
													>
														{numOfCompletedTasks.toLocaleString()}
													</text>
													<text
														x={cx}
														y={cy + 15}
														fill="#aaa"
														textAnchor="middle"
														dominantBaseline="central"
														className="text-[14px]"
													>
														Completed Tasks
													</text>
												</>
											) : (
												<text
													x={cx}
													y={cy}
													fill="#aaa"
													textAnchor="middle"
													dominantBaseline="central"
													className="text-[14px]"
												>
													No Data
												</text>
											)}
										</g>
									);
								}}
							/>
						</Pie>
					</PieChart>
				</div>

				{!thereIsNoData && <SmallLabelList progressBarData={progressBarData} />}
			</div>
		</div>
	);
};

const SmallLabelList = ({ progressBarData }) => {
	const pageContext = usePageContext();
	const dropdownFocusRankingListRef = useRef(null);
	const [isDropdownCompletedSmallListVisible, setIsDropdownCompletedSmallListVisible] = useState(false);

	const { projectsById, todoistAllProjectsById, sessionCategoriesById } = useStatsContext() || {};

	if (!projectsById || !sessionCategoriesById) {
		return;
	}

	const handleGoToCompletedTasksPage = (project) => {
		let projectsQueryParam = '';

		const { id } = project;

		// If the project is from TickTick.
		if (projectsById[id]) {
			projectsQueryParam = `?projects=${id}`;
			// If the project is from Todoist.
		} else if (todoistAllProjectsById[id]) {
			projectsQueryParam = `?projects-todoist=${id}`;
		}

		const queryParamsObj = Object.keys(pageContext.urlParsed.search).length > 0 ? pageContext.urlParsed.search : {};
		let queryParams = new URLSearchParams(queryParamsObj).toString();
		queryParams = queryParams && projectsQueryParam ? `&${queryParams}` : '';

		navigate('/completed-tasks' + projectsQueryParam + queryParams);
	};

	return (
		<div>
			<div className="space-y-2 w-full">
				{progressBarData.slice(0, 5).map((data, i) => {
					return <SmallLabel key={`${data.id}-${i}`} data={data} onClick={handleGoToCompletedTasksPage} />;
				})}
			</div>

			{progressBarData?.length > 5 && (
				<div className="relative">
					<div
						ref={dropdownFocusRankingListRef}
						onClick={() => setIsDropdownCompletedSmallListVisible(!isDropdownCompletedSmallListVisible)}
						className="text-color-gray-100 cursor-pointer mt-2"
					>
						View More
					</div>

					<DropdownCompletedSmallLabeList
						toggleRef={dropdownFocusRankingListRef}
						isVisible={isDropdownCompletedSmallListVisible}
						setIsVisible={setIsDropdownCompletedSmallListVisible}
						progressBarData={progressBarData}
						onClick={handleGoToCompletedTasksPage}
					/>
				</div>
			)}
		</div>
	);
};

export default CompletionStatsCard;
