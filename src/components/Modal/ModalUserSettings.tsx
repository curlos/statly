import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import Icon from '../Icon';
import ProfileSection from './UserSettings/ProfileSection';
import EditProfileSection from './UserSettings/EditProfileSection';
import AppearanceSection from './UserSettings/AppearanceSection';
import ManageDataSection from './UserSettings/ManageDataSection';

interface ModalUserSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

const ModalUserSettings: React.FC<ModalUserSettingsProps> = ({ isOpen, onClose }) => {
	const [activeSection, setActiveSection] = useState('profile');
	const [showEditProfile, setShowEditProfile] = useState(false);
	const profileButtonRef = useRef<HTMLButtonElement>(null);
	const editProfileButtonRef = useRef<HTMLButtonElement>(null);
	const prevShowEditProfile = useRef(false);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => profileButtonRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	useEffect(() => {
		if (!showEditProfile && prevShowEditProfile.current) {
			const timer = setTimeout(() => editProfileButtonRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
		prevShowEditProfile.current = showEditProfile;
	}, [showEditProfile]);

	const menuItems = [
		{ id: 'profile', label: 'Profile', icon: 'person' },
		{ id: 'appearance', label: 'Appearance', icon: 'palette' },
		{ id: 'manage-data', label: 'Manage Data', icon: 'storage' },
	];

	const handleSectionChange = (sectionId: string) => {
		setActiveSection(sectionId);
		setShowEditProfile(false); // Reset edit view when switching sections
	};

	const handleClose = () => {
		setShowEditProfile(false); // Reset edit view when modal closes
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} customClasses="!max-w-[900px] !w-[95vw] md:!w-[90vw]" ariaLabelledBy="user-settings-title">
			<div className="bg-color-gray-700 rounded-lg flex flex-col md:flex-row h-[80vh] max-h-[80vh] overflow-hidden">
				{/* Sidebar */}
				<div className="w-full md:w-[240px] border-b md:border-b-0 md:border-r border-color-gray-100 flex flex-col">
					<div className="flex md:flex-col md:flex-1">
						{/* Scrollable menu items */}
						<div
							role="tablist"
							aria-label="Settings sections"
							className="flex flex-1 md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto gray-scrollbar p-2 md:pt-4"
						>
							{menuItems.map((item, index) => (
								<button
									key={item.id}
									ref={index === 0 ? profileButtonRef : undefined}
									role="tab"
									id={`${item.id}-tab`}
									aria-selected={activeSection === item.id}
									aria-controls="settings-panel"
									className={`flex items-center gap-3 p-3 cursor-pointer rounded mb-0 md:mb-1 mr-1 md:mr-0 whitespace-nowrap text-left ${
										activeSection === item.id ? 'bg-color-gray-600' : 'hover:bg-color-gray-600'
									}`}
									onClick={() => handleSectionChange(item.id)}
								>
									<Icon name={item.icon} customClass="text-color-gray-50 !text-[20px]" />
									<span>{item.label}</span>
								</button>
							))}
						</div>
						{/* Close button - only visible on mobile */}
						<div className="flex md:hidden items-center p-2">
							<button
								type="button"
								aria-label="Close settings"
								onClick={handleClose}
								className="cursor-pointer hover:bg-color-gray-200 rounded-full p-2 transition text-color-gray-50 hover:text-white flex items-center justify-center"
							>
								<Icon name="close" customClass="!text-[24px] leading-none" aria-hidden={true} />
							</button>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 flex flex-col min-h-0">
					<div className="hidden md:flex items-center justify-between p-4 border-b border-color-gray-100">
						<div className="flex items-center gap-3">
							{activeSection === 'profile' && showEditProfile && (
								<button
									type="button"
									aria-label="Back to profile"
									onClick={() => setShowEditProfile(false)}
									className="cursor-pointer hover:bg-color-gray-200 rounded-full p-2 transition text-color-gray-50 hover:text-white flex items-center justify-center"
								>
									<Icon name="arrow_back" customClass="!text-[24px] leading-none" aria-hidden={true} />
								</button>
							)}
							<h2 id="user-settings-title" className="text-lg font-semibold">
								{activeSection === 'profile' && showEditProfile
									? 'Edit Profile'
									: menuItems.find((item) => item.id === activeSection)?.label}
							</h2>
						</div>
						<button
							type="button"
							aria-label="Close settings"
							onClick={handleClose}
							className="cursor-pointer hover:bg-color-gray-200 rounded-full p-2 transition text-color-gray-50 hover:text-white flex items-center justify-center"
						>
							<Icon name="close" customClass="!text-[24px] leading-none" aria-hidden={true} />
						</button>
					</div>
					<div
						id="settings-panel"
						role="tabpanel"
						aria-labelledby={`${activeSection}-tab`}
						className="flex-1 overflow-y-scroll gray-scrollbar p-3 pb-6 lg:p-6 [&::-webkit-scrollbar]:!block"
					>
						{activeSection === 'profile' && !showEditProfile && (
							<ProfileSection
								onClose={handleClose}
								onEditProfile={() => setShowEditProfile(true)}
								editProfileButtonRef={editProfileButtonRef}
							/>
						)}
						{activeSection === 'profile' && showEditProfile && <EditProfileSection />}
						{activeSection === 'appearance' && <AppearanceSection />}
						{activeSection === 'manage-data' && <ManageDataSection />}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalUserSettings;
