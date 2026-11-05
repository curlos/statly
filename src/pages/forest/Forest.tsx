import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { navigate } from 'vike/client/router';
import ForestCanvas, { type ForestCanvasHandle } from './ForestCanvas';
import type { ForestTree } from './forestLayout';
import type { ForestTreeRow } from '../../types/api';
import { buildDateRangeParams, getDateRangeKey, parseDateRangeParams } from './forestDates';
import { getBars, getRangeLabel, getSlices } from './forestShare';
import {
	getAssignedTree,
	getPlantedTreeNames,
	getSeasonalTree,
	getTreeImageSrc,
	getTreeDisplayName,
} from './forestTrees';
import { describeTree } from './forestText';
import {
	LAND_OPTIONS,
	LAND_STYLES,
	getAutoLandForDate,
	getSeasonForDate,
	isSouthernHemisphereTimeZone,
	type LandStyleName,
} from './landStyles';
import Icon from '../../components/Icon';
import Spinner from '../../components/Loaders/Spinner';
import ModalForestTrees from '../../components/Modal/ModalForestTrees';
import ModalShareForest from '../../components/Modal/ModalShareForest';
import GeneralSelectButtonAndDropdown from '../stats/StatsPage/GeneralSelectButtonAndDropdown';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useStatsDateRange } from '../../hooks/useStatsDateRange';
import { useStatsQueryParams } from '../../hooks/useStatsQueryParams';
import { useGetForestTreesQuery } from '../../services/resources/focusRecordsApi';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import { useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { getFormattedDuration } from '../../utils/helpers.utils';

const INTERVAL_OPTIONS = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
// The same empty list every time, so nothing that depends on the trees runs again just because the data hasn't arrived
const NO_TREES: ForestTreeRow[] = [];

const Forest = () => {
	const [isTreesModalOpen, setIsTreesModalOpen] = useState(false);
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const canvasRef = useRef<ForestCanvasHandle>(null);
	const legendId = useId();

	const {
		forestPageSettings: { landStyle, hemisphere, projectTrees },
		isLoadingGetUserSettings,
	} = useUserSettingsContext();

	// The date range lives in the URL like on the Focus Records page, and today (the default) has no params. The picker starts on whatever the URL says so there is no flash of today first.
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const urlRange = parseDateRangeParams(
		{
			interval: searchParams.get('date-interval'),
			start: searchParams.get('start-date'),
			end: searchParams.get('end-date'),
		},
		new Date()
	);

	const {
		selectedInterval,
		setSelectedInterval,
		selectedDates,
		setSelectedDates,
		setStartDate,
		setEndDate,
		apiStartDate,
		apiEndDate,
		setIsModalPickDateRangeOpen,
		renderDateRangePicker,
		renderCustomDateModal,
	} = useStatsDateRange({
		initialInterval: urlRange.interval,
		initialDates: urlRange.dates,
		initialStartDate: urlRange.dates[0],
		initialEndDate: urlRange.dates[urlRange.dates.length - 1],
	});

	// Keeps the picker and the URL in step. Whichever one changed is copied to the other, after a moment so a change that takes the picker two steps (like picking another interval) only reaches the URL once.
	const stateKey = getDateRangeKey(selectedInterval, selectedDates);
	const urlKey = getDateRangeKey(urlRange.interval, urlRange.dates);
	const previousKeysRef = useRef({ state: stateKey, url: urlKey });

	useEffect(() => {
		const previous = previousKeysRef.current;
		previousKeysRef.current = { state: stateKey, url: urlKey };
		if (stateKey === urlKey) return;

		if (urlKey !== previous.url && stateKey === previous.state) {
			// The URL changed on its own, like from the back button or the filter sidebar, so the picker follows it.
			setSelectedInterval(urlRange.interval);
			setSelectedDates(urlRange.dates);
			if (urlRange.interval === 'Custom') {
				setStartDate(urlRange.dates[0]);
				setEndDate(urlRange.dates[urlRange.dates.length - 1]);
			}

			// The picker picks its own dates whenever the interval changes, so once it has, the URL's dates go back in. This lands before the 50ms wait above, so the URL isn't rewritten.
			setTimeout(() => setSelectedDates(urlRange.dates), 30);
			return;
		}

		const timer = setTimeout(
			() => updateQueryParams(buildDateRangeParams(selectedInterval, selectedDates, new Date())),
			50
		);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateKey, urlKey]);

	const queryParams = useStatsQueryParams({
		'interval-start-date': apiStartDate ?? undefined,
		'interval-end-date': apiEndDate ?? undefined,
	});
	// Waits for the settings, and for the URL to catch up with the picker so the first request already has the right dates.
	const shouldSkipQuery = isLoadingGetUserSettings || stateKey !== urlKey;
	const { data: forestData, isLoading, isFetching } = useGetForestTreesQuery(queryParams, { skip: shouldSkipQuery });
	const treeRows = forestData?.rows ?? NO_TREES;
	const { data: fetchedProjects } = useGetProjectsQuery();
	const projectsById = fetchedProjects?.projectsById;

	const [editUserSettings] = useEditUserSettingsMutation();

	const trees: ForestTree[] = useMemo(
		() =>
			treeRows.map(({ recordId, startTime, projectId, seconds, projectSeconds }) => ({
				key: `${recordId}-${projectId}`,
				startTime,
				treeName: getSeasonalTree(getAssignedTree(projectId, projectTrees), startTime),
				projectId,
				seconds,
				projectSeconds,
			})),
		[treeRows, projectTrees]
	);

	// The words for a tree's tooltip and announcement, made only for the tree being shown
	const describeForestTree = useCallback(
		(tree: ForestTree) => describeTree(tree, (projectId) => projectsById?.[projectId]?.name || 'No Project'),
		[projectsById]
	);

	// Each project in this forest with its tree, how many trees it grew and how much task time it had. The time is added up from each task, the same way the stats page does, so a record shared by two projects splits its time between them. Also the text version of the picture for screen readers.
	const legendRows = useMemo(() => {
		const totalsByProject = new Map<string, { count: number; seconds: number }>();
		const getTotals = (projectId: string) => totalsByProject.get(projectId) ?? { count: 0, seconds: 0 };
		const plantedTreeNames = getPlantedTreeNames(treeRows, projectTrees);

		treeRows.forEach(({ projectId, projectSeconds }) => {
			totalsByProject.set(projectId, { ...getTotals(projectId), count: getTotals(projectId).count + 1 });
			Object.entries(projectSeconds).forEach(([id, seconds]) => {
				totalsByProject.set(id, { ...getTotals(id), seconds: getTotals(id).seconds + seconds });
			});
		});

		return [...totalsByProject]
			.map(([projectId, { count, seconds }]) => ({
				projectId,
				name: projectsById?.[projectId]?.name || 'No Project',
				color: projectsById?.[projectId]?.color,
				// The trees as they stand in the forest. A project with time but no trees of its own shows its assigned tree.
				treeNames: plantedTreeNames.get(projectId) ?? [getAssignedTree(projectId, projectTrees)],
				count,
				seconds,
			}))
			.sort((a, b) => b.seconds - a.seconds);
	}, [treeRows, projectsById, projectTrees]);

	const totalSeconds = useMemo(() => legendRows.reduce((total, { seconds }) => total + seconds, 0), [legendRows]);

	// Time per record for the bar chart, from the same task time as everything else
	const timeRows = useMemo(
		() =>
			treeRows.map(({ startTime, projectSeconds }) => ({
				startTime,
				seconds: Object.values(projectSeconds).reduce((total, seconds) => total + seconds, 0),
			})),
		[treeRows]
	);

	const autoSeasonDate =
		selectedInterval === 'All' ? new Date() : selectedDates[selectedDates.length - 1] || new Date();
	const timeZoneIsSouthern = useMemo(
		() => isSouthernHemisphereTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone),
		[]
	);
	const isSouthern = hemisphere === 'auto' ? timeZoneIsSouthern : hemisphere === 'southern';
	const landStyleName =
		landStyle === 'auto'
			? getAutoLandForDate(autoSeasonDate, isSouthern)
			: landStyle === 'seasons'
				? getSeasonForDate(autoSeasonDate, isSouthern)
				: (landStyle as LandStyleName);
	const land = LAND_STYLES[landStyleName] || LAND_STYLES.summer;
	const selectedLandOption = LAND_OPTIONS.find((option) => option.toLowerCase() === landStyle) || 'Auto';
	const treeCountText = `${trees.length.toLocaleString()} ${trees.length === 1 ? 'tree' : 'trees'}`;

	// Opens the Focus Records page on the day the tree came from. The page can't open one record, so this is as close as it gets.
	const openTreeDay = (tree: ForestTree) => {
		const day = getFormattedShortMonthDay(new Date(tree.startTime));
		const params = new URLSearchParams({ 'start-date': day, 'end-date': day, 'date-interval': 'Custom' });
		navigate(`/focus-records?${params}`);
	};

	const renderForest = useCallback(
		(width: number, height: number) => canvasRef.current!.renderImage(width, height),
		[]
	);

	// Everything the share card shows: the range, the total time, the tree count, and the pie and bar data.
	const shareData = useMemo(
		() => ({
			rangeLabel: getRangeLabel(selectedInterval, selectedDates),
			totalSeconds,
			treeCount: trees.length,
			slices: getSlices(legendRows),
			bars: getBars(timeRows, selectedInterval, selectedDates),
		}),
		[selectedInterval, selectedDates, totalSeconds, trees.length, legendRows, timeRows]
	);

	return (
		<div className="flex-1 flex flex-col bg-color-gray-600 p-3 rounded-lg">
			<div className="flex flex-wrap justify-between items-center gap-2">
				<div className="flex items-center gap-2">
					<h2 className="font-bold text-[16px]">Your Forest</h2>
					<span className="text-color-gray-50">
						{treeCountText} · {getFormattedDuration(totalSeconds, false)}
					</span>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<GeneralSelectButtonAndDropdown
						selected={selectedLandOption}
						setSelected={(option) => editUserSettings({ 'pages.forest.landStyle': option.toLowerCase() })}
						selectedOptions={LAND_OPTIONS}
					/>

					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={INTERVAL_OPTIONS}
						onClick={(name) => {
							if (name?.toLowerCase() === 'custom') {
								setIsModalPickDateRangeOpen(true);
							}
						}}
					/>

					{renderDateRangePicker()}

					{/* Icon buttons. The words stay in the page for screen readers, and show as a tooltip on hover. */}
					<button
						type="button"
						title="Assign Trees"
						className="flex items-center justify-center p-1 border border-color-gray-50 rounded-full bg-color-gray-300 text-color-gray-50 cursor-pointer"
						onClick={() => setIsTreesModalOpen(true)}
					>
						<Icon name="park" customClass="!text-[20px]" />
						<span className="sr-only">Assign Trees</span>
					</button>

					<button
						type="button"
						title="Share"
						className="flex items-center justify-center p-1 border border-color-gray-50 rounded-full bg-color-gray-300 text-color-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={trees.length === 0}
						onClick={() => setIsShareModalOpen(true)}
					>
						<Icon name="ios_share" customClass="!text-[20px]" />
						<span className="sr-only">Share</span>
					</button>
				</div>
			</div>

			{/* On short screens, like a phone held sideways, the forest shrinks so it fits instead of running off the bottom. */}
			{forestData?.isTruncated && (
				<p
					role="status"
					className="m-0 mt-2 px-2 py-1 rounded-md bg-color-gray-300 text-color-gray-25 text-[14px]"
				>
					Showing the newest {forestData.rows.length.toLocaleString()} of{' '}
					{forestData.totalRecords.toLocaleString()} trees. Pick a shorter date range to see the older ones.
				</p>
			)}

			<div className="relative flex-1 min-h-[clamp(160px,calc(100dvh_-_220px),450px)] mt-2">
				<div className="absolute inset-0">
					<ForestCanvas
						ref={canvasRef}
						trees={trees}
						land={land}
						ariaLabel={`Forest with ${treeCountText} on ${landStyleName} land.`}
						describedById={legendRows.length > 0 ? legendId : undefined}
						describeTree={describeForestTree}
						onOpenTree={openTreeDay}
					/>
				</div>

				{!isLoading && !isFetching && trees.length === 0 && (
					<p className="absolute top-2 left-2 text-color-gray-50">No focus records in this date range.</p>
				)}
			</div>

			{legendRows.length > 0 && (
				<details id={legendId} open className="mt-3">
					<summary className="cursor-pointer text-[14px] font-semibold">
						Projects in this forest ({legendRows.length})
					</summary>
					{/* Fills down each column before starting the next, so the most focus is at the top left. The row counts match the number of columns at each screen size. */}
					<ul
						className="relative mt-2 max-h-[200px] overflow-y-auto gray-scrollbar grid grid-flow-col auto-cols-[minmax(0,1fr)] grid-rows-[repeat(var(--rows-1),auto)] sm:grid-rows-[repeat(var(--rows-2),auto)] lg:grid-rows-[repeat(var(--rows-3),auto)] gap-x-4 gap-y-1 list-none p-0 m-0"
						style={
							{
								'--rows-1': legendRows.length,
								'--rows-2': Math.ceil(legendRows.length / 2),
								'--rows-3': Math.ceil(legendRows.length / 3),
							} as React.CSSProperties
						}
					>
						{legendRows.map(({ projectId, name, color, treeNames, count, seconds }) => (
							<li key={projectId || 'no-project'} className="flex items-center gap-2 text-[14px] min-w-0">
								<span className="flex shrink-0" title={treeNames.map(getTreeDisplayName).join(', ')}>
									{treeNames.slice(0, 3).map((treeName) => (
										<img
											key={treeName}
											src={getTreeImageSrc(treeName)}
											alt=""
											loading="lazy"
											className="w-6 h-6 object-contain shrink-0 -mr-1 last:mr-0"
										/>
									))}
								</span>
								<span className="sr-only">Trees: {treeNames.map(getTreeDisplayName).join(', ')}.</span>
								<span
									aria-hidden="true"
									className="w-2 h-2 rounded-full shrink-0"
									style={{ backgroundColor: color || 'transparent' }}
								/>
								<span className="truncate flex-1">{name}</span>
								<span className="text-color-gray-50 whitespace-nowrap">
									{count > 0 && `${count.toLocaleString()} ${count === 1 ? 'tree' : 'trees'} · `}
									{getFormattedDuration(seconds, false)}
								</span>
							</li>
						))}
					</ul>
				</details>
			)}

			{renderCustomDateModal()}

			<ModalForestTrees isOpen={isTreesModalOpen} onClose={() => setIsTreesModalOpen(false)} />
			<ModalShareForest
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				data={shareData}
				renderForest={renderForest}
			/>
		</div>
	);
};

export default Forest;
