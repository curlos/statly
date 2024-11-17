import { createContext, useContext, useEffect, useState } from 'react';
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
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [showCompletedTasks, setShowCompletedTasks] = useState(true);
	const [showFocusNotes, setShowFocusNotes] = useState(true);
	const [showTotalFocusDuration, setShowTotalFocusDuration] = useState(true);
	const [maxFocusRecordsPerPage, setMaxFocusRecordsPerPage] = useState(50);
	const [filterOutUnrelatedTasksWhenTaskIdIsApplied, setFilterOutUnrelatedTasksWhenTaskIdIsApplied] = useState(true);

	useEffect(() => {
		if (isLoadingGetUserSettings) {
			return;
		}

		const focusRecordsPageSettings = userSettings?.tickTickOne?.pages?.focusRecords;

		if (!focusRecordsPageSettings) {
			return;
		}

		const {
			showCompletedTasks,
			showFocusNotes,
			showTotalFocusDuration,
			maxFocusRecordsPerPage,
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
		} = focusRecordsPageSettings;

		if (showCompletedTasks !== undefined) {
			setShowCompletedTasks(showCompletedTasks);
		}

		if (showFocusNotes !== undefined) {
			setShowFocusNotes(showFocusNotes);
		}

		if (showTotalFocusDuration !== undefined) {
			setShowTotalFocusDuration(showTotalFocusDuration);
		}

		if (maxFocusRecordsPerPage !== undefined) {
			setMaxFocusRecordsPerPage(maxFocusRecordsPerPage);
		}

		if (filterOutUnrelatedTasksWhenTaskIdIsApplied !== undefined) {
			setFilterOutUnrelatedTasksWhenTaskIdIsApplied(filterOutUnrelatedTasksWhenTaskIdIsApplied);
		}
	}, [userSettings]);

	return {
		showCompletedTasks,
		setShowCompletedTasks,
		showFocusNotes,
		setShowFocusNotes,
		showTotalFocusDuration,
		setShowTotalFocusDuration,
		maxFocusRecordsPerPage,
		setMaxFocusRecordsPerPage,
		filterOutUnrelatedTasksWhenTaskIdIsApplied,
		setFilterOutUnrelatedTasksWhenTaskIdIsApplied,
	};
};
