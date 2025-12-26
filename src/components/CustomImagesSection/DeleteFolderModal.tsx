import Icon from '../Icon';
import Spinner from '../Loaders/Spinner';
import { useBulkDeleteCustomImagesMutation } from '../../services/resources/customImagesApi';
import { useDeleteCustomImageFolderMutation, type CustomImageFolder } from '../../services/resources/customImageFoldersApi';
import type { CustomImage } from '../../types/models';

interface DeleteFolderModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedMedalType: string;
	filteredCustomImages: CustomImage[];
	customFolders: CustomImageFolder[] | undefined;
	setSelectedMedalType: (type: string) => void;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
	isOpen,
	onClose,
	selectedMedalType,
	filteredCustomImages,
	customFolders,
	setSelectedMedalType,
}) => {
	const [bulkDeleteCustomImages, { isLoading: isDeletingImages }] = useBulkDeleteCustomImagesMutation();
	const [deleteFolder, { isLoading: isDeletingFolder }] = useDeleteCustomImageFolderMutation();

	const handleDeleteAllImages = async () => {
		try {
			await bulkDeleteCustomImages(selectedMedalType).unwrap();
			onClose();
		} catch (error) {
			console.error('Failed to delete images:', error);
		}
	};

	const handleDeleteFolderMoveToGeneral = async () => {
		const folderId = customFolders?.find(f => f.name === selectedMedalType)?._id;
		if (folderId) {
			try {
				await deleteFolder({ id: folderId, strategy: 'moveToGeneral' }).unwrap();
				setSelectedMedalType('GENERAL');
				onClose();
			} catch (error) {
				console.error('Failed to delete folder:', error);
			}
		}
	};

	const handleDeleteFolderAndImages = async () => {
		const folderId = customFolders?.find(f => f.name === selectedMedalType)?._id;
		if (folderId) {
			try {
				await deleteFolder({ id: folderId, strategy: 'deleteImages' }).unwrap();
				setSelectedMedalType('GENERAL');
				onClose();
			} catch (error) {
				console.error('Failed to delete folder:', error);
			}
		}
	};

	const handleDeleteEmptyFolder = async () => {
		const folderId = customFolders?.find(f => f.name === selectedMedalType)?._id;
		if (folderId) {
			try {
				await deleteFolder({ id: folderId }).unwrap();
				setSelectedMedalType('GENERAL');
				onClose();
			} catch (error) {
				console.error('Failed to delete folder:', error);
			}
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-color-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
				<div className="flex items-start justify-between mb-3">
					<h3 className="text-lg font-bold">
						{selectedMedalType === 'GENERAL'
							? 'Delete Images in GENERAL Folder?'
							: `Delete "${selectedMedalType}" Folder?`}
					</h3>
					<button
						onClick={onClose}
						className="text-color-gray-100 hover:text-white transition -mt-1 -mr-1"
						title="Close"
					>
						<Icon name="close" customClass="!text-[24px]" />
					</button>
				</div>
				<p className="text-color-gray-100 mb-4">
					{filteredCustomImages.length > 0 ? (
						<>
							This folder contains <span className="font-semibold text-white">{filteredCustomImages.length} image(s)</span>.
							<span className="block mt-2">What would you like to do?</span>
						</>
					) : (
						selectedMedalType === 'GENERAL'
							? 'This folder is empty.'
							: 'This folder is empty and will be permanently deleted.'
					)}
				</p>

				<div className="flex flex-col gap-3">
					{/* Option: Delete all images in folder (show for all folders if they have images) */}
					{filteredCustomImages.length > 0 && (
						<button
							onClick={handleDeleteAllImages}
							disabled={isDeletingImages || isDeletingFolder}
							className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-left disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<div className="flex items-start gap-2">
								{isDeletingImages || isDeletingFolder ? (
									<Spinner size="sm" customClass="mt-0.5 !text-white" />
								) : (
									<Icon name="delete_sweep" customClass="!text-[20px] mt-0.5" />
								)}
								<div>
									<div className="font-semibold">Delete All Images in Folder</div>
									<div className="text-sm text-red-100 mt-0.5">
										Permanently delete all {filteredCustomImages.length} image(s) in this folder
									</div>
								</div>
							</div>
						</button>
					)}

					{/* Options for non-GENERAL folders only */}
					{selectedMedalType !== 'GENERAL' && (
						<>
							{/* Option 1: Delete folder & move images to GENERAL (only show if folder has images) */}
							{filteredCustomImages.length > 0 && (
								<button
									onClick={handleDeleteFolderMoveToGeneral}
									disabled={isDeletingFolder}
									className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-left disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<div className="flex items-start gap-2">
										{isDeletingFolder ? (
											<Spinner size="sm" customClass="mt-0.5 !text-white" />
										) : (
											<Icon name="drive_file_move" customClass="!text-[20px] mt-0.5" />
										)}
										<div>
											<div className="font-semibold">Delete Folder & Move Images to GENERAL</div>
											<div className="text-sm text-blue-100 mt-0.5">
												Delete this folder, keep all {filteredCustomImages.length} image(s) in GENERAL
											</div>
										</div>
									</div>
								</button>
							)}

							{/* Option 2: Delete folder & all images (only show if folder has images) */}
							{filteredCustomImages.length > 0 && (
								<button
									onClick={handleDeleteFolderAndImages}
									disabled={isDeletingFolder}
									className="w-full px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded font-medium text-left disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<div className="flex items-start gap-2">
										{isDeletingFolder ? (
											<Spinner size="sm" customClass="mt-0.5 !text-white" />
										) : (
											<Icon name="delete_forever" customClass="!text-[20px] mt-0.5" />
										)}
										<div>
											<div className="font-semibold">Delete Folder & All Images</div>
											<div className="text-sm text-red-100 mt-0.5">
												Permanently delete this folder and all {filteredCustomImages.length} image(s)
											</div>
										</div>
									</div>
								</button>
							)}

							{/* Delete empty folder button (only show if folder is empty) */}
							{filteredCustomImages.length === 0 && (
								<button
									onClick={handleDeleteEmptyFolder}
									disabled={isDeletingFolder}
									className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{isDeletingFolder && <Spinner size="sm" customClass="!text-white" />}
									Delete Folder
								</button>
							)}
						</>
					)}

					{/* Cancel button */}
					<button
						onClick={onClose}
						className="w-full px-4 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded font-medium"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteFolderModal;
