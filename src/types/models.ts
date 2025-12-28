/**
 * Domain Model Types
 * Converted from backend Mongoose schemas to frontend TypeScript interfaces
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
	_id?: string;
	email: string;
	displayEmail: string;
	password?: string; // Optional on frontend (never sent from backend)
	name?: string;
	profilePic?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// ============================================================================
// Custom Image Types
// ============================================================================

export interface CustomImage {
	_id: string;
	userId: string;
	imageUrl: string;
	cloudinaryPublicId: string;
	folder: string;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CustomImageFolder {
	_id: string;
	userId: string;
	source: string;
	name: string;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

// ============================================================================
// Project Types
// ============================================================================

export type ProjectSource = 'ProjectTickTick' | 'ProjectTodoist' | 'ProjectSession';

export interface BaseProject {
	id: string;
	userId?: string;
	source: ProjectSource;
	name: string;
	color?: string;
	sortOrder?: number;
	viewMode?: string;
	closed?: boolean;
	groupId?: string;
	parentId?: string;
	sortType?: string;
	sortOption?: {
		groupBy?: string;
		orderBy?: string;
	};
	teamId?: string;
	timeline?: {
		range?: string;
		sortType?: string;
		sortOption?: {
			groupBy?: string;
			orderBy?: string;
		};
	};
}

export interface ProjectTickTick extends BaseProject {
	source: 'ProjectTickTick';
	isOwner?: boolean;
	userCount?: number;
	etag?: string;
	modifiedTime?: Date;
	inAll?: boolean;
	showType?: number;
	muted?: boolean;
	reminderType?: number;
	transferred?: string;
	notificationOptions?: unknown[];
	permission?: string;
	kind?: string;
	needAudit?: boolean;
	barcodeNeedAudit?: boolean;
	openToTeam?: boolean;
	teamMemberPermission?: string;
}

export interface ProjectTodoist extends BaseProject {
	source: 'ProjectTodoist';
	description?: string;
	order?: number;
	isCollapsed?: boolean;
	isShared?: boolean;
	isFavorite?: boolean;
	isArchived?: boolean;
	canAssignTasks?: boolean;
	viewStyle?: string;
	isInboxProject?: boolean;
	workspaceId?: string;
	folderId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ProjectSession extends BaseProject {
	source: 'ProjectSession';
}

export type Project = ProjectTickTick | ProjectTodoist | ProjectSession;

// ============================================================================
// Project Group Types
// ============================================================================

export interface ProjectGroup {
	id: string;
	source: string;
	etag?: string;
	name: string;
	showAll?: boolean;
	sortOrder?: number;
	viewMode?: string;
	deleted?: number;
	userId?: string;
	sortType?: string;
	sortOption?: {
		groupBy?: string;
		orderBy?: string;
	};
	teamId?: string;
	timeline?: {
		range?: string;
		sortType?: string;
		sortOption?: {
			groupBy?: string;
			orderBy?: string;
		};
	};
}

// ============================================================================
// Task Types
// ============================================================================

export type TaskSource = 'TaskTickTick' | 'TaskTodoist';

export interface BaseTask {
	id: string;
	userId?: string;
	source: TaskSource;
	title: string;
	description?: string;
	projectId?: string;
	parentId?: string;
	completedTime?: Date | string;
	sortOrder?: number;
	timeZone?: string;
	ancestorIds?: string[];
	ancestorSet?: Record<string, boolean>;
}

export interface TaskTickTick extends BaseTask {
	source: 'TaskTickTick';
	taskType: 'full' | 'item';
	content?: string;
	desc?: string;
	completedUserId?: number;
	modifiedTime?: Date | string;
	createdTime?: Date | string;
	creator?: number;
	startDate?: Date | string;
	status?: number;
}

export interface TaskTodoist extends BaseTask {
	source: 'TaskTodoist';
	added_at?: Date | string;
	added_by_uid?: string;
	assigned_by_uid?: string;
	checked?: boolean;
	child_order?: number;
	collapsed?: boolean;
	day_order?: number;
	deadline?: Date | string;
	due?: unknown;
	duration?: unknown;
	is_deleted?: boolean;
	labels?: string[];
	note_count?: number;
	priority?: number;
	responsible_uid?: string;
	section_id?: string;
	sync_id?: string;
	updated_at?: Date | string;
	user_id?: string;
	v2_id?: string;
	v2_parent_id?: string;
	v2_project_id?: string;
	v2_section_id?: string;
}

export type Task = TaskTickTick | TaskTodoist;

// ============================================================================
// Focus Record Types
// ============================================================================

export type FocusRecordSource =
	| 'FocusRecordTickTick'
	| 'FocusRecordBeFocused'
	| 'FocusRecordForest'
	| 'FocusRecordTide'
	| 'FocusRecordSession';

export interface Emotion {
	emotion: string; // 'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'
	score: number; // confidence 0-1
}

export interface BaseFocusRecordTask {
	taskId: string;
	title: string;
	startTime: Date | string;
	endTime: Date | string;
	duration: number;
	projectId: string;
	projectName: string;
}

export interface TickTickFocusRecordTask extends BaseFocusRecordTask {
	ancestorIds?: string[];
}

export type FocusRecordTask = BaseFocusRecordTask | TickTickFocusRecordTask;

export interface FocusRecord {
	id: string;
	userId?: string;
	source: FocusRecordSource;
	startTime: Date | string;
	endTime: Date | string;
	duration: number;
	crossesMidnight?: boolean;
	emotions?: Emotion[];
	// Optional properties that may appear on specific focus record types
	note?: string;
	tasks?: FocusRecordTask[];
	pauseDuration?: number;
	completedTasks?: Task[];
	treeType?: string;
	isSuccess?: boolean;
}
