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
	// Initialize cached settings from localStorage with rings array
	const [cachedSettings, setCachedSettings] = useState(() => {
		const defaultSettings = { rings: [], selectedRingId: null };
		try {
			const cached = localStorage.getItem('focusHoursGoalPageSettings');
			return cached ? JSON.parse(cached) : defaultSettings;
		} catch (error) {
			console.error('Failed to load cached settings:', error);
			return defaultSettings;
		}
	});

	// Selected ring state
	const [selectedRingId, setSelectedRingId] = useState(cachedSettings.selectedRingId);

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const focusRecordsPageSettings = userSettings?.pages?.focusRecords || {};
	const completedTasksPageSettings = userSettings?.pages?.completedTasks || {};
	const focusHoursGoalPageSettings = userSettings?.pages?.focusHoursGoal || {};
	const challengesPageSettings = userSettings?.pages?.challenges || {};
	const medalsPageSettings = userSettings?.pages?.medals || {};

	// Extract rings from focusHoursGoal settings - use cached rings while loading
	const rings = isLoadingGetUserSettings && cachedSettings?.rings?.length > 0
		? cachedSettings.rings
		: (focusHoursGoalPageSettings?.rings || []);
	const activeRings = rings.filter(ring => ring.isActive);

	// Auto-select first active ring if no selection yet
	const effectiveSelectedRingId = selectedRingId || (activeRings[0]?.id || null);

	// Find current ring by selectedRingId
	const currentRing = rings.find(ring => ring.id === effectiveSelectedRingId) || null;

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

	const { showMultiRingViewForOneActiveRing = false } = focusHoursGoalPageSettings;

	const { selectedChallengeCardImage } = challengesPageSettings;
	const { selectedMedalCardImage, defaultMedalInterval = 'All', customMedalStartDate = '' } = medalsPageSettings;

	// Sync rings array to localStorage after API fetch completes
	useEffect(() => {
		if (!isLoadingGetUserSettings && focusHoursGoalPageSettings?.rings) {
			try {
				const settingsToCache = {
					rings: focusHoursGoalPageSettings.rings,
					selectedRingId: effectiveSelectedRingId
				};
				localStorage.setItem('focusHoursGoalPageSettings', JSON.stringify(settingsToCache));
				setCachedSettings(settingsToCache);
			} catch (error) {
				console.error('Failed to cache settings:', error);
			}
		}
	}, [isLoadingGetUserSettings, focusHoursGoalPageSettings?.rings, effectiveSelectedRingId, focusHoursGoalPageSettings]);

	// Helper function to switch selected ring
	const handleSetSelectedRing = (ringId) => {
		setSelectedRingId(ringId);
		try {
			const currentCache = JSON.parse(localStorage.getItem('focusHoursGoalPageSettings') || '{}');
			const updatedCache = { ...currentCache, selectedRingId: ringId };
			localStorage.setItem('focusHoursGoalPageSettings', JSON.stringify(updatedCache));
		} catch (error) {
			console.error('Failed to update selected ring in cache:', error);
		}
	};

	const [editUserSettings] = useEditUserSettingsMutation();

	const handleUpdateUserSettingForPage = async (page, userSettingProperty, newValue) => {
		const restOfPageKeysAndVals = userSettings?.pages[page];
		const restOfPagesKeysAndVals = userSettings?.pages;

		const payload = {
			pages: {
				...restOfPagesKeysAndVals,
				[page]: {
					...restOfPageKeysAndVals,
					[userSettingProperty]: newValue,
				},
			},
		};

		await editUserSettings(payload);
	};

	// Helper function to update ring-specific settings
	const handleUpdateRingSetting = async (ringId, settingProperty, newValue) => {
		const restOfPagesKeysAndVals = userSettings?.pages;
		const existingRings = focusHoursGoalPageSettings?.rings || [];

		// Find and update the specific ring
		const updatedRings = existingRings.map(ring => {
			if (ring.id === ringId) {
				return {
					...ring,
					[settingProperty]: newValue,
					updatedAt: new Date().toISOString()
				};
			}
			return ring;
		});

		const payload = {
			pages: {
				...restOfPagesKeysAndVals,
				focusHoursGoal: {
					...focusHoursGoalPageSettings,
					rings: updatedRings,
				},
			},
		};

		await editUserSettings(payload);

		// Update localStorage cache with updated rings array
		try {
			const currentCache = JSON.parse(localStorage.getItem('focusHoursGoalPageSettings') || '{}');
			const updatedCache = {
				...currentCache,
				rings: updatedRings
			};
			localStorage.setItem('focusHoursGoalPageSettings', JSON.stringify(updatedCache));
			setCachedSettings(updatedCache);
		} catch (error) {
			console.error('Failed to update cached settings:', error);
		}
	};

	return {
		handleUpdateUserSettingForPage,
		handleUpdateRingSetting,
		handleSetSelectedRing,
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
			rings,
			activeRings,
			currentRing,
			selectedRingId: effectiveSelectedRingId,
			showMultiRingViewForOneActiveRing,
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
