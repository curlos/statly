import { createContext, useContext, useEffect, useState } from 'react';
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
	// Initialize cached settings from localStorage
	const [cachedSettings, setCachedSettings] = useState(() => {
		const defaultSettings = { goalDays: 7, goalSeconds: 3600, showGoalDays: true };
		try {
			const cached = localStorage.getItem('focusHoursGoalPageSettings');
			return cached ? JSON.parse(cached) : defaultSettings;
		} catch (error) {
			console.error('Failed to load cached settings:', error);
			return defaultSettings;
		}
	});

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

	// Use cached values if API is still loading
	const settingsSource = isLoadingGetUserSettings && cachedSettings
		? cachedSettings
		: focusHoursGoalPageSettings;

	const {
		projects: filteredProjects = {},
		showStreakCount = true,
		goalDays = 7,
		goalSeconds = 3600,
		showGoalDays = true,
		selectedDaysOfWeek = {
			monday: true,
			tuesday: true,
			wednesday: true,
			thursday: true,
			friday: true,
			saturday: true,
			sunday: true,
		},
	} = settingsSource;

	const { selectedChallengeCardImage } = challengesPageSettings;
	const { selectedMedalCardImage, defaultMedalInterval = 'All', customMedalStartDate = '' } = medalsPageSettings;

	// Sync to localStorage after API fetch completes
	useEffect(() => {
		if (!isLoadingGetUserSettings && focusHoursGoalPageSettings) {
			try {
				const settingsToCache = {
					goalDays,
					goalSeconds,
					showGoalDays,
					showStreakCount
				};
				localStorage.setItem('focusHoursGoalPageSettings', JSON.stringify(settingsToCache));
				setCachedSettings(settingsToCache);
			} catch (error) {
				console.error('Failed to cache settings:', error);
			}
		}
	}, [isLoadingGetUserSettings, goalDays, goalSeconds, showGoalDays, focusHoursGoalPageSettings]);

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

		// Update localStorage for focusHoursGoal page settings
		if (page === 'focusHoursGoal' && ['goalDays', 'goalSeconds', 'showGoalDays', 'showStreakCount'].includes(userSettingProperty)) {
			try {
				const currentCache = JSON.parse(localStorage.getItem('focusHoursGoalPageSettings') || '{}');
				const updatedCache = { ...currentCache, [userSettingProperty]: newValue };
				localStorage.setItem('focusHoursGoalPageSettings', JSON.stringify(updatedCache));
			} catch (error) {
				console.error('Failed to update cached settings:', error);
			}
		}
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
			selectedDaysOfWeek,
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
