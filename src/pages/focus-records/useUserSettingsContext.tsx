import { createContext, useContext } from 'react';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import useHandleError from '../../hooks/useHandleError';

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
		showMedals = false,
		selectedMedalImage = 'https://i.imgur.com/SQOm6nX.png',
		medalImageSizePx = 100,
	} = focusRecordsPageSettings;

	const {
		taskIdIncludeCompletedTasksFromSubtasks = true,
		filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage = true,
		groupedTasksCollapsedByDefault = true,
		showIndentedTasks = true,
		onlyExportTasksWithNoParent: onlyExportTasksWithNoParentCompletedTasksPage = true,
		maxDaysPerPage = 7,
	} = completedTasksPageSettings;

	const { projects: filteredProjects = {} } = focusHoursGoalPageSettings;

	const { selectedChallengeCardImage } = challengesPageSettings;
	const { selectedMedalCardImage } = medalsPageSettings;

	const handleError = useHandleError();
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleUpdateUserSettingForPage = (page, userSettingProperty, newValue) => {
		const restOfPageKeysAndVals = userSettings?.tickTickOne?.pages[page];
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

		handleError(async () => {
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

			await editUserSettings(payload).unwrap();
		});
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
		},
		challengesPageSettings: {
			selectedChallengeCardImage,
		},
		medalsPageSettings: {
			selectedMedalCardImage,
		},
	};
};
