import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from './Icon';
import classNames from 'classnames';
import LazyImage from './LazyImage';
import { useThemeContext } from '../contexts/useThemeContext';
import type { CustomImage } from '../types/models';

interface SortableCustomImageProps {
	image: CustomImage;
	isEditMode: boolean;
	isSelected: boolean;
	onSelect: () => void;
	onCrop: () => void;
	onDelete: () => void;
	onMove: () => void;
	availableFolders: string[];
}

const SortableCustomImage: React.FC<SortableCustomImageProps> = ({
	image,
	isEditMode,
	isSelected,
	onSelect,
	onCrop,
	onDelete,
	onMove,
	availableFolders,
}) => {
	const { chosenColorObj } = useThemeContext();
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: image._id, disabled: !isEditMode });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={classNames(
				'relative overflow-hidden',
				!isEditMode && 'cursor-pointer hover:opacity-80 transition',
				isDragging && 'z-50'
			)}
			onClick={!isEditMode ? onSelect : undefined}
		>
			{/* Image */}
			<div className="relative">
				<LazyImage
					src={image.imageUrl}
					alt="Custom image"
					className={isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}
				/>

				{/* Drag handle overlay when in edit mode */}
				{isEditMode && (
					<div
						className="absolute inset-0 cursor-grab active:cursor-grabbing"
						{...attributes}
						{...listeners}
					/>
				)}
			</div>

			{/* Selection Checkmark (only in READ mode) */}
			{!isEditMode && isSelected && (
				<div className="absolute bottom-2 right-2 z-10">
					<div
						className={classNames(
							chosenColorObj.bgColor,
							'rounded-full h-[20px] w-[20px] flex items-center justify-center'
						)}
					>
						<Icon name="check" customClass="!text-[16px] text-white" />
					</div>
				</div>
			)}

			{/* Edit Mode Icons */}
			{isEditMode && (
				<div className="absolute top-1 right-1 flex gap-1 z-20">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onCrop();
						}}
						className="bg-black/70 hover:bg-black p-1 rounded"
						title="Crop image"
					>
						<Icon name="crop" customClass="!text-[16px] text-[#ffffff]" />
					</button>
					{availableFolders.length > 1 && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onMove();
							}}
							className="bg-black/70 hover:bg-black p-1 rounded"
							title="Move to folder"
						>
							<Icon name="drive_file_move" customClass="!text-[16px] text-[#ffffff]" />
						</button>
					)}
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className="bg-black/70 hover:bg-black p-1 rounded"
						title="Delete image"
					>
						<Icon name="delete" customClass="!text-[16px] text-[#ffffff]" />
					</button>
				</div>
			)}
		</div>
	);
};

export default SortableCustomImage;
