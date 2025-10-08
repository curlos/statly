import Icon from '../../Icon';
// import BackupData from './BackupData';
import UpdateArchivedProjects from './UpdateArchivedProjects';

const OtherSection = () => {
	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<h3 className="text-[20px] font-bold">Other</h3>
				<Icon name="other_admission" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<UpdateArchivedProjects />
			{/* TODO: Bring back later. */}
			{/* <BackupData /> */}
		</div>
	);
};

export default OtherSection;
