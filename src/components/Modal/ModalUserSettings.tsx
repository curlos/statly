import Modal from './Modal';
import Icon from '../Icon';

interface ModalUserSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

const ModalUserSettings: React.FC<ModalUserSettingsProps> = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="bg-color-gray-700 rounded-lg">
				<div className="flex items-center justify-between p-4 border-b border-color-gray-200">
					<h2 className="text-xl font-bold">User Settings</h2>
					<Icon
						name="close"
						customClass="cursor-pointer text-color-gray-50 hover:text-white !text-[24px]"
						onClick={onClose}
					/>
				</div>
				<div className="p-4">
					<p className="text-color-gray-50">User settings content will go here...</p>
				</div>
			</div>
		</Modal>
	);
};

export default ModalUserSettings;
