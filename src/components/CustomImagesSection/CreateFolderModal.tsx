import Modal from '../Modal/Modal';
import { useCreateCustomImageFolderMutation } from '../../services/resources/customImageFoldersApi';
import { useThemeContext } from '../../contexts/useThemeContext';

interface CreateFolderModalProps {
	isOpen: boolean;
	onClose: () => void;
	newFolderName: string;
	setNewFolderName: (name: string) => void;
	setSelectedMedalType: (type: string) => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
	isOpen,
	onClose,
	newFolderName,
	setNewFolderName,
	setSelectedMedalType,
}) => {
	const [createFolder] = useCreateCustomImageFolderMutation();
	const { chosenColorObj, nextDarkestColorObj } = useThemeContext();

	const handleClose = () => {
		onClose();
		setNewFolderName('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newFolderName.trim()) {
			await createFolder({ name: newFolderName }).unwrap();
			setNewFolderName('');
			setSelectedMedalType(newFolderName);
			onClose();
		}
	};

	const maxLength = 30;
	const charCount = newFolderName.length;
	const isAtMax = charCount >= maxLength;

	return (
		<Modal isOpen={isOpen} onClose={handleClose} ariaLabelledBy="create-folder-heading">
			<div className="bg-color-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
				<h3 id="create-folder-heading" tabIndex={-1} autoFocus className="text-lg font-bold mb-3">
					Create New Folder
				</h3>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={newFolderName}
						onChange={(e) => setNewFolderName(e.target.value.toUpperCase())}
						placeholder="Enter folder name..."
						className="w-full px-3 py-2 bg-color-gray-300 rounded mb-2"
						maxLength={maxLength}
					/>
					<div className={`flex justify-end text-sm mb-4 ${isAtMax ? 'text-red-500' : 'text-color-gray-100'}`}>
						{charCount} / {maxLength}
					</div>
					<div className="flex gap-3 justify-end">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!newFolderName.trim()}
							className={`px-4 py-2 ${chosenColorObj.bgColor} ${nextDarkestColorObj?.hover.bgColor || chosenColorObj.hover.bgColor} text-white rounded disabled:opacity-50`}
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default CreateFolderModal;
