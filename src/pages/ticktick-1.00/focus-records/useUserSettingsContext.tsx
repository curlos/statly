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

	const {
		showCompletedTasks = true,
		showFocusNotes = true,
		showTotalFocusDuration = true,
		filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedFocusRecordsPage = true,
		maxFocusRecordsPerPage = 50,
	} = focusRecordsPageSettings;

	const {
		filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage = true,
	} = completedTasksPageSettings;

	return {
		focusRecordsPageSettings: {
			showCompletedTasks,
			showFocusNotes,
			showTotalFocusDuration,
			filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedFocusRecordsPage,
			maxFocusRecordsPerPage,
		},
		completedTasksPageSettings: {
			filterOutUnrelatedTasksWhenTaskIdIsApplied: filterOutUnrelatedTasksWhenTaskIdIsAppliedCompletedTasksPage,
		},
	};
};
