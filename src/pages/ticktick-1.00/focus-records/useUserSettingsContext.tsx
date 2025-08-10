import { createContext, useContext } from 'react';
import { useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';

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
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
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
		showMedals: showMedalsFocusRecordsPage = false,
		selectedMedalImage: selectedMedalImageFocusRecordsPage = 'https://i.imgur.com/SQOm6nX.png',
	} = focusRecordsPageSettings;

	const {
		taskIdIncludeCompletedTasksFromSubtasks = true,
		filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage = true,
		groupedTasksCollapsedByDefault = true,
		showIndentedTasks = true,
		onlyExportTasksWithNoParent: onlyExportTasksWithNoParentCompletedTasksPage = true,
		maxDaysPerPage = 7,
		showMedals: showMedalsCompletedTasksPage = false,
		selectedMedalImage: selectedMedalImageCompletedTasksPage = 'https://i.imgur.com/SQOm6nX.png',
	} = completedTasksPageSettings;

	const { projects: filteredProjects = {} } = focusHoursGoalPageSettings;

	const { selectedChallengeCardImage } = challengesPageSettings;
	const { selectedMedalCardImage } = medalsPageSettings;

	return {
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
			showMedals: showMedalsFocusRecordsPage,
			selectedMedalImage: selectedMedalImageFocusRecordsPage,
		},
		completedTasksPageSettings: {
			taskIdIncludeCompletedTasksFromSubtasks,
			filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage,
			groupedTasksCollapsedByDefault,
			showIndentedTasks,
			onlyExportTasksWithNoParent: onlyExportTasksWithNoParentCompletedTasksPage,
			maxDaysPerPage,
			showMedals: showMedalsCompletedTasksPage,
			selectedMedalImage: selectedMedalImageCompletedTasksPage,
		},
		focusHoursGoalPageSettings: {
			filteredProjects,
		},
		challengesPageSettings: {
			selectedChallengeCardImage,
		},
		medalsPageSettings: {
			selectedMedalCardImage,
		},
	};
};
