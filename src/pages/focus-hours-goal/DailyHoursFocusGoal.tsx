import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../components/Icon';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { hexToRgba } from '../../utils/color.utils';
import { useState } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetStreaksTodayQuery, useGetStreakHistoryQuery } from '../../services/resources/streaksApi';
import Spinner from '../../components/Loaders/Spinner';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import ModalFocusGoalProgress from '../../components/Modal/ModalFocusGoalProgress';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';

const DailyHoursFocusGoal = ({ type = 'large' }) => {
	// Fetch today's focus data for all rings
	const { queryParams } = useSharedQueryParams();
	const { data: allRingsTodayData, isLoading: isTodayLoading } = useGetStreaksTodayQuery(queryParams);

	const [isFocusGoalModalOpen, setIsFocusGoalModalOpen] = useState(false);
	const [selectedModalRingId, setSelectedModalRingId] = useState(null);

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const { focusHoursGoalPageSettings: { activeRings, showMultiRingViewForOneActiveRing } } = useUserSettingsContext();

	// Determine if we should fetch streak history
	const shouldFetchStreakHistory = isFocusGoalModalOpen || activeRings.some(ring => ring.showStreakCount);

	// Fetch streak history for all rings (current + longest streaks)
	const { data: allRingsStreakData, isLoading: isStreakLoading } = useGetStreakHistoryQuery(queryParams, {
		skip: !shouldFetchStreakHistory,
	});

	const isLargeType = type === 'large';

	// Helper to get today's date key
	const getTodayDateKey = () => {
		const today = new Date();
		return today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD
	};

	// Helper to get goal seconds for a ring (checks for custom goal today)
	const getGoalSecondsForRing = (ring) => {
		const todayDateKey = getTodayDateKey();
		return ring.customDailyFocusGoal?.[todayDateKey] ?? ring.goalSeconds ?? 3600;
	};

	// Helper function to render a single ring
	const renderSingleRing = (ring, ringTodayData, ringStreakData, size = 'large') => {
		const { showStreakCount = true, goalDays = 7, showGoalDays = true } = ring;
		const { totalFocusDurationForDay = 0 } = ringTodayData || {};
		const goalSeconds = getGoalSecondsForRing(ring);
		const percentageOfFocusedGoalHours = (totalFocusDurationForDay / goalSeconds) * 100;

		const isLarge = size === 'large';
		const ringSize = isLarge ? 'w-[350px]' : 'w-[200px]';

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
							<span className={classNames(isLarge ? '!text-[36px]' : '!text-[28px]', 'font-bold')}>
								{(ringStreakData?.currentStreak?.days || 0).toLocaleString()}
							</span>
							{showGoalDays && (
								<>
									<span className="mx-[2px]">/</span>
									<span className={'text-[24px]'}>{goalDays.toLocaleString()}</span>
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
								<span className={classNames(isLarge ? 'text-[48px]' : 'text-[32px]', 'font-[600]')}>
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
		const ring = activeRings.find(r => r.id === ringId);
		const ringStreakData = allRingsStreakData?.rings?.find(r => r.ringId === ringId);
		return { ring, streakData: ringStreakData };
	};

	const { ring: modalRing, streakData: modalStreakData } = getModalData();

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
						allRingsTodayData?.rings?.find(r => r.todayData?.ringId === activeRings[0].id)?.todayData,
						allRingsStreakData?.rings?.find(r => r.ringId === activeRings[0].id),
						type
					)}
				</div>
			) : (
				// Multiple active rings - Apple Watch style
				<div className="flex gap-0 items-center">
					{/* LEFT SIDE - Text Stats */}
					<div className="flex-1 space-y-2">
						{activeRings.map((ring) => {
							const ringTodayData = allRingsTodayData?.rings?.find(r => r.todayData?.ringId === ring.id)?.todayData;
							const ringStreakData = allRingsStreakData?.rings?.find(r => r.ringId === ring.id);
							const goalSeconds = getGoalSecondsForRing(ring);

							return (
								<div
									key={ring.id}
									className="flex items-center gap-3 cursor-pointer hover:bg-color-gray-700 p-2 rounded-lg transition-colors"
									onClick={() => {
										setSelectedModalRingId(ring.id);
										setIsFocusGoalModalOpen(true);
									}}
								>
									<div className="flex-1 min-w-0">
										{/* Ring name with fire icon and streak */}
										<h3 className="text-[22px] text-color-gray-25 truncate flex items-center gap-2">
											<span>{ring.name}</span>
											<div className="flex items-center">
												<Icon name="local_fire_department" customClass="!text-[24px] text-orange-500" />
												{ring.showStreakCount && (
													<span className="text-orange-500">
														<span className="text-[24px] font-bold">
															{(ringStreakData?.currentStreak?.days || 0).toLocaleString()}
														</span>
														{ring.showGoalDays && (
															<>
																<span className="mx-[2px]">/</span>
																<span className="text-[18px]">{ring.goalDays.toLocaleString()}</span>
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
											<span className="text-[28px]">
												{getFormattedDuration(ringTodayData?.totalFocusDurationForDay || 0, false)}
											</span>
											<span className="text-[20px] mx-[3px] opacity-60">/</span>
											<span className="text-[20px] opacity-60">
												{getFormattedDuration(goalSeconds, false)}
											</span>
										</p>
									</div>
								</div>
							);
						})}
					</div>

					{/* RIGHT SIDE - Concentric Rings */}
					<div className="relative w-[300px] h-[300px] flex-shrink-0">
						{activeRings.map((ring, index) => {
							const ringTodayData = allRingsTodayData?.rings?.find(r => r.todayData?.ringId === ring.id)?.todayData;
							const goalSeconds = getGoalSecondsForRing(ring);
							const largestSize = 280;
							const size = largestSize - (index * 70);
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
				</div>
			)}

			{/* Modal for ring details */}
			<ModalFocusGoalProgress
				isOpen={isFocusGoalModalOpen}
				onClose={() => {
					setIsFocusGoalModalOpen(false);
					setSelectedModalRingId(null);
				}}
				streakData={modalStreakData}
				ring={modalRing}
			/>
		</div>
	);
};

export default DailyHoursFocusGoal;
