import { useState, useMemo, useRef, useEffect } from 'react';
import Icon from '../Icon';
import classNames from 'classnames';
import CustomImageUpload from '../CustomImageUpload';
import ExistingCustomImages from '../ExistingCustomImages';
import { useGetCustomImagesQuery } from '../../services/resources/customImagesApi';
import {
	useGetCustomImageFoldersQuery,
} from '../../services/resources/customImageFoldersApi';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useCustomFolderNames } from '../../hooks/useCustomFolderNames';
import CreateFolderModal from './CreateFolderModal';
import RenameFolderModal from './RenameFolderModal';
import DeleteFolderModal from './DeleteFolderModal';

interface CustomImagesSectionProps {
	selectedMedalType: string;
	setSelectedMedalType: (type: string) => void;
	selectedImageSrc: string | undefined;
	setSelectedImageSrc: (src: string | undefined) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	itemsPerPage: number;
}

const CustomImagesSection: React.FC<CustomImagesSectionProps> = ({
	selectedMedalType,
	setSelectedMedalType,
	selectedImageSrc,
	setSelectedImageSrc,
	currentPage,
	setCurrentPage,
	itemsPerPage,
}) => {
	const { chosenColorObj, nextDarkestColorObj } = useThemeContext();

	// RTK Query - Custom Images
	const { data: customImages } = useGetCustomImagesQuery();

	// RTK Query - Custom Image Folders
	const { data: customFolders } = useGetCustomImageFoldersQuery();

	// State
	const [isCustomEditMode, setIsCustomEditMode] = useState(false);
	const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
	const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
	const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
	const [newFolderName, setNewFolderName] = useState('');
	const [renameFolderName, setRenameFolderName] = useState('');
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const uploadSectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (previewUrls.length > 0) {
			uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [previewUrls.length]);

	// Ref for file input
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Get custom folder names using shared hook
	const customFolderNames = useCustomFolderNames();

	// Filter custom images by selected folder
	const filteredCustomImages = useMemo(() => {
		if (!customImages) return [];
		return customImages.filter(img => img.folder === selectedMedalType);
	}, [customImages, selectedMedalType]);

	// Pagination logic
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedCustomImages = filteredCustomImages.slice(startIndex, endIndex);

	// Reset current page when folder changes
	useEffect(() => {
		setCurrentPage(1);
	}, [selectedMedalType, setCurrentPage]);

	return (
		<>
			{/* Folder Management Buttons */}
			<div className="flex items-center gap-2 mb-4">
				<button
					onClick={() => setIsCustomEditMode(!isCustomEditMode)}
					className={classNames(
						'cursor-pointer flex items-center justify-center p-1 rounded border border-color-gray-100',
						isCustomEditMode
							? `bg-green-500 hover:bg-green-400`
							: 'bg-color-gray-200 hover:text-blue-500'
					)}
				>
					<Icon
						name="edit"
						customClass="!text-[20px]"
					/>
				</button>

				{/* Folder management buttons (only in edit mode) */}
				{isCustomEditMode && (
					<>
						{/* Select Images Button */}
						<label
							htmlFor="custom-image-upload"
							className={classNames(
								chosenColorObj.bgColor,
								nextDarkestColorObj?.hover.bgColor,
								'cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm'
							)}
						>
							<Icon name="add_photo_alternate" customClass="!text-[18px]" />
							Select Images (Max 10)
						</label>

						<button
							onClick={() => setShowCreateFolderModal(true)}
							className="flex items-center justify-center p-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
							title="Create new folder"
						>
							<Icon name="create_new_folder" customClass="!text-[20px]" />
						</button>
						{selectedMedalType !== 'GENERAL' && (
							<button
								onClick={() => {
									setRenameFolderName(selectedMedalType);
									setShowRenameFolderModal(true);
								}}
								className="flex items-center justify-center p-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
								title="Rename current folder"
							>
								<Icon name="drive_file_rename_outline" customClass="!text-[20px]" />
							</button>
						)}
						{/* Show delete button if folder can be deleted OR folder has images */}
						{(selectedMedalType !== 'GENERAL' || filteredCustomImages.length > 0) && (
							<button
								onClick={() => setShowDeleteFolderModal(true)}
								className="flex items-center justify-center p-1 rounded bg-red-600 hover:bg-red-700 text-white"
								title={selectedMedalType === 'GENERAL' ? 'Delete images in folder' : 'Delete current folder'}
							>
								<Icon name="delete" customClass="!text-[20px]" />
							</button>
						)}
					</>
				)}
			</div>

			{/* Images Grid */}
			<div className="overflow-auto h-[250px] md:h-[420px] gray-scrollbar">
				<ExistingCustomImages
					selectedImageSrc={selectedImageSrc}
					setSelectedImageSrc={setSelectedImageSrc}
					isEditMode={isCustomEditMode}
					currentFolder={selectedMedalType}
					customImages={paginatedCustomImages}
					availableFolders={customFolderNames}
				/>

				{/* Upload section - only show in edit mode when images are staged */}
				{isCustomEditMode && (
					<>
						<div className="my-4 border-t border-color-gray-100" />
						<div ref={uploadSectionRef}>
							<CustomImageUpload
								currentFolder={selectedMedalType}
								fileInputRef={fileInputRef}
								showSelectButton={false}
								previewUrls={previewUrls}
								setPreviewUrls={setPreviewUrls}
							/>
						</div>
					</>
				)}
			</div>

			<CreateFolderModal
				isOpen={showCreateFolderModal}
				onClose={() => setShowCreateFolderModal(false)}
				newFolderName={newFolderName}
				setNewFolderName={setNewFolderName}
				setSelectedMedalType={setSelectedMedalType}
			/>

			<RenameFolderModal
				isOpen={showRenameFolderModal}
				onClose={() => setShowRenameFolderModal(false)}
				currentFolderName={selectedMedalType}
				renameFolderName={renameFolderName}
				setRenameFolderName={setRenameFolderName}
				customFolders={customFolders}
				setSelectedMedalType={setSelectedMedalType}
			/>

			<DeleteFolderModal
				isOpen={showDeleteFolderModal}
				onClose={() => setShowDeleteFolderModal(false)}
				selectedMedalType={selectedMedalType}
				filteredCustomImages={filteredCustomImages}
				customFolders={customFolders}
				setSelectedMedalType={setSelectedMedalType}
			/>
		</>
	);
};

export default CustomImagesSection;
