import { Ring } from "../../../types/api";

export interface Streak {
	days: number;
	from: string | null;
	to: string | null;
}

export interface StreakData {
	currentStreak?: Streak;
	longestStreak?: Streak;
	allStreaks?: Streak[];
	dailyDurationsMap?: {
		[dateKey: string]: number;
	};
}

export interface CombinedRing {
	ringId: string;
	ringName: string;
	ringColor: string | null;
	useThemeColor?: boolean;
	goalSeconds?: number;
	customDailyFocusGoal?: Record<string, number>;
	restDays?: Record<string, boolean>;
	selectedDaysOfWeek?: Record<string, boolean>;
	dailyDurationsMap?: Record<string, number>;
	inactivePeriods?: Array<{ startDate: string; endDate: string | null }>;
}

export interface CombinedStreakData {
	combinedStreaks?: {
		currentStreak?: Streak;
		longestStreak?: Streak;
		allStreaks?: Streak[];
	};
	rings?: CombinedRing[];
	combinedGoalMetMap?: Record<string, boolean>;
	dailyDurationsMap?: Record<string, number>;
}

export interface ModalFocusGoalProgressProps {
	isOpen: boolean;
	onClose: () => void;
	mode: 'single' | 'combined';
	// Single mode props
	streakData?: StreakData;
	ring?: Ring;
	// Combined mode props
	combinedStreakData?: CombinedStreakData;
	rings?: CombinedRing[];
}