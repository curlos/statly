import { createContext, useContext } from 'react';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';

const UserSettingsContext = createContext();

export const useUserSettingsContext = () => {
	return useContext(UserSettingsContext);
};

export const UserSettingsProvider = ({ children }) => {
	const value = useUserSettings();
	return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
};

const useUserSettings = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const focusRecordsPageSettings = userSettings?.tickTickOne?.pages?.focusRecords || {};
	const completedTasksPageSettings = userSettings?.tickTickOne?.pages?.completedTasks || {};
	const focusHoursGoalPageSettings = userSettings?.tickTickOne?.pages?.focusHoursGoal || {};
	const challengesPageSettings = userSettings?.tickTickOne?.pages?.challenges || {};
	const medalsPageSettings = userSettings?.tickTickOne?.pages?.medals || {};

	const {
		showFocusNotes = true,
		showTotalFocusDuration = true,
		showCompletedTasks = true,
		showTaskAncestors = true,
		showTaskProjectName = true,
		taskIdIncludeFocusRecordsFromSubtasks = true,
		filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedFocusRecordsPage = true,
		maxFocusRecordsPerPage = 50,
		onlyExportTasksWithNoParent: onlyExportTasksWithNoParentFocusRecordsPage = true,
		showMedals = false,
		selectedMedalImage = 'https://i.imgur.com/SQOm6nX.png',
		medalImageSizePx = 100,
		showMedalGlow = false,
		showFocusRecordEmotions = true,
		showEmotionCount = false,
		analyzeNoteEmotionsWhileSyncingFocusRecords = false,
	} = focusRecordsPageSettings;

	const {
		taskIdIncludeCompletedTasksFromSubtasks = true,
		filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage = true,
		groupedTasksCollapsedByDefault = true,
		showIndentedTasks = true,
		onlyExportTasksWithNoParent: onlyExportTasksWithNoParentCompletedTasksPage = true,
		maxDaysPerPage = 7,
	} = completedTasksPageSettings;

	const {
		projects: filteredProjects = {},
		showStreakCount = true,
		goalDays = 7,
		goalSeconds = 3600,
		showGoalDays = true,
	} = focusHoursGoalPageSettings;

	const { selectedChallengeCardImage } = challengesPageSettings;
	const { selectedMedalCardImage, defaultMedalInterval = 'All', customMedalStartDate = '' } = medalsPageSettings;

	const [editUserSettings] = useEditUserSettingsMutation();

	const handleUpdateUserSettingForPage = async (page, userSettingProperty, newValue) => {
		const restOfPageKeysAndVals = userSettings?.tickTickOne?.pages[page];
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

		const payload = {
			tickTickOne: {
				pages: {
					...restOfPagesKeysAndVals,
					[page]: {
						...restOfPageKeysAndVals,
						[userSettingProperty]: newValue,
					},
				},
			},
		};

		await editUserSettings(payload);
	};

	return {
		handleUpdateUserSettingForPage,
		focusRecordsPageSettings: {
			showFocusNotes,
			showTotalFocusDuration,
			showCompletedTasks,
			showTaskAncestors,
			showTaskProjectName,
			taskIdIncludeFocusRecordsFromSubtasks,
			filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedFocusRecordsPage,
			maxFocusRecordsPerPage,
			onlyExportTasksWithNoParent: onlyExportTasksWithNoParentFocusRecordsPage,
			showMedals,
			selectedMedalImage,
			medalImageSizePx,
			showMedalGlow,
			showFocusRecordEmotions,
			showEmotionCount,
			analyzeNoteEmotionsWhileSyncingFocusRecords,
		},
		completedTasksPageSettings: {
			taskIdIncludeCompletedTasksFromSubtasks,
			filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage,
			groupedTasksCollapsedByDefault,
			showIndentedTasks,
			onlyExportTasksWithNoParent: onlyExportTasksWithNoParentCompletedTasksPage,
			maxDaysPerPage,
		},
		focusHoursGoalPageSettings: {
			filteredProjects,
			showStreakCount,
			goalDays,
			goalSeconds,
			showGoalDays,
		},
		challengesPageSettings: {
			selectedChallengeCardImage,
		},
		medalsPageSettings: {
			selectedMedalCardImage,
			defaultMedalInterval,
			customMedalStartDate,
		},
		isLoadingGetUserSettings
	};
};
