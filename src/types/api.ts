/**
 * API Response Types
 * Type definitions for API responses and transformed data
 */

import type { Project, ProjectGroup, Task, FocusRecord, User } from './models';

// ============================================================================
// Projects API
// ============================================================================

export interface GetProjectsResponse {
	projects: Project[];
	projectsById: Record<string, Project>;
	projectsTickTick: Project[];
	projectsTodoist: Project[];
	projectsSession: Project[];
	projectsSessionById: Record<string, Project>;
}

export interface GetProjectGroupsResponse {
	projectGroups: ProjectGroup[];
	projectGroupsById: Record<string, ProjectGroup>;
}

// ============================================================================
// Tasks API
// ============================================================================

export interface GetTasksResponse {
	tasks: Task[];
	tasksById?: Record<string, Task>;
}

// ============================================================================
// Focus Records API
// ============================================================================

export interface GetFocusRecordsResponse {
	focusRecords: FocusRecord[];
	focusRecordsById?: Record<string, FocusRecord>;
}

// ============================================================================
// Stats API
// ============================================================================

export interface StatItem {
	id: string;
	name?: string;
	count: number;
	percentage: number;
	type?: 'project' | 'task';
	projectId?: string;
	color?: string;
	[key: string]: unknown;
}

export interface TaskStatsByDayItem {
	date: string;
	count: number;
}

export interface FocusStatsByDayItem {
	date: string;
	duration: number;
	count: number;
}

export interface StatsByHourItem {
	hour: number;
	duration: number;
	count: number;
}

export interface TaskStatsByRecordItem {
	startTime: string;
	endTime: string;
	count: number;
}

export interface FocusStatsByRecordItem {
	startTime: string;
	endTime: string;
	duration: number;
	count: number;
}

export interface FocusRecordDetail {
	id: string;
	taskId: string;
	taskName: string;
	projectId: string;
	projectName: string;
	projectColor: string;
	startTime: string;
	endTime: string;
	duration: number;
}

export interface OverviewStatsResponse {
	totalTasksCount: number;
	totalCompletedTasksCount: number;
	todayCompletedTasksCount: number;
	totalFocusRecordCount: number;
	totalFocusDuration: number;
	todayFocusRecordCount: number;
	todayFocusDuration: number;
	totalProjectsCount: number;
	activeDays: number;
	firstCompletedTaskDate?: string;
	firstFocusRecordDate?: string;
}

export interface TaskStatsResponse {
	summary?: {
		totalCount: number;
		dateRange?: {
			start: string | null;
			end: string | null;
		};
	};
	byDay?: TaskStatsByDayItem[];
	byWeek?: TaskStatsByDayItem[];
	byMonth?: TaskStatsByDayItem[];
	byYear?: TaskStatsByDayItem[];
	byRecord?: TaskStatsByRecordItem[];
	byProject?: StatItem[];
	byTask?: StatItem[];
	ancestorTasksById?: Record<string, AncestorTask>;
}

export interface FocusStatsResponse {
	summary?: {
		totalDuration: number;
		totalRecords: number;
		dateRange?: {
			start: string | null;
			end: string | null;
		};
	};
	byDay?: FocusStatsByDayItem[];
	byWeek?: FocusStatsByDayItem[];
	byMonth?: FocusStatsByDayItem[];
	byYear?: FocusStatsByDayItem[];
	byRecord?: FocusStatsByRecordItem[];
	byHour?: StatsByHourItem[];
	byProject?: StatItem[];
	byTask?: StatItem[];
	byEmotion?: StatItem[];
	byEmotionWithTasks?: Record<string, {
		byProject: StatItem[];
		byTask: StatItem[];
		ancestorTasksById: Record<string, AncestorTask>;
	}>;
	records?: FocusRecordDetail[];
	ancestorTasksById?: Record<string, AncestorTask>;
}

// For backwards compatibility - union type
export type StatsResponse = TaskStatsResponse | FocusStatsResponse;

// ============================================================================
// User API
// ============================================================================

export interface AuthResponse {
	user: User;
	token: string;
}

export interface UserSettingsResponse {
	settings: Record<string, unknown>;
}

// ============================================================================
// Tasks API (additional responses)
// ============================================================================

export interface AncestorTask {
	id: string;
	title: string;
	parentId: string | null;
	ancestorIds: string[];
	projectId: string;
}

export interface NoteStats {
	totalCharacters: number;
	totalWords: number;
}

export interface DayWithCompletedTasks {
	completedTasksForDay: Task[];
	dateStr: string;
}

export interface DaysWithCompletedTasksResponse {
	data: DayWithCompletedTasks[];
	totalTasks: number;
	totalPages: number;
	page: number;
	limit: number;
	hasMore: boolean;
	ancestorTasksById: Record<string, AncestorTask>;
}

// Medal types
export interface TasksMedal {
	type: 'tasks';
	intervalsEarned: string[];
}

export interface FocusMedal {
	type: 'focus';
	intervalsEarned: string[];
}

export type Medal = TasksMedal | FocusMedal;

// Medal with name (transformed from API response for UI components)
export interface TasksMedalWithName {
	name: string;
	type: 'tasks';
	intervalsEarned: string[];
	interval?: string;
}

export interface FocusMedalWithName {
	name: string;
	type: 'focus';
	intervalsEarned: string[];
	interval?: string;
}

export type MedalWithName = TasksMedalWithName | FocusMedalWithName;

export type TasksMedalsResponse = Record<string, TasksMedal>;

// Challenge types - discriminated union based on 'type' field
export interface TaskChallenge {
	name: string;
	requiredCompletedTasks: number;
	completedDate: string | null;
	type: 'tasks';
}

export interface FocusChallenge {
	name: string;
	requiredDuration: number;
	completedDate: string | null;
	type: 'focus';
}

export type Challenge = TaskChallenge | FocusChallenge;

export type TasksChallengesResponse = TaskChallenge[];

export interface AllTasksResponse {
	tasks: Task[];
}

// ============================================================================
// Focus Records API (additional responses)
// ============================================================================

export interface FocusRecordsResponse {
	data: FocusRecord[];
	total: number;
	totalPages: number;
	page: number;
	limit: number;
	hasMore: boolean;
	totalDuration: number;
	onlyTasksTotalDuration: number;
	emotionCounts: Record<string, number>;
	noteStats: NoteStats;
	ancestorTasksById?: Record<string, AncestorTask>;
}

export type FocusMedalsResponse = Record<string, FocusMedal>;

export type FocusChallengesResponse = FocusChallenge[];

export interface AllFocusRecordsResponse {
	focusRecords: FocusRecord[];
}

export interface FocusRecordsNeedingSentimentResponse {
	recordIds: string[];
}

// ============================================================================
// Sync API
// ============================================================================

export interface SyncResponse {
	success: boolean;
	message?: string;
}

// ============================================================================
// Delete API
// ============================================================================

export interface DeleteResponse {
	success: boolean;
	deletedCount?: number;
}

// ============================================================================
// Import API
// ============================================================================

export interface ImportResponse {
	success: boolean;
	imported?: number;
	failed?: number;
}

// ============================================================================
// Streaks API
// ============================================================================

export interface StreakHistoryResponse {
	streaks: unknown[]; // Define proper streak type if needed
}

// ============================================================================
// User Settings API
// ============================================================================

export interface CardImageSettings {
	focus: string;
	tasks: string;
}

export interface SelectedDaysOfWeek {
	monday: boolean;
	tuesday: boolean;
	wednesday: boolean;
	thursday: boolean;
	friday: boolean;
	saturday: boolean;
	sunday: boolean;
}

export interface Ring {
	id: string;
	name: string;
	color: string;
	useThemeColor: boolean;
	isActive: boolean;
	goalSeconds: number;
	showStreakCount: boolean;
	goalDays: number;
	showGoalDays: boolean;
	selectedDaysOfWeek: SelectedDaysOfWeek;
	projects?: Record<string, boolean>;
	restDays?: Record<string, boolean>;
	customDailyFocusGoal?: Record<string, number>;
	inactivePeriods: unknown[];
	createdAt: string;
	updatedAt: string;
	_id: string;
}

export interface FocusRecordsPageSettings {
	showFocusNotes: boolean;
	showTotalFocusDuration: boolean;
	showCompletedTasks: boolean;
	showTaskAncestors: boolean;
	showTaskProjectName: boolean;
	taskIdIncludeFocusRecordsFromSubtasks: boolean;
	filterOutUnrelatedTasksWhenTaskIdIsApplied: boolean;
	maxFocusRecordsPerPage: number;
	onlyExportTasksWithNoParent: boolean;
	showMedals: boolean;
	selectedMedalImage: string;
	medalImageSizePx: number;
	showMedalGlow: boolean;
	showFocusRecordEmotions: boolean;
	showEmotionCount: boolean;
	showNoteStats: boolean;
	analyzeNoteEmotionsWhileSyncingFocusRecords: boolean;
	customDisplay: {
		useBackgroundImage: boolean;
		backgroundImage: string;
		backgroundImageOpacity: number;
		useBackgroundColor: boolean;
		backgroundColor: string;
		useTextColor: boolean;
		textColor: string;
	};
}

export interface CompletedTasksPageSettings {
	taskIdIncludeCompletedTasksFromSubtasks: boolean;
	filterOutUnrelatedTasksWhenTaskIdIsApplied: boolean;
	groupedTasksCollapsedByDefault: boolean;
	showIndentedTasks: boolean;
	onlyExportTasksWithNoParent: boolean;
	maxDaysPerPage: number;
}

export interface FocusHoursGoalPageSettings {
	rings: Ring[];
	showMultiRingViewForOneActiveRing: boolean;
	combinedRingsSettings?: {
		showStreakCount: boolean;
		showGoalDays: boolean;
		goalDays: number;
	};
}

export interface ChallengesPageSettings {
	selectedChallengeCardImage: CardImageSettings;
}

export interface MedalsPageSettings {
	selectedMedalCardImage: CardImageSettings;
	defaultMedalInterval: string;
	customMedalStartDate: string;
}

export interface UserSettingsPages {
	focusRecords: FocusRecordsPageSettings;
	completedTasks: CompletedTasksPageSettings;
	focusHoursGoal: FocusHoursGoalPageSettings;
	challenges: ChallengesPageSettings;
	medals: MedalsPageSettings;
	[key: string]: FocusRecordsPageSettings | CompletedTasksPageSettings | FocusHoursGoalPageSettings | ChallengesPageSettings | MedalsPageSettings;
}

export interface UserSettings {
	_id: string;
	userId: string;
	theme: {
		color: string;
		fontFamily: string;
	};
	pages: UserSettingsPages;
	tickTickInboxProjectId?: string;
	autoSyncEnabled: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
	tickTickCookieSet: boolean;
}

export interface GetUserSettingsResponse {
	userSettings: UserSettings;
}

// ============================================================================
// Generic API Types
// ============================================================================

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
}
