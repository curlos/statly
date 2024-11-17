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
	const {
		showCompletedTasks = true,
		showFocusNotes = true,
		showTotalFocusDuration = true,
		filterOutUnrelatedTasksWhenTaskIdIsApplied = true,
		maxFocusRecordsPerPage = 50,
	} = focusRecordsPageSettings;

	return {
		showCompletedTasks,
		showFocusNotes,
		showTotalFocusDuration,
		maxFocusRecordsPerPage,
		filterOutUnrelatedTasksWhenTaskIdIsApplied,
	};
};
