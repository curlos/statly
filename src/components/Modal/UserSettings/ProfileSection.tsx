import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { handleLogout } from '../../../utils/logout.utils';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useGetOverviewStatsQuery } from '../../../services/resources/statsApi';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';

interface ProfileSectionProps {
	onClose: () => void;
	onEditProfile: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onClose, onEditProfile }) => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const { chosenColorObj } = useThemeContext();

	// Fetch overview stats for total counts (skip today stats and include first data)
	const { data: overviewStats } = useGetOverviewStatsQuery({
		skipTodayStats: true,
		includeFirstData: true
	});

	const onLogout = () => {
		onClose();
		handleLogout(dispatch);
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const themeColor = chosenColorObj?.hexColor || '#3b82f6';
	const profilePicUrl = user?.profilePic || null;

	if (!user) {
		return null;
	}

	return (
		<div className="flex flex-col items-center">
			{/* User Profile Section */}
			{profilePicUrl ? (
				<img
					src={profilePicUrl}
					alt={user.name}
					className="w-24 h-24 rounded-full object-cover mb-4"
				/>
			) : (
				<div
					className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4"
					style={{ backgroundColor: themeColor }}
				>
					{getInitials(user.name)}
				</div>
			)}
			<h2 className="text-2xl font-bold mb-1">{user.name}</h2>
			<p className="text-color-gray-50 mt-0 mb-0">{user.email}</p>

			{/* Join Date */}
			{user.createdAt && (
				<p className="text-color-gray-50 mb-0 mt-0">
					Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					})}
				</p>
			)}

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-3 my-6 max-w-md">
				<div className="text-center">
					<div className="font-bold text-2xl" style={{ color: themeColor }}>
						{(overviewStats?.totalFocusRecordCount ?? 0).toLocaleString()}
					</div>
					<div className="text-color-gray-50">Focus Records</div>
				</div>
				<div className="text-center">
					<div className="font-bold text-2xl" style={{ color: themeColor }}>
						{(getFormattedDuration(overviewStats?.totalFocusDuration || 0, false))}
					</div>
					<div className="text-color-gray-50">Focus Time</div>
				</div>
				<div className="text-center">
					<div className="font-bold text-2xl" style={{ color: themeColor }}>
						{(overviewStats?.totalCompletedTasksCount ?? 0).toLocaleString()}
					</div>
					<div className="text-color-gray-50">Completed Tasks</div>
				</div>
				<div className="text-center">
					<div className="font-bold text-2xl" style={{ color: themeColor }}>
						{(overviewStats?.totalProjectsCount ?? 0).toLocaleString()}
					</div>
					<div className="text-color-gray-50">Projects</div>
				</div>
			</div>

			{/* First Data Section */}
			{(overviewStats?.firstCompletedTaskDate || overviewStats?.firstFocusRecordDate) && (
				<div className="mb-10 text-color-gray-50 text-center">
					{overviewStats.firstFocusRecordDate && (
						<p className="mt-0">
							<span className="font-bold">1st Focus Record: </span>{' '}
							{new Date(overviewStats.firstFocusRecordDate).toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric'
							})}
						</p>
					)}
					{overviewStats.firstCompletedTaskDate && (
						<p className="mt-0">
							<span className="font-bold">1st Completed Task:</span>{' '}
							{new Date(overviewStats.firstCompletedTaskDate).toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric'
							})}
						</p>
					)}
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex justify-center items-center gap-3 w-full">
				<button
					className="flex-1 px-4 py-2 bg-color-gray-600 hover:bg-color-gray-200 rounded-full max-w-[200px]"
					onClick={onEditProfile}
				>
					Edit Profile
				</button>
				<button
					className="flex-1 px-4 py-2 bg-color-gray-600 hover:bg-color-gray-200 rounded-full max-w-[200px]"
					onClick={onLogout}
				>
					Log Out
				</button>
			</div>
		</div>
	);
};

export default ProfileSection;
