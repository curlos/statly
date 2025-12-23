import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../components/Icon';
import { getFormattedDuration } from '../../utils/helpers.utils';
import { hexToRgba } from '../../utils/color.utils';
import { truncateText } from '../../utils/text.utils';
import { useState } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetStreaksTodayQuery, useGetStreakHistoryQuery, useGetCombinedStreakHistoryQuery } from '../../services/resources/streaksApi';
import Spinner from '../../components/Loaders/Spinner';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import ModalFocusGoalProgress from '../../components/Modal/ModalFocusGoalProgress';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import useWindowSize from '../../hooks/useWindowSize';
import type { Ring } from '../../types/api';

// Inferred types from API responses
interface RingTodayData {
	ringId: string;
	totalFocusDurationForDay: number;
}

interface RingTodayEntry {
	todayData: RingTodayData;
}

interface Streak {
	days: number;
	from: string | null;
	to: string | null;
}

interface RingStreakData {
	ringId: string;
	currentStreak?: Streak;
	longestStreak?: Streak;
	allStreaks?: Streak[];
	dailyDurationsMap?: {
		[dateKey: string]: number;
	};
}

interface AllRingsTodayResponse {
	rings: RingTodayEntry[];
}

interface AllRingsStreakResponse {
	rings: RingStreakData[];
}

interface CombinedRing {
	ringId: string;
	ringName: string;
	ringColor: string | null;
	useThemeColor?: boolean;
	goalSeconds?: number;
	customDailyFocusGoal?: Record<string, number>;
	restDays?: Record<string, boolean>;
	selectedDaysOfWeek?: Record<string, boolean>;
	dailyDurationsMap?: Record<string, number>;
}

interface CombinedStreakResponse {
	combinedStreaks?: {
		currentStreak?: Streak;
		longestStreak?: Streak;
		allStreaks?: Streak[];
	};
	rings?: CombinedRing[];
}

// Extended Ring type with custom properties
interface RingWithCustomGoal extends Ring {
	customDailyFocusGoal?: Record<string, number>;
}

const DailyHoursFocusGoal = ({ type = 'large' }) => {
	// Fetch today's focus data for all rings
	const { queryParams } = useSharedQueryParams();
	const { data: allRingsTodayData, isLoading: isTodayLoading } = useGetStreaksTodayQuery(queryParams) as {
		data: AllRingsTodayResponse | undefined;
		isLoading: boolean;
	};

	const [isFocusGoalModalOpen, setIsFocusGoalModalOpen] = useState(false);
	const [selectedModalRingId, setSelectedModalRingId] = useState<string | 'combined' | null>(null);

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { width } = useWindowSize();
	const truncateLength = (width ?? 0) >= 576 ? 20 : 15;

	const { userSettings, focusHoursGoalPageSettings: { activeRings, showMultiRingViewForOneActiveRing } } = useUserSettingsContext();

	const combinedRingsSettings = userSettings?.pages?.focusHoursGoal?.combinedRingsSettings || {
		showStreakCount: true,
		showGoalDays: true,
		goalDays: 7
	};

	// Determine if we should fetch streak history
	const shouldFetchStreakHistory = isFocusGoalModalOpen || activeRings.some((ring: Ring) => ring.showStreakCount);

	// Fetch streak history for all rings (current + longest streaks)
	const { data: allRingsStreakData, isLoading: isStreakLoading } = useGetStreakHistoryQuery(queryParams, {
		skip: !shouldFetchStreakHistory,
	}) as {
		data: AllRingsStreakResponse | undefined;
		isLoading: boolean;
	};

	// Fetch combined streak history when there are 2+ active rings
	const shouldFetchCombinedStreaks = activeRings.length >= 2
	const { data: combinedStreakData } = useGetCombinedStreakHistoryQuery(queryParams, {
		skip: !shouldFetchCombinedStreaks,
	}) as {
		data: CombinedStreakResponse | undefined;
	};

	const isLargeType = type === 'large';

	// Helper to get today's date key
	const getTodayDateKey = () => {
		const today = new Date();
		return today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD
	};

	// Helper to get goal seconds for a ring (checks for custom goal today)
	const getGoalSecondsForRing = (ring: RingWithCustomGoal) => {
		const todayDateKey = getTodayDateKey();
		return ring.customDailyFocusGoal?.[todayDateKey] ?? ring.goalSeconds ?? 3600;
	};

	// Helper function to render a single ring
	const renderSingleRing = (ring: Ring, ringTodayData: RingTodayData | undefined, ringStreakData: RingStreakData | undefined, size = 'large') => {
		const { showStreakCount = true, goalDays = 7, showGoalDays = true } = ring;
		const { totalFocusDurationForDay = 0 } = ringTodayData || {};
		const goalSeconds = getGoalSecondsForRing(ring);
		const percentageOfFocusedGoalHours = (totalFocusDurationForDay / goalSeconds) * 100;

		const isLarge = size === 'large';
		const ringSize = isLarge ? 'w-[350px]' : 'w-[250px]';

		return (
			<div key={ring.id} className={classNames(ringSize, 'relative')}>
				<div
					className={classNames(
						'flex justify-end items-center text-orange-500 cursor-pointer',
						!showStreakCount && 'mr-4'
					)}
					onClick={() => {
						setSelectedModalRingId(ring.id);
						setIsFocusGoalModalOpen(true);
					}}
				>
					<Icon
						name="local_fire_department"
						customClass={classNames(
							!showStreakCount
								? isLarge
									? '!text-[48px]'
									: '!text-[40px]'
								: isLarge
								? '!text-[32px]'
								: '!text-[28px]'
						)}
					/>
					{showStreakCount && (
						<span className={classNames(isLarge ? '!text-[20px]' : '!text-[18px]')}>
							<span className={classNames(isLarge ? '!text-[36px]' : '!text-[36px]', 'font-bold')}>
								{(ringStreakData?.currentStreak?.days ?? 0).toLocaleString()}
							</span>
							{showGoalDays && (
								<>
									<span className="mx-[2px]">/</span>
									<span className={isLarge ? 'text-[24px]' : 'text-[20px]'}>{goalDays.toLocaleString()}</span>
								</>
							)}
						</span>
					)}
				</div>
				<CircularProgressbarWithChildren
					value={percentageOfFocusedGoalHours}
					strokeWidth={6}
					styles={buildStyles({
						textColor: '#4772F9',
						pathColor: ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor),
						trailColor: hexToRgba(ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor), 0.2),
					})}
					counterClockwise={false}
				>
					<div className="text-white flex justify-center gap-4 w-[100%] select-none mb-[-10px]">
						<div data-cy="timer-display" className="text-center">
							<div className={classNames(isLargeType ? '!text-[36px]' : '!text-[28px]', 'font-bold')}>
								<span className={classNames(isLarge ? 'text-[48px]' : 'text-[40px]', 'font-[600]')}>
									{getFormattedDuration(totalFocusDurationForDay, false)}
								</span>
								<span className="mx-[3px] text-color-gray-25">/</span>
								<span className="text-color-gray-25">{getFormattedDuration(goalSeconds, false)}</span>
							</div>
							<div className={classNames(isLarge ? 'text-[22px]' : 'text-[20px]', 'mt-[-5px] text-color-gray-100')}>
								{Number(percentageOfFocusedGoalHours).toFixed(2)}%
							</div>
						</div>
					</div>
				</CircularProgressbarWithChildren>
			</div>
		);
	};

	// Get modal data for selected ring
	const getModalData = () => {
		const ringId = selectedModalRingId;
		const ring = activeRings.find((r: Ring) => r.id === ringId);
		const ringStreakData = allRingsStreakData?.rings?.find((r: RingStreakData) => r.ringId === ringId);
		return { ring, streakData: ringStreakData };
	};

	const { ring: modalRing, streakData: modalStreakData } = getModalData();

	// Transform RingStreakData to StreakData for the modal (remove ringId)
	const modalStreakDataForModal = modalStreakData ? {
		currentStreak: modalStreakData.currentStreak,
		longestStreak: modalStreakData.longestStreak,
		allStreaks: modalStreakData.allStreaks,
		dailyDurationsMap: modalStreakData.dailyDurationsMap
	} : undefined;

	return (
		<div className="relative">
			{(isTodayLoading || isStreakLoading) && (
				<div className="absolute top-4 right-4 z-10">
					<Spinner size="xl" />
				</div>
			)}

			{activeRings.length === 1 && !showMultiRingViewForOneActiveRing ? (
				// Single active ring view
				<div>
					{renderSingleRing(
						activeRings[0],
						allRingsTodayData?.rings?.find((r: RingTodayEntry) => r.todayData?.ringId === activeRings[0].id)?.todayData,
						allRingsStreakData?.rings?.find((r: RingStreakData) => r.ringId === activeRings[0].id),
						type
					)}
				</div>
			) : (
				// Multiple active rings - Apple Watch style
				<div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 items-center">
					{/* LEFT SIDE - Text Stats */}
					<div className="flex-1 space-y-2">
						{activeRings.map((ring: Ring) => {
							const ringTodayData = allRingsTodayData?.rings?.find((r: RingTodayEntry) => r.todayData?.ringId === ring.id)?.todayData;
							const ringStreakData = allRingsStreakData?.rings?.find((r: RingStreakData) => r.ringId === ring.id);
							const goalSeconds = getGoalSecondsForRing(ring);

							return (
								<div
									key={ring.id}
									className="flex items-center cursor-pointer rounded-lg transition-colors"
									onClick={() => {
										setSelectedModalRingId(ring.id);
										setIsFocusGoalModalOpen(true);
									}}
								>
									{type === 'small' && (
										<div className="w-[70px] h-[70px] mr-3 flex-shrink-0">
											<CircularProgressbar
												value={((ringTodayData?.totalFocusDurationForDay || 0) / goalSeconds) * 100}
												strokeWidth={12}
												styles={buildStyles({
													pathColor: ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor),
													trailColor: hexToRgba(ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor), 0.2),
												})}
											/>
										</div>
									)}
									<div className="flex-1 min-w-0">
										{/* Ring name with fire icon and streak */}
										<h3 className={classNames(
											"text-color-gray-25 flex items-center gap-2",
											type === 'small' ? "text-[18px]" : "text-[22px]"
										)}>
											<span className="truncate">{truncateText(ring.name, truncateLength)}</span>
											<div className="flex items-center">
												<Icon name="local_fire_department" customClass={classNames(
													"text-orange-500",
													type === 'small' ? "!text-[20px]" : "!text-[24px]"
												)} />
												{ring.showStreakCount && (
													<span className="text-orange-500">
														<span className={classNames(
															"font-bold",
															type === 'small' ? "text-[20px]" : "text-[24px]"
														)}>
															{(ringStreakData?.currentStreak?.days ?? 0).toLocaleString()}
														</span>
														{ring.showGoalDays && (
															<>
																<span className="mx-[2px]">/</span>
																<span className={type === 'small' ? "text-[14px]" : "text-[18px]"}>{ring.goalDays.toLocaleString()}</span>
															</>
														)}
													</span>
												)}
											</div>
										</h3>

										{/* Focus duration / goal */}
										<p
											className="mt-0 font-semibold"
											style={{ color: ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor) }}
										>
											<span className={type === 'small' ? "text-[22px]" : "text-[28px]"}>
												{getFormattedDuration(ringTodayData?.totalFocusDurationForDay || 0, false)}
											</span>
											<span className={classNames(
												"mx-[3px] opacity-60",
												type === 'small' ? "text-[16px]" : "text-[20px]"
											)}>/</span>
											<span className={classNames(
												"opacity-60",
												type === 'small' ? "text-[16px]" : "text-[20px]"
											)}>
												{getFormattedDuration(goalSeconds, false)}
											</span>
										</p>
									</div>
								</div>
							);
						})}
					</div>

					{/* RIGHT SIDE - Concentric Rings */}
					{type !== 'small' && (
						<div className="relative w-[300px] h-[300px] flex-shrink-0 flex items-center justify-center">
							{/* Fire icon for combined streak (only shown when 2+ rings) */}
							{activeRings.length >= 2 && (() => {
								const currentStreakDays = combinedStreakData?.combinedStreaks?.currentStreak?.days ?? 0;
								const shouldOffsetRight = combinedRingsSettings.showGoalDays || currentStreakDays > 1000;

								return (
								<div className={classNames("absolute top-[-20px] z-10", shouldOffsetRight ? "right-[-10px]" : "right-[0px]")}>
									<div
										className="flex items-center text-orange-500 cursor-pointer ml-2"
										onClick={() => {
											setSelectedModalRingId('combined');
											setIsFocusGoalModalOpen(true);
										}}
									>
										<Icon name="local_fire_department" customClass={type === 'small' ? "!text-[22px]" : "!text-[28px]"} />
										{combinedRingsSettings.showStreakCount && (
											<span>
												<span className={classNames(
													"font-bold",
													type === 'small' ? "text-[18px]" : "text-[24px]"
												)}>
													{(combinedStreakData?.combinedStreaks?.currentStreak?.days ?? 0).toLocaleString()}
												</span>
												{combinedRingsSettings.showGoalDays && (
													<>
														<span className="mx-[2px]">/</span>
														<span className={type === 'small' ? "text-[12px]" : "text-[16px]"}>{combinedRingsSettings.goalDays.toLocaleString()}</span>
													</>
												)}
											</span>
										)}
									</div>
								</div>
								);
							})()}

							{activeRings.map((ring: Ring, index: number) => {
								const ringTodayData = allRingsTodayData?.rings?.find((r: RingTodayEntry) => r.todayData?.ringId === ring.id)?.todayData;
								const goalSeconds = getGoalSecondsForRing(ring);
								// Ring sizing: adjust based on type
								const largestSize = type === 'small' ? 187 : 280;
								const ringDecrement = type === 'small' ? 47 : 70;
								const size = largestSize - (index * ringDecrement);
								const percentage = ((ringTodayData?.totalFocusDurationForDay || 0) / goalSeconds) * 100;

								// Scale stroke width so all rings appear same thickness
								const baseStrokeWidth = 10;
								const strokeWidth = baseStrokeWidth * (largestSize / size);

								return (
									<div
										key={ring.id}
										className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
										style={{ width: size, height: size }}
									>
										<CircularProgressbar
											value={percentage}
											strokeWidth={strokeWidth}
											styles={buildStyles({
												pathColor: ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor),
												trailColor: hexToRgba(ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor), 0.2),
											})}
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}

			{/* Modal for ring details */}
			<ModalFocusGoalProgress
				isOpen={isFocusGoalModalOpen}
				onClose={() => {
					setIsFocusGoalModalOpen(false);
					setSelectedModalRingId(null);
				}}
				mode={selectedModalRingId === 'combined' ? 'combined' : 'single'}
				streakData={selectedModalRingId !== 'combined' ? modalStreakDataForModal : undefined as never}
				ring={selectedModalRingId !== 'combined' ? modalRing : undefined}
				combinedStreakData={selectedModalRingId === 'combined' ? combinedStreakData : undefined}
				rings={selectedModalRingId === 'combined' ? combinedStreakData?.rings : undefined}
			/>
		</div>
	);
};

export default DailyHoursFocusGoal;
