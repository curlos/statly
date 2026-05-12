import { useState, useRef, useEffect } from 'react';
import { useUploadCustomImagesMutation } from '../services/resources/customImagesApi';
import ImageCropModal from './Modal/ImageCropModal';
import Icon from './Icon';
import Spinner from './Loaders/Spinner';
import classNames from 'classnames';
import { useThemeContext } from '../contexts/useThemeContext';
import CheckboxOther from './FilterSidebar/CheckboxOther';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomImageUploadProps {
	currentFolder: string;
	fileInputRef?: React.RefObject<HTMLInputElement>;
	showSelectButton?: boolean;
	previewUrls: string[];
	setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

interface SortablePreviewItemProps {
	id: string;
	url: string;
	index: number;
	onCrop: (index: number) => void;
	onDelete: (index: number) => void;
}

const SortablePreviewItem: React.FC<SortablePreviewItemProps> = ({ id, url, index, onCrop, onDelete }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className="relative group">
			<div {...attributes} {...listeners} className="cursor-move">
				<img
					src={url}
					alt={`Preview ${index + 1}`}
					className="w-full h-full object-cover rounded"
				/>
			</div>
			{/* Action Icons */}
			<div className="absolute top-1 right-1 flex gap-1">
				<button
					onClick={() => onCrop(index)}
					className="bg-black/70 hover:bg-black p-1 rounded"
					title="Crop image"
				>
					<Icon name="crop" customClass="!text-[16px] text-[#ffffff]" />
				</button>
				<button
					onClick={() => onDelete(index)}
					className="bg-black/70 hover:bg-black p-1 rounded"
					title="Delete image"
				>
					<Icon name="delete" customClass="!text-[16px] text-[#ffffff]" />
				</button>
			</div>
		</div>
	);
};

const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
	currentFolder,
	fileInputRef: externalFileInputRef,
	showSelectButton = true,
	previewUrls,
	setPreviewUrls,
}) => {
	const { chosenColorObj, nextDarkestColorObj, colorMode } = useThemeContext();
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [fileIds, setFileIds] = useState<string[]>([]); // Unique IDs for drag-and-drop
	const [cropIndex, setCropIndex] = useState<number | null>(null);
	const [imageToCrop, setImageToCrop] = useState<string | null>(null);
	const [showCropModal, setShowCropModal] = useState(false);
	const [compress, setCompress] = useState(true);
	const [uploadCustomImages, { isLoading }] = useUploadCustomImagesMutation();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const internalFileInputRef = useRef<HTMLInputElement>(null);
	const errorRef = useRef<HTMLDivElement>(null);

	// Use external ref if provided, otherwise use internal ref
	const fileInputRef = externalFileInputRef || internalFileInputRef;

	useEffect(() => {
		if (error) {
			errorRef.current?.focus();
		}
	}, [error]);

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		if (files.length === 0) return;

		// Validate file count
		if (selectedFiles.length + files.length > 10) {
			setError('You can only upload up to 10 images at a time');
			e.target.value = '';
			return;
		}

		// Validate file sizes
		const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
		if (invalidFiles.length > 0) {
			setError(`${invalidFiles.length} file(s) exceed 5MB limit`);
			e.target.value = '';
			return;
		}

		setError(null);

		// Read files and create preview URLs
		const newFiles = [...selectedFiles, ...files];
		const newPreviewUrls: string[] = [...previewUrls];
		const newFileIds: string[] = [...fileIds];

		// Pre-fill preview URLs array with placeholders to maintain order
		const startIndex = previewUrls.length;
		for (let i = 0; i < files.length; i++) {
			newPreviewUrls.push(''); // Placeholder
			newFileIds.push(`file-${Date.now()}-${Math.random()}-${i}`);
		}

		// Read each file and place preview URL at correct index
		files.forEach((file, fileIndex) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				newPreviewUrls[startIndex + fileIndex] = reader.result as string;
				// Update state once all files are read
				if (newPreviewUrls.every(url => url !== '')) {
					setPreviewUrls([...newPreviewUrls]);
				}
			};
			reader.readAsDataURL(file);
		});

		setSelectedFiles(newFiles);
		setFileIds(newFileIds);
	};

	const handleCropImage = (index: number) => {
		setCropIndex(index);
		setImageToCrop(previewUrls[index]);
		setShowCropModal(true);
	};

	const handleCropComplete = async (croppedImageUrl: string) => {
		if (cropIndex === null) return;

		try {
			// Convert cropped data URL to File
			const response = await fetch(croppedImageUrl);
			const blob = await response.blob();
			const file = new File([blob], `custom-image-${Date.now()}.jpg`, { type: 'image/jpeg' });

			// Update the file and preview at the crop index
			const newFiles = [...selectedFiles];
			newFiles[cropIndex] = file;
			setSelectedFiles(newFiles);

			const newPreviewUrls = [...previewUrls];
			newPreviewUrls[cropIndex] = croppedImageUrl;
			setPreviewUrls(newPreviewUrls);

			setShowCropModal(false);
			setCropIndex(null);
			setImageToCrop(null);
		} catch (error) {
			console.error('Error processing cropped image:', error);
			setError('Failed to process cropped image');
		}
	};

	const handleDeleteImage = (index: number) => {
		const newFiles = selectedFiles.filter((_, i) => i !== index);
		const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
		const newFileIds = fileIds.filter((_, i) => i !== index);
		setSelectedFiles(newFiles);
		setPreviewUrls(newPreviewUrls);
		setFileIds(newFileIds);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = fileIds.indexOf(active.id as string);
			const newIndex = fileIds.indexOf(over.id as string);

			setFileIds(arrayMove(fileIds, oldIndex, newIndex));
			setSelectedFiles(arrayMove(selectedFiles, oldIndex, newIndex));
			setPreviewUrls(arrayMove(previewUrls, oldIndex, newIndex));
		}
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			setError('Please select at least one image');
			return;
		}

		try {
			setError(null);
			setSuccess(null);

			const formData = new FormData();
			selectedFiles.forEach((file) => {
				formData.append('images', file);
			});
			formData.append('folder', currentFolder);
			formData.append('compress', String(compress));

			await uploadCustomImages(formData).unwrap();

			// Clear state on success
			setSelectedFiles([]);
			setPreviewUrls([]);
			setFileIds([]);
			setSuccess(`Successfully uploaded ${selectedFiles.length} image(s)!`);

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (error) {
			console.error('Upload failed:', error);
			setError('Failed to upload images. Please try again.');
		}
	};

	return (
		<div>
			{/* File Input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={handleFileSelect}
				className="hidden"
				id="custom-image-upload"
			/>

			{/* Select Button - only show if showSelectButton is true */}
			{showSelectButton && (
				<div className="mb-4">
					<label
						htmlFor="custom-image-upload"
						className={classNames(
							chosenColorObj.bgColor,
							nextDarkestColorObj?.hover.bgColor,
							'cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded font-medium'
						)}
					>
						<Icon name="add_photo_alternate" customClass="!text-[20px]" />
						Select Images (Max 10)
					</label>
				</div>
			)}

			{/* Error/Success Messages */}
			<div ref={errorRef} role="alert" tabIndex={-1} className={error ? `mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-sm focus:outline-none ${colorMode === 'dark' ? 'text-red-200' : 'text-red-700'}` : 'sr-only'}>
				{error}
			</div>
			<div role="status" className={success ? `mb-4 p-3 bg-green-900/30 border border-green-900 rounded text-sm ${colorMode === 'dark' ? 'text-green-200' : 'text-green-900'}` : 'sr-only'}>
				{success}
			</div>

			{/* Preview Grid with Drag and Drop */}
			{previewUrls.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-color-gray-150 text-color-gray-50">
					<Icon name="add_photo_alternate" customClass="!text-[36px] opacity-50" />
					<p className="text-[13px]">Select images above to preview them here</p>
				</div>
			)}
			{previewUrls.length > 0 && (
				<div>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={fileIds}
							strategy={rectSortingStrategy}
						>
							<div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
								{fileIds.map((id, index) => (
									<SortablePreviewItem
										key={id}
										id={id}
										url={previewUrls[index]}
										index={index}
										onCrop={handleCropImage}
										onDelete={handleDeleteImage}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>

					{/* Compress checkbox */}
					<div className="mb-4">
						<CheckboxOther
							name="Compress Image Quality"
							showValue={compress}
							handleCheckboxClick={() => setCompress(prev => !prev)}
						/>
					</div>

					{/* Upload Button */}
					<button
						onClick={handleUpload}
						disabled={isLoading}
						className={classNames(
							chosenColorObj.bgColor,
							chosenColorObj.hover.bgColorHalfOpacity,
							'w-full py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
						)}
					>
						{isLoading ? (
							<>
								<Spinner size="sm" customClass="!text-white" />
								Uploading...
							</>
						) : (
							`Upload ${selectedFiles.length} Image(s)`
						)}
					</button>
				</div>
			)}

			{/* Crop Modal */}
			{showCropModal && imageToCrop && (
				<ImageCropModal
					isOpen={showCropModal}
					onClose={() => {
						setShowCropModal(false);
						setCropIndex(null);
						setImageToCrop(null);
					}}
					imageSrc={imageToCrop}
					onCropComplete={handleCropComplete}
				/>
			)}
		</div>
	);
};

export default CustomImageUpload;
