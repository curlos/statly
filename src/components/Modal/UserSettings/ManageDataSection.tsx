import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import BackupData from "../../SidebarModal/OtherSection/BackupData";
import ImportData from "../../SidebarModal/OtherSection/ImportData";
import UpdateArchivedProjects from "../../SidebarModal/OtherSection/UpdateArchivedProjects";
import DeleteDataSection from "./DeleteDataSection";

const ManageDataSection = () => {
	const [activeTab, setActiveTab] = useState<'data-operations' | 'delete-data'>('data-operations');
	const { chosenColorObj } = useThemeContext();
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-bold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div>
			{/* Tabs */}
			<div className="flex justify-center gap-2 mb-6">
				<div
					className={activeTab === 'data-operations' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('data-operations')}
				>
					Data Operations
				</div>
				<div
					className={activeTab === 'delete-data' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('delete-data')}
				>
					Delete Data
				</div>
			</div>

			{/* Tab Content */}
			<div>
				{activeTab === 'data-operations' && (
					<div>
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
