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

	useEffect(() => {
		if (isLoadingGetUserSettings) {
			return;
		}

		const newShowCompletedTasks = userSettings?.tickTickOne?.pages?.focusRecords?.showCompletedTasks;
		const newShowTotalFocusDuration = userSettings?.tickTickOne?.pages?.focusRecords?.showTotalFocusDuration;

		if (newShowCompletedTasks !== undefined) {
			setShowCompletedTasks(newShowCompletedTasks);
		}

		if (newShowTotalFocusDuration !== undefined) {
			setShowTotalFocusDuration(newShowTotalFocusDuration);
		}
	}, [userSettings]);

	return {
		showCompletedTasks,
		setShowCompletedTasks,
		showFocusNotes,
		setShowFocusNotes,
		showTotalFocusDuration,
		setShowTotalFocusDuration,
	};
};
