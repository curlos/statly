import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import BackupData from "../../SidebarModal/OtherSection/BackupData";
import ImportData from "../../SidebarModal/OtherSection/ImportData";
import UpdateArchivedProjects from "../../SidebarModal/OtherSection/UpdateArchivedProjects";
import DeleteDataSection from "./DeleteDataSection";
import CheckboxOther from "../../FilterSidebar/CheckboxOther";
import { useGetUserSettingsQuery, useEditUserSettingsMutation } from '../../../services/resources/userSettingsApi';

const ManageDataSection = () => {
	const [activeTab, setActiveTab] = useState<'data-operations' | 'delete-data'>('data-operations');
	const { chosenColorObj } = useThemeContext();
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleAutoSyncToggle = async () => {
		const newValue = !userSettings?.autoSyncEnabled;
		const payload = {
			autoSyncEnabled: newValue,
		};
		await editUserSettings(payload).unwrap();
	};

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-bold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-25 bg-color-gray-300`;

	return (
		<div>
			{/* Tabs */}
			<div role="tablist" aria-label="Manage data sections" className="flex justify-center gap-2 mb-6">
				<button
					role="tab"
					id="manage-data-operations-tab"
					aria-selected={activeTab === 'data-operations'}
					aria-controls="manage-data-tab-panel"
					className={activeTab === 'data-operations' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('data-operations')}
				>
					Data Operations
				</button>
				<button
					role="tab"
					id="manage-delete-data-tab"
					aria-selected={activeTab === 'delete-data'}
					aria-controls="manage-data-tab-panel"
					className={activeTab === 'delete-data' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('delete-data')}
				>
					Delete Data
				</button>
			</div>

			{/* Tab Content */}
			<div
				id="manage-data-tab-panel"
				role="tabpanel"
				aria-labelledby={activeTab === 'data-operations' ? 'manage-data-operations-tab' : 'manage-delete-data-tab'}
			>
				{activeTab === 'data-operations' && (
					<div>
						<div className="mb-6">
							<CheckboxOther
								name="Auto Sync Focus Records, Tasks, Projects, and Project Groups"
								showValue={userSettings?.autoSyncEnabled || false}
								handleCheckboxClick={handleAutoSyncToggle}
							/>
						</div>
						<UpdateArchivedProjects />
						<BackupData />
						<ImportData />
					</div>
				)}
				{activeTab === 'delete-data' && <DeleteDataSection />}
			</div>
		</div>
	);
};

export default ManageDataSection;
