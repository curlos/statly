import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../slices/userSlice';
import { handleLogout } from '../../utils/logout.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import Icon from '../Icon';
import Dropdown from '../Dropdown/Dropdown';
import ModalUserSettings from '../Modal/ModalUserSettings';

const UserProfileSection = () => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const { chosenColorObj } = useThemeContext();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
	const toggleRef = useRef<HTMLDivElement>(null);

	if (!user) {
		return null;
	}

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const onLogout = () => {
		setIsDropdownOpen(false);
		handleLogout(dispatch);
	};

	const handleSettingsClick = () => {
		setIsUserSettingsOpen(true);
		setIsDropdownOpen(false);
	};

	const profilePicUrl = user.profilePic || null;
	const themeColor = chosenColorObj?.hexColor || '#3b82f6';

	return (
		<div className="relative">
			<div
				ref={toggleRef}
				className="flex items-center gap-3 p-3 hover:bg-color-gray-600 cursor-pointer rounded-full"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{profilePicUrl ? (
					<img src={profilePicUrl} alt={user.name} className="w-[60px] h-[60px] rounded-full object-cover" />
				) : (
					<div
						className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-bold text-[20px]"
						style={{ backgroundColor: themeColor }}
					>
						{getInitials(user.name)}
					</div>
				)}
				<div className="flex-1 min-w-0">
					<div className="font-semibold text-white truncate">{user.name}</div>
					<div className="text-color-gray-50 truncate">{user.email}</div>
				</div>
				<Icon name="more_horiz" customClass="text-color-gray-50 !text-[24px]" />
			</div>

			<Dropdown isVisible={isDropdownOpen} setIsVisible={setIsDropdownOpen} toggleRef={toggleRef} customClasses="w-full max-w-[250px] !text-[16px]">
				<div className="p-2">
					<div
						className="flex items-center gap-3 p-2 hover:bg-color-gray-200 cursor-pointer rounded"
						onClick={handleSettingsClick}
					>
						<Icon name="settings" customClass="text-color-gray-50 !text-[20px]" />
						<span>Settings</span>
					</div>
					<div
						className="flex items-center gap-3 p-2 hover:bg-color-gray-200 cursor-pointer rounded"
						onClick={onLogout}
					>
						<Icon name="logout" customClass="text-color-gray-50 !text-[20px]" />
						<span>Log Out</span>
					</div>
				</div>
			</Dropdown>

			<ModalUserSettings isOpen={isUserSettingsOpen} onClose={() => setIsUserSettingsOpen(false)} />
		</div>
	);
};

export default UserProfileSection;
