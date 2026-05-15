import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import Icon from '../Icon';
import { setShowFirstSyncModal, selectShowFirstSyncModal, selectIsSyncing, selectSyncStatus } from '../../slices/syncSlice';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useSyncStatusHelpers } from '../../hooks/useSyncStatusHelpers';

const ModalFirstSync = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector(selectShowFirstSyncModal);
	const isSyncing = useSelector(selectIsSyncing);
	const syncStatus = useSelector(selectSyncStatus);
	const { getStatusIcon } = useSyncStatusHelpers();
	const themeContext = useThemeContext();
	const chosenColorObj = themeContext?.chosenColorObj;
	const themeColor = chosenColorObj?.hexColor || '#3b82f6'; // Default to blue-500 if no theme

	// Check if any sync failed
	const hasError = Object.values(syncStatus).some((status) => status === 'error');

	const handleClose = () => {
		dispatch(setShowFirstSyncModal(false));
	};

	const syncCategories = [
		{ label: 'Projects', icon: 'folder', key: 'projects' as const },
		{ label: 'Project Groups', icon: 'folder_open', key: 'projectGroups' as const },
		{ label: 'Tasks', icon: 'task_alt', key: 'tasks' as const },
		{ label: 'Focus Records', icon: 'timer', key: 'focusRecords' as const },
	];

	return (
		<Modal isOpen={isOpen} onClose={handleClose} ariaLabelledBy="first-sync-title">
			<div className="bg-color-gray-650 rounded-lg p-6 shadow-xl relative">
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 text-color-gray-100 hover:text-white transition-colors"
				>
					<Icon name="close" fill={1} customClass="!text-[24px]" />
				</button>

				<div className="flex flex-col items-center text-center space-y-4">
					{/* Icon */}
					<div className="relative" style={{ color: isSyncing ? themeColor : (hasError ? '#ef4444' : '#4ade80') }}>
						<Icon
							name={isSyncing ? "sync" : (hasError ? "error" : "check_circle")}
							fill={1}
							customClass={`!text-[64px] ${isSyncing ? 'animate-spin' : ''}`}
						/>
					</div>

					{/* Title */}
					<h2 id="first-sync-title" className="text-2xl font-bold text-white">
						{isSyncing ? 'First Time Sync in Progress' : (hasError ? 'Sync Failed' : 'Sync Complete!')}
					</h2>

					{/* Message */}
					<div className="space-y-3 text-color-gray-100">
						{isSyncing ? (
							<>
								<p>
									We're syncing your data for the first time. This may take a bit longer as we're
									gathering all your information from TickTick.
								</p>
								<p className="font-bold">
									Future syncs will be much faster as we'll only fetch what's changed.
								</p>
							</>
						) : hasError ? (
							<>
								<p className="text-lg text-red-400 mt-0">
									One or more syncs failed.
								</p>
								<p className="mt-0">
									Please check your TickTick cookie and try again. Some data may not be available.
								</p>
							</>
						) : (
							<>
								<p className="text-lg">
									Your data has been successfully synced!
								</p>
								<p>
									You can now view all your tasks, projects, and focus records.
								</p>
								<p className="text-color-gray-100">
									This modal will close automatically in 2 seconds.
								</p>
							</>
						)}
					</div>

					{/* Sync Categories Status */}
					<div className="w-full space-y-2 bg-color-gray-700 rounded p-4">
						<p className="font-semibold text-white text-left mb-3">
							{isSyncing ? 'Syncing Data:' : 'Synced Data:'}
						</p>
						{syncCategories.map((category) => {
							const statusInfo = getStatusIcon(category.key);
							// For idle state, show "Waiting..." text
							const displayInfo = statusInfo || { name: 'schedule', color: '#9ca3af', text: 'Waiting...', spin: false };
							return (
								<div key={category.label} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Icon name={category.icon} fill={1} customClass="!text-[18px] text-color-gray-100" />
										<span className="text-color-gray-100">{category.label}</span>
									</div>
									<div className="flex items-center gap-2" style={{ color: displayInfo.color }}>
										<Icon
											name={displayInfo.name}
											fill={1}
											customClass={`!text-[16px] ${displayInfo.spin ? 'animate-spin' : ''}`}
										/>
										<span className="text-xs font-medium">{displayInfo.text}</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalFirstSync;
