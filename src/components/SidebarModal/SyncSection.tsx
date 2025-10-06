import Icon from '../Icon';
import { useGetSyncMetadataQuery } from '../../services/resources/documentsSyncApi';
import { formatDistanceToNow } from 'date-fns';
import SyncButton from '../SyncButton';

interface SyncMetadata {
	lastSyncTime: string;
	tasksUpdated?: number;
}

interface SyncMetadataByType {
	tasks?: SyncMetadata;
	projects?: SyncMetadata;
	project_groups?: SyncMetadata;
}

interface SyncItemProps {
	label: string;
	metadata?: SyncMetadata;
}

const SyncItem = ({ label, metadata }: SyncItemProps) => {
	const formatLastSyncTime = (lastSyncTime: string) => {
		if (!lastSyncTime) return 'Never';
		return formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true });
	};

	return (
		<div className="flex items-center gap-2">
			<div className="font-semibold">{label}</div>
			{metadata ? (
				<div className="text-sm text-color-gray-100">
					Last sync: {formatLastSyncTime(metadata.lastSyncTime)}
				</div>
			) : (
				<div className="text-sm text-color-gray-100">No sync data available</div>
			)}
		</div>
	);
};

const SyncSection = () => {
	const { data: syncMetadata } = useGetSyncMetadataQuery(undefined);
	const syncMetadataByType = syncMetadata as SyncMetadataByType;

	return (
		<div>
			<div className="flex items-center gap-2 mb-3">
				<h3 className="text-[20px] font-bold">Sync</h3>
				<Icon name="sync" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<div className="space-y-2">
				<SyncItem label="Tasks" metadata={syncMetadataByType?.tasks} />
				<SyncItem label="Projects" metadata={syncMetadataByType?.projects} />
				<SyncItem label="Project Groups" metadata={syncMetadataByType?.project_groups} />

				<SyncButton
					showText={true}
					customClass="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>
		</div>
	);
};

export default SyncSection;
