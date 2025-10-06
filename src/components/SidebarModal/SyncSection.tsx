import Icon from '../Icon';
import { useGetSyncMetadataQuery } from '../../services/resources/documentsSyncApi';
import { formatDistanceToNow } from 'date-fns';
import SyncButton from '../SyncButton';

interface SyncMetadata {
	lastSyncTime: string;
	tasksUpdated?: number;
}

const SyncSection = () => {
	const { data: syncMetadata } = useGetSyncMetadataQuery(undefined);

	const formatLastSyncTime = (lastSyncTime: string) => {
		if (!lastSyncTime) return 'Never';
		return formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true });
	};

	return (
		<div>
			<div className="flex items-center gap-2 mb-3">
				<h3 className="text-[20px] font-bold">Sync</h3>
				<Icon name="sync" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<div className="font-semibold">Tasks</div>
					{syncMetadata ? (
						<div className="text-sm text-color-gray-100">
							Last sync: {formatLastSyncTime((syncMetadata as SyncMetadata).lastSyncTime)}
						</div>
					) : (
						<div className="text-sm text-color-gray-100">No sync data available</div>
					)}
				</div>

				<SyncButton
					showText={true}
					customClass="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>
		</div>
	);
};

export default SyncSection;
