import BackupData from "../../SidebarModal/OtherSection/BackupData";
import ImportData from "../../SidebarModal/OtherSection/ImportData";
import UpdateArchivedProjects from "../../SidebarModal/OtherSection/UpdateArchivedProjects";

const ManageDataSection = () => {
	return (
		<div>
			<UpdateArchivedProjects />
			<BackupData />
			<ImportData />
		</div>
	);
};

export default ManageDataSection;
