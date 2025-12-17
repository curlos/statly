import { useSelector } from 'react-redux';
import { selectSyncStatus } from '../slices/syncSlice';
import { useThemeContext } from '../contexts/useThemeContext';

export const useSyncStatusHelpers = () => {
	const syncStatus = useSelector(selectSyncStatus);
	const themeContext = useThemeContext();
	const themeColor = themeContext?.chosenColorObj?.hexColor || '#3b82f6';

	const getStatusIcon = (key: 'projects' | 'projectGroups' | 'tasks' | 'focusRecords') => {
		const status = syncStatus[key];
		if (status === 'success') {
			return { name: 'check_circle', color: '#4ade80', text: 'Complete', spin: false };
		} else if (status === 'loading') {
			return { name: 'sync', color: themeColor, text: 'Syncing...', spin: true };
		} else if (status === 'error') {
			return { name: 'error', color: '#ef4444', text: 'Error', spin: false };
		}

		return { name: 'mode_standby', color: themeColor, text: 'Idle', spin: false }
	};

	return { getStatusIcon };
};
