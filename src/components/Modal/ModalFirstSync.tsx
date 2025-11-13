import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import Icon from '../Icon';
import { setShowFirstSyncModal, selectShowFirstSyncModal, selectIsSyncing } from '../../slices/syncSlice';
import { useThemeContext } from '../../contexts/useThemeContext';

const ModalFirstSync = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector(selectShowFirstSyncModal);
	const isSyncing = useSelector(selectIsSyncing);
	const themeContext = useThemeContext() as any;
	const chosenColorObj = themeContext?.chosenColorObj;
	const themeColor = chosenColorObj?.hex || '#3b82f6'; // Default to blue-500 if no theme

	const handleClose = () => {
		// Only allow closing when sync is complete
		if (!isSyncing) {
			dispatch(setShowFirstSyncModal(false));
		}
	};

	const syncCategories = [
		{ label: 'Tasks', icon: 'task_alt' },
		{ label: 'Projects', icon: 'folder' },
		{ label: 'Project Groups', icon: 'folder_open' },
		{ label: 'Focus Records', icon: 'timer' },
	];

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<div className="bg-color-gray-650 rounded-lg p-6 shadow-xl relative">
				{/* Close button - only show when sync is complete */}
				{!isSyncing && (
					<button
						onClick={handleClose}
						className="absolute top-4 right-4 text-color-gray-100 hover:text-white transition-colors"
					>
						<Icon name="close" fill={1} customClass="!text-[24px]" />
					</button>
				)}

				<div className="flex flex-col items-center text-center space-y-4">
					{/* Icon */}
					<div className="relative" style={{ color: isSyncing ? themeColor : '#4ade80' }}>
						<Icon
							name={isSyncing ? "sync" : "check_circle"}
							fill={1}
							customClass={`!text-[64px] ${isSyncing ? 'animate-spin' : ''}`}
						/>
					</div>

					{/* Title */}
					<h2 className="text-2xl font-bold text-white">
						{isSyncing ? 'First Time Sync in Progress' : 'Sync Complete!'}
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
						) : (
							<>
								<p className="text-lg">
									Your data has been successfully synced!
								</p>
								<p className="text-sm">
									You can now view all your tasks, projects, and focus records.
								</p>
								<p className="text-xs text-color-gray-200">
									This modal will close automatically in 2 seconds.
								</p>
							</>
						)}
					</div>

					{/* Sync Categories Status */}
					{isSyncing && (
						<div className="w-full space-y-2 bg-color-gray-700 rounded p-4">
							<p className="font-semibold text-white text-left mb-3">Syncing Data:</p>
							{syncCategories.map((category) => (
								<div key={category.label} className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<Icon name={category.icon} fill={1} customClass="!text-[18px] text-color-gray-100" />
										<span className="text-color-gray-100">{category.label}</span>
									</div>
									<div className="flex items-center gap-2" style={{ color: themeColor }}>
										<Icon
											name="sync"
											fill={1}
											customClass="!text-[16px] animate-spin"
										/>
										<span className="text-xs font-medium">Syncing...</span>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Completed Categories Status */}
					{!isSyncing && (
						<div className="w-full space-y-2 bg-color-gray-700 rounded p-4">
							<p className="font-semibold text-white text-left mb-3">Synced Data:</p>
							{syncCategories.map((category) => (
								<div key={category.label} className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<Icon name={category.icon} fill={1} customClass="!text-[18px] text-color-gray-100" />
										<span className="text-color-gray-100">{category.label}</span>
									</div>
									<div className="flex items-center gap-2 text-green-400">
										<Icon
											name="check_circle"
											fill={1}
											customClass="!text-[16px]"
										/>
										<span className="text-xs font-medium">Complete</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default ModalFirstSync;
