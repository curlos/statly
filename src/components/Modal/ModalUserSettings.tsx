import { useState } from 'react';
import Modal from './Modal';
import Icon from '../Icon';
import AccountSection from './UserSettings/AccountSection';
import AppearanceSection from './UserSettings/AppearanceSection';
import ManageDataSection from './UserSettings/ManageDataSection';

interface ModalUserSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

const ModalUserSettings: React.FC<ModalUserSettingsProps> = ({ isOpen, onClose }) => {
	const [activeSection, setActiveSection] = useState('account');

	const menuItems = [
		{ id: 'account', label: 'Account', icon: 'person' },
		{ id: 'appearance', label: 'Appearance', icon: 'palette' },
		{ id: 'manage-data', label: 'Manage Data', icon: 'storage' },
	];

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[900px] !w-[90vw]">
			<div className="bg-color-gray-700 rounded-lg flex h-[80vh]">
				{/* Sidebar */}
				<div className="w-[240px] border-r border-color-gray-200 flex flex-col">
					<div className="flex-1 overflow-auto gray-scrollbar p-2 pt-4">
						{menuItems.map((item) => (
							<div
								key={item.id}
								className={`flex items-center gap-3 p-3 cursor-pointer rounded mb-1 ${
									activeSection === item.id ? 'bg-color-gray-600' : 'hover:bg-color-gray-600'
								}`}
								onClick={() => setActiveSection(item.id)}
							>
								<Icon name={item.icon} customClass="text-color-gray-50 !text-[20px]" />
								<span>{item.label}</span>
							</div>
						))}
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					<div className="flex items-center justify-between p-4 border-b border-color-gray-200">
						<h3 className="text-lg font-semibold">
							{menuItems.find((item) => item.id === activeSection)?.label}
						</h3>
						<Icon
							name="close"
							customClass="cursor-pointer text-color-gray-50 hover:text-white !text-[24px]"
							onClick={onClose}
						/>
					</div>
					<div className="flex-1 overflow-auto gray-scrollbar p-6">
						{activeSection === 'account' && <AccountSection onClose={onClose} />}
						{activeSection === 'appearance' && <AppearanceSection />}
						{activeSection === 'manage-data' && <ManageDataSection />}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalUserSettings;
