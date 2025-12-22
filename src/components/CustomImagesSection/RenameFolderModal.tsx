import { useRenameCustomImageFolderMutation, type CustomImageFolder } from '../../services/resources/customImageFoldersApi';

interface RenameFolderModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentFolderName: string;
	renameFolderName: string;
	setRenameFolderName: (name: string) => void;
	customFolders: CustomImageFolder[] | undefined;
	setSelectedMedalType: (type: string) => void;
}

const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
	isOpen,
	onClose,
	currentFolderName,
	renameFolderName,
	setRenameFolderName,
	customFolders,
	setSelectedMedalType,
}) => {
	const [renameFolder] = useRenameCustomImageFolderMutation();

	const handleClose = () => {
		onClose();
		setRenameFolderName('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (renameFolderName.trim()) {
			const folderId = customFolders?.find(f => f.name === currentFolderName)?._id;
			if (folderId) {
				try {
					await renameFolder({ id: folderId, name: renameFolderName }).unwrap();
					setSelectedMedalType(renameFolderName);
					setRenameFolderName('');
					onClose();
				} catch (error) {
					console.error('Failed to rename folder:', error);
				}
			}
		}
	};

	if (!isOpen) return null;

	const maxLength = 30;
	const charCount = renameFolderName.length;
	const isAtMax = charCount >= maxLength;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-color-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
				<h3 className="text-lg font-bold mb-3">Rename Folder</h3>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={renameFolderName}
						onChange={(e) => setRenameFolderName(e.target.value.toUpperCase())}
						placeholder="Enter new folder name..."
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
							disabled={!renameFolderName.trim()}
							className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded disabled:opacity-50"
						>
							Rename
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RenameFolderModal;
