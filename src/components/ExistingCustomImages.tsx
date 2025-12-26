import { useState, useEffect } from 'react';
import {
	useUpdateCustomImageMutation,
	useDeleteCustomImageMutation,
	useReorderCustomImagesMutation,
	useMoveCustomImageMutation,
} from '../services/resources/customImagesApi';
import ImageCropModal from './Modal/ImageCropModal';
import Icon from './Icon';
import Spinner from './Loaders/Spinner';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableCustomImage from './SortableCustomImage';
import type { CustomImage } from '../types/models';

interface ExistingCustomImagesProps {
	selectedImageSrc?: string;
	setSelectedImageSrc?: (src: string) => void;
	isEditMode?: boolean;
	currentFolder: string;
	customImages: CustomImage[];
	availableFolders: string[];
}

const ExistingCustomImages: React.FC<ExistingCustomImagesProps> = ({
	selectedImageSrc,
	setSelectedImageSrc,
	isEditMode = false,
	currentFolder,
	customImages,
	availableFolders,
}) => {
	const [updateCustomImage] = useUpdateCustomImageMutation();
	const [deleteCustomImage, { isLoading: isDeletingImage }] = useDeleteCustomImageMutation();
	const [reorderCustomImages] = useReorderCustomImagesMutation();
	const [moveCustomImage] = useMoveCustomImageMutation();

	const [localImages, setLocalImages] = useState<CustomImage[]>([]);
	const [editingImageId, setEditingImageId] = useState<string | null>(null);
	const [imageToCrop, setImageToCrop] = useState<string | null>(null);
	const [showCropModal, setShowCropModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

	// Move modal state
	const [showMoveModal, setShowMoveModal] = useState<string | null>(null);
	const [moveDestinationFolder, setMoveDestinationFolder] = useState<string>('');

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Update local images when data changes
	useEffect(() => {
		if (customImages) {
			setLocalImages(customImages);
		}
	}, [customImages]);

	const handleCropImage = (imageId: string, imageUrl: string) => {
		setEditingImageId(imageId);
		setImageToCrop(imageUrl);
		setShowCropModal(true);
	};

	const handleCropComplete = async (croppedImageUrl: string) => {
		if (!editingImageId) return;

		try {
			// Convert cropped data URL to File
			const response = await fetch(croppedImageUrl);
			const blob = await response.blob();
			const file = new File([blob], `custom-image-${Date.now()}.jpg`, { type: 'image/jpeg' });

			// Create FormData and upload
			const formData = new FormData();
			formData.append('image', file);

			await updateCustomImage({ id: editingImageId, formData }).unwrap();

			setShowCropModal(false);
			setEditingImageId(null);
			setImageToCrop(null);
		} catch (error) {
			console.error('Failed to update image:', error);
		}
	};

	const handleDeleteImage = async (imageId: string) => {
		try {
			await deleteCustomImage(imageId).unwrap();
			setShowDeleteConfirm(null);
		} catch (error) {
			console.error('Failed to delete image:', error);
		}
	};

	const handleMoveImage = async (imageId: string, destinationFolder: string) => {
		try {
			await moveCustomImage({ id: imageId, folder: destinationFolder.toUpperCase() }).unwrap();
			setShowMoveModal(null);
			setMoveDestinationFolder('');
		} catch (error) {
			console.error('Failed to move image:', error);
		}
	};

	const handleSelectImage = (imageUrl: string) => {
		if (!isEditMode && setSelectedImageSrc) {
			setSelectedImageSrc(imageUrl);
		}
	};

	// Handle drag end for reordering images
	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = localImages.findIndex(img => img._id === active.id);
			const newIndex = localImages.findIndex(img => img._id === over.id);

			const newOrder = arrayMove(localImages, oldIndex, newIndex);
			setLocalImages(newOrder);

			// Send reorder request to backend
			try {
				await reorderCustomImages(newOrder.map(img => img._id)).unwrap();
			} catch (error) {
				console.error('Failed to reorder images:', error);
				// Revert on error
				setLocalImages(customImages || []);
			}
		}
	};

	if (!localImages || localImages.length === 0) {
		return (
			<div className="text-center py-8 text-color-gray-100">
				<Icon name="image" customClass="!text-[48px] mb-2 opacity-50" />
				<p>No custom images yet. {isEditMode ? 'Upload some below!' : 'Enable edit mode to upload!'}</p>
			</div>
		);
	}

	return (
		<div>
			{/* Images Grid with Drag and Drop */}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={localImages.map(img => img._id)}
					strategy={rectSortingStrategy}
					disabled={!isEditMode}
				>
					<div className="grid grid-cols-3 md:grid-cols-4 gap-2">
						{localImages.map((image) => {
							const isSelected = selectedImageSrc === image.imageUrl;

							return (
								<SortableCustomImage
									key={image._id}
									image={image}
									isEditMode={isEditMode}
									isSelected={isSelected}
									onSelect={() => handleSelectImage(image.imageUrl)}
									onCrop={() => handleCropImage(image._id, image.imageUrl)}
									onDelete={() => setShowDeleteConfirm(image._id)}
									onMove={() => setShowMoveModal(image._id)}
									availableFolders={availableFolders}
								/>
							);
						})}
					</div>
				</SortableContext>
			</DndContext>

			{/* Crop Modal */}
			{showCropModal && imageToCrop && (
				<ImageCropModal
					isOpen={showCropModal}
					onClose={() => {
						setShowCropModal(false);
						setEditingImageId(null);
						setImageToCrop(null);
					}}
					imageSrc={imageToCrop}
					onCropComplete={handleCropComplete}
				/>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-color-gray-700 rounded-lg p-6 max-w-sm mx-4">
						<h3 className="text-lg font-bold mb-3">Delete Image?</h3>
						<p className="text-color-gray-100 mb-6">
							This action cannot be undone. The image will be permanently deleted.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowDeleteConfirm(null)}
								disabled={isDeletingImage}
								className="px-4 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								onClick={() => handleDeleteImage(showDeleteConfirm)}
								disabled={isDeletingImage}
								className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isDeletingImage && <Spinner size="sm" />}
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Move Modal */}
			{showMoveModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-color-gray-700 rounded-lg p-6 max-w-sm mx-4">
						<h3 className="text-lg font-bold mb-3">Move to Folder</h3>

						{/* Folder Dropdown */}
						<select
							value={moveDestinationFolder}
							onChange={(e) => setMoveDestinationFolder(e.target.value)}
							className="w-full px-3 py-2 bg-color-gray-300 rounded mb-4 text-white"
						>
							<option value="">Select folder...</option>
							{availableFolders
								.filter(f => f !== currentFolder) // Can't move to current folder
								.map(folder => (
									<option key={folder} value={folder}>{folder}</option>
								))
							}
						</select>

						{/* Buttons */}
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => {
									setShowMoveModal(null);
									setMoveDestinationFolder('');
								}}
								className="px-4 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded"
							>
								Cancel
							</button>
							<button
								onClick={() => showMoveModal && handleMoveImage(showMoveModal, moveDestinationFolder)}
								disabled={!moveDestinationFolder}
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
							>
								Move
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ExistingCustomImages;
