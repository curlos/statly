import { useState, useEffect } from 'react';
import Icon from '../Icon';
import Pagination from '../Pagination';

interface Streak {
	days: number;
	from: string | null;
	to: string | null;
}

interface StreaksListProps {
	allStreaks: Streak[];
	currentStreak?: Streak;
	sortBy: SortOption;
}

export type SortOption = 'longest' | 'shortest' | 'recent' | 'oldest';

const ITEMS_PER_PAGE = 10;

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

const StreaksList: React.FC<StreaksListProps> = ({ allStreaks, currentStreak, sortBy }) => {
	const [currentPage, setCurrentPage] = useState(1);

	// Reset to page 1 when sort changes
	useEffect(() => {
		setCurrentPage(1);
	}, [sortBy]);

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
	const totalPages = Math.ceil(sortedStreaks.length / ITEMS_PER_PAGE);
	const pagedStreaks = sortedStreaks.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div>
			<ul
				tabIndex={0}
				aria-label="All streaks"
				className="space-y-3 pr-2 list-none p-0 m-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded mb-3"
			>
				{pagedStreaks.length === 0 ? (
					<li className="text-center text-color-gray-25 py-8">
						No streaks found
					</li>
				) : (
					pagedStreaks.map((streak, pageIndex) => {
						const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + pageIndex;
						const isCurrent = isCurrentStreak(streak);
						return (
							<li
								key={`${streak.from}-${streak.to}-${absoluteIndex}`}
								aria-label={`Rank ${absoluteIndex + 1}: ${streak.days} ${streak.days === 1 ? 'day' : 'days'}${streak.from && streak.to ? `, ${formatDateWithoutTimezone(streak.from)} to ${formatDateWithoutTimezone(streak.to)}` : ''}${isCurrent ? ', current streak' : ''}`}
								className={`p-4 rounded-lg ${
									isCurrent
										? 'bg-orange-500/20 border border-orange-500'
										: 'bg-color-gray-600'
								}`}
							>
								<div className="flex items-center gap-2">
									<span className="text-color-gray-25 font-medium">
										{absoluteIndex + 1}.
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
									<div
										className="text-sm text-color-gray-25 mt-1 ml-8"
										aria-label={`${formatDateWithoutTimezone(streak.from)} to ${formatDateWithoutTimezone(streak.to)}`}
									>
										{formatDateWithoutTimezone(streak.from)} -{' '}
										{formatDateWithoutTimezone(streak.to)}
									</div>
								)}
							</li>
						);
					})
				)}
			</ul>

			{totalPages > 1 && (
				<div className="flex justify-center">
					<Pagination
						total={totalPages}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						compactView={true}
					/>
				</div>
			)}
		</div>
	);
};

export default StreaksList;
