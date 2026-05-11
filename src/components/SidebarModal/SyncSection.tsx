import Icon from '../Icon';
import { useGetSyncMetadataQuery } from '../../services/resources/syncApi';
import { intlFormatDistance } from 'date-fns';
import SyncButton from '../SyncButton';
import { useSyncStatusHelpers } from '../../hooks/useSyncStatusHelpers';
import Accordion from '../Accordion/Accordion';
import CookieInstructions from './CookieInstructions';
import CookieSection from './CookieSection';
import { useThemeContext } from '../../contexts/useThemeContext';
import Tooltip from '../Tooltip';

interface SyncMetadata {
	lastSyncTime: string;
	tasksUpdated?: number;
}

interface SyncMetadataByType {
	tickTickTasks?: SyncMetadata;
	tickTickProjects?: SyncMetadata;
	tickTickProjectGroups?: SyncMetadata;
	tickTickFocusRecords?: SyncMetadata;
}

interface SyncItemProps {
	label: string;
	syncKey: 'projects' | 'projectGroups' | 'tasks' | 'focusRecords';
	metadata?: SyncMetadata;
}

const SyncItem = ({ label, syncKey, metadata }: SyncItemProps) => {
	const { getStatusIcon } = useSyncStatusHelpers();
	const statusIcon = getStatusIcon(syncKey);

	const formatLastSyncTime = (lastSyncTime: string | undefined) => {
		if (!lastSyncTime) return 'Never';
		return intlFormatDistance(new Date(lastSyncTime), new Date());
	};

	return (
		<div className="flex items-center justify-between gap-2">
			<div className="font-semibold">{label}</div>
			<div className="flex items-center gap-2 text-color-gray-50">
				<span>{formatLastSyncTime(metadata?.lastSyncTime)}</span>
				{statusIcon && (
					<span role="img" aria-label={statusIcon.text} style={{ color: statusIcon.color }}>
						<Icon
							name={statusIcon.name}
							fill={1}
							customClass={`!text-[20px] mt-[5px] mb-[-5px] ${statusIcon.spin ? 'animate-spin' : ''}`}
							aria-hidden={true}
						/>
					</span>
				)}
			</div>
		</div>
	);
};

const SyncSection = () => {
	const { data: syncMetadata } = useGetSyncMetadataQuery(undefined);
	const syncMetadataByType = syncMetadata as SyncMetadataByType;
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	return (
		<div>
			<div className="flex items-center gap-2 mb-3">
				<h2 className="text-[20px] font-bold">Sync TickTick Data</h2>
				<Icon name="sync" fill={1} customClass={`${chosenColorObj.textColor} !text-[20px]`} />
				<Tooltip
					content="Uses your TickTick cookie to sync your Focus Records, Tasks, Projects, and Project Groups to Statly."
					position="top"
					className="!w-[200px]"
				>
					<Icon
						name="help_outline"
						fill={0}
						customClass="!text-[18px] ml-[-2px] mt-[7px] text-color-gray-50 hover:text-white cursor-help"
						aria-hidden={true}
					/>
				</Tooltip>
			</div>

			<div className="space-y-2">
				<SyncItem label="Focus Records" syncKey="focusRecords" metadata={syncMetadataByType?.tickTickFocusRecords} />
				<SyncItem label="Tasks" syncKey="tasks" metadata={syncMetadataByType?.tickTickTasks} />
				<SyncItem label="Projects" syncKey="projects" metadata={syncMetadataByType?.tickTickProjects} />
				<SyncItem label="Project Groups" syncKey="projectGroups" metadata={syncMetadataByType?.tickTickProjectGroups} />

				<SyncButton
					showText={true}
					customClass="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>

			{/* Cookie Input Section */}
			<CookieSection />

			<div className="mt-4">
				<Accordion
					title={
						<div className="flex items-center gap-2">
							<Icon name="help" fill={1} customClass="!text-[18px] text-color-gray-100" />
							<h3 className="text-[14px] font-semibold">How to Get Your TickTick Cookie</h3>
						</div>
					}
					openByDefault={false}
					setIsOpenForParent={undefined}
					isChildDropdownOpen={true}
					showArrowNextToText={undefined}
					customClasses={undefined}
					customToggleOpen={undefined}
					preventOpen={false}
				>
					<div className="mt-3">
						<CookieInstructions />
					</div>
				</Accordion>
			</div>
		</div>
	);
};

export default SyncSection;
