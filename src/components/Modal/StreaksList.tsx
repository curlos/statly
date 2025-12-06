import { useState } from 'react';
import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';

interface Streak {
	days: number;
	from: string | null;
	to: string | null;
}

interface StreaksListProps {
	allStreaks: Streak[];
	currentStreak?: Streak;
}

type SortOption = 'longest' | 'shortest' | 'recent' | 'oldest';

// Helper function to format date string without timezone conversion
const formatDateWithoutTimezone = (dateString: string): string => {
	// Parse YYYY-MM-DD format directly without timezone conversion
	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day); // Month is 0-indexed
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

const StreaksList: React.FC<StreaksListProps> = ({ allStreaks, currentStreak }) => {
	const [sortBy, setSortBy] = useState<SortOption>('longest');
	const { chosenColorObj } = useThemeContext() as any;
	const { bgColorHalfOpacity } = chosenColorObj;

	// Check if a streak is the current streak
	const isCurrentStreak = (streak: Streak): boolean => {
		if (!currentStreak || !currentStreak.from || !currentStreak.to) return false;
		return streak.from === currentStreak.from && streak.to === currentStreak.to;
	};

	// Sort streaks based on selected option
	const getSortedStreaks = (): Streak[] => {
		const streaksCopy = [...allStreaks];

		switch (sortBy) {
			case 'longest':
				return streaksCopy.sort((a, b) => {
					if (b.days === a.days) {
						// If days are equal, take the more recent one (by end date)
						if (!a.to || !b.to) return 0;
						return b.to.localeCompare(a.to);
					}
					return b.days - a.days;
				});
			case 'shortest':
				return streaksCopy.sort((a, b) => {
					if (a.days === b.days) {
						// If days are equal, take the more recent one (by end date)
						if (!a.to || !b.to) return 0;
						return b.to.localeCompare(a.to);
					}
					return a.days - b.days;
				});
			case 'recent':
				return streaksCopy.sort((a, b) => {
					if (!a.to || !b.to) return 0;
					return b.to.localeCompare(a.to);
				});
			case 'oldest':
				return streaksCopy.sort((a, b) => {
					if (!a.to || !b.to) return 0;
					return a.to.localeCompare(b.to);
				});
			default:
				return streaksCopy;
		}
	};

	const sortedStreaks = getSortedStreaks();

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${bgColorHalfOpacity} ${sharedButtonStyle}`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-600`;

	return (
		<div>
			{/* Sort Options */}
			<div className="mb-4 flex gap-2 justify-center flex-wrap">
				<button
					onClick={() => setSortBy('longest')}
					className={sortBy === 'longest' ? selectedButtonStyle : unselectedButtonStyle}
				>
					Longest
				</button>
				<button
					onClick={() => setSortBy('shortest')}
					className={sortBy === 'shortest' ? selectedButtonStyle : unselectedButtonStyle}
				>
					Shortest
				</button>
				<button
					onClick={() => setSortBy('recent')}
					className={sortBy === 'recent' ? selectedButtonStyle : unselectedButtonStyle}
				>
					Most Recent
				</button>
				<button
					onClick={() => setSortBy('oldest')}
					className={sortBy === 'oldest' ? selectedButtonStyle : unselectedButtonStyle}
				>
					Oldest
				</button>
			</div>

			{/* Streaks List */}
			<div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-thin gray-scrollbar">
				{sortedStreaks.length === 0 ? (
					<div className="text-center text-color-gray-100 py-8">
						No streaks found
					</div>
				) : (
					sortedStreaks.map((streak, index) => {
						const isCurrent = isCurrentStreak(streak);
						return (
							<div
								key={`${streak.from}-${streak.to}-${index}`}
								className={`p-4 rounded-lg ${
									isCurrent
										? 'bg-orange-500/20 border border-orange-500'
										: 'bg-color-gray-600'
								}`}
							>
								<div className="flex items-center gap-2">
									<span className="text-color-gray-100 font-medium">
										{index + 1}.
									</span>
									<span className="font-semibold">
										{streak.days} {streak.days === 1 ? 'Day' : 'Days'}
									</span>
									<Icon
										name="local_fire_department"
										customClass={isCurrent ? 'text-orange-500' : 'text-purple-500'}
									/>
									{isCurrent && (
										<span className="ml-auto text-orange-500 text-sm font-medium">
											Current Streak
										</span>
									)}
								</div>
								{streak.from && streak.to && (
									<div className="text-sm text-color-gray-100 mt-1 ml-8">
										{formatDateWithoutTimezone(streak.from)} -{' '}
										{formatDateWithoutTimezone(streak.to)}
									</div>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default StreaksList;
