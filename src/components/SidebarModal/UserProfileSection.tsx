import { useState, useRef, useEffect } from 'react';
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
	const toggleRef = useRef<HTMLButtonElement>(null);
	const firstMenuItemRef = useRef<HTMLButtonElement>(null);
	const prevIsUserSettingsOpen = useRef(false);

	useEffect(() => {
		if (isDropdownOpen) {
			firstMenuItemRef.current?.focus();
		}
	}, [isDropdownOpen]);

	useEffect(() => {
		if (!isUserSettingsOpen && prevIsUserSettingsOpen.current) {
			toggleRef.current?.focus();
		}
		prevIsUserSettingsOpen.current = isUserSettingsOpen;
	}, [isUserSettingsOpen]);

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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsDropdownOpen(false);
			toggleRef.current?.focus();
		}
	};

	return (	
		<div className="relative" onKeyDown={handleKeyDown}>
			<button
				ref={toggleRef}
				type="button"
				aria-expanded={isDropdownOpen}
				aria-haspopup="menu"
				aria-label={`User menu for ${user.name}`}
				className="flex items-center gap-3 p-3 hover:bg-color-gray-600 rounded-full w-full text-left"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{profilePicUrl ? (
					<img src={profilePicUrl} alt={user.name} className="w-[60px] h-[60px] rounded-full object-cover" />
				) : (
					<div
						aria-hidden="true"
						className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-bold text-[20px]"
						style={{ backgroundColor: themeColor }}
					>
						{getInitials(user.name || '')}
					</div>
				)}
				<div className="flex-1 min-w-0">
					<div className="font-semibold text-white truncate">{user.name}</div>
					<div className="text-color-gray-50 truncate">{user.email}</div>
				</div>
				<Icon name="more_horiz" customClass="text-color-gray-50 !text-[24px]" />
			</button>

			<Dropdown isVisible={isDropdownOpen} setIsVisible={setIsDropdownOpen} toggleRef={toggleRef} customClasses="w-full max-w-[250px] !text-[16px] border border-color-gray-25">
				<div
					role="menu"
					className="p-2"
					onBlur={(e) => {
						if (!e.currentTarget.contains(e.relatedTarget as Node)) {
							setIsDropdownOpen(false);
						}
					}}
					onKeyDown={(e) => {
						const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
						const index = items.indexOf(document.activeElement as HTMLButtonElement);
						if (e.key === 'ArrowDown') {
							e.preventDefault();
							items[(index + 1) % items.length]?.focus();
						} else if (e.key === 'ArrowUp') {
							e.preventDefault();
							items[(index - 1 + items.length) % items.length]?.focus();
						}
					}}
				>
					<button
						ref={firstMenuItemRef}
						type="button"
						role="menuitem"
						className="flex items-center gap-3 p-2 hover:bg-color-gray-200 rounded w-full"
						onClick={handleSettingsClick}
					>
						<Icon name="settings" customClass="text-color-gray-50 !text-[20px]" />
						<span>Settings</span>
					</button>
					<button
						type="button"
						role="menuitem"
						className="flex items-center gap-3 p-2 hover:bg-color-gray-200 rounded w-full"
						onClick={onLogout}
					>
						<Icon name="logout" customClass="text-color-gray-50 !text-[20px]" />
						<span>Log Out</span>
					</button>
				</div>
			</Dropdown>

			<ModalUserSettings isOpen={isUserSettingsOpen} onClose={() => setIsUserSettingsOpen(false)} />
		</div>
	);
};

export default UserProfileSection;
