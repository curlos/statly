import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from './Modal';
import Icon from '../Icon';
import Spinner from '../Loaders/Spinner';

interface ImageCropModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string;
	onCropComplete: (croppedImageUrl: string) => void;
	aspect?: number; // Optional aspect ratio (e.g., 1 for square). Undefined = no restriction
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
	isOpen,
	onClose,
	imageSrc,
	onCropComplete,
	aspect,
}) => {
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
	const [isApplying, setIsApplying] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);
	const cropContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				const focusable = cropContainerRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
				focusable?.focus();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	// Reset crop when image changes
	useEffect(() => {
		setCrop(undefined);
		setCompletedCrop(null);
	}, [imageSrc]);

	const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;

		if (aspect === 1) {
			// Square aspect ratio - calculate crop centered
			const cropSize = Math.min(width, height) * 0.9;
			setCrop({
				unit: 'px',
				width: cropSize,
				height: cropSize,
				x: (width - cropSize) / 2,
				y: (height - cropSize) / 2,
			});
		} else {
			// No aspect restriction - default to 90% of image dimensions, centered
			const cropWidth = width * 0.9;
			const cropHeight = height * 0.9;
			setCrop({
				unit: 'px',
				width: cropWidth,
				height: cropHeight,
				x: (width - cropWidth) / 2,
				y: (height - cropHeight) / 2,
			});
		}
	}, [aspect]);

	const getCroppedImg = useCallback(
		(image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
			const canvas = document.createElement('canvas');
			const scaleX = image.naturalWidth / image.width;
			const scaleY = image.naturalHeight / image.height;

			canvas.width = crop.width;
			canvas.height = crop.height;
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return Promise.reject(new Error('No 2d context'));
			}

			ctx.drawImage(
				image,
				crop.x * scaleX,
				crop.y * scaleY,
				crop.width * scaleX,
				crop.height * scaleY,
				0,
				0,
				crop.width,
				crop.height
			);

			return new Promise((resolve) => {
				canvas.toBlob((blob) => {
					if (!blob) {
						return;
					}
					const reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = () => {
						resolve(reader.result as string);
					};
				}, 'image/jpeg');
			});
		},
		[]
	);

	const handleApplyCrop = async () => {
		if (completedCrop && imgRef.current) {
			setIsApplying(true);
			try {
				const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop);
				onCropComplete(croppedImageUrl);
				// Don't call onClose here - let the parent handle closing after processing
			} catch (error) {
				console.error('Failed to apply crop:', error);
			} finally {
				setIsApplying(false);
			}
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[90vw] lg:!max-w-[600px]" ariaLabelledBy="crop-modal-title">
			<div className="bg-color-gray-700 rounded-lg overflow-hidden">
				{/* Header */}
				<div className="p-4 border-b border-color-gray-600 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							type="button"
							aria-label="Close crop dialog"
							onClick={onClose}
							className="cursor-pointer text-color-gray-100 hover:text-white transition rounded-full p-1"
						>
							<Icon name="close" customClass="!text-[24px]" aria-hidden={true} />
						</button>
						<h3 id="crop-modal-title" className="text-xl font-bold">Crop Image</h3>
					</div>
					<button
						type="button"
						onClick={handleApplyCrop}
						disabled={isApplying}
						className="px-5 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						Apply
						{isApplying && <Spinner size="sm" customClass="!text-black" />}
					</button>
				</div>

				{/* Crop Area */}
				<div className="p-4 max-h-[60vh] overflow-auto flex items-center justify-center bg-color-gray-800">
					<div ref={cropContainerRef}>
						<ReactCrop
							crop={crop}
							onChange={(c) => setCrop(c)}
							onComplete={(c) => setCompletedCrop(c)}
							aspect={aspect}
						>
							<img
								ref={imgRef}
								src={imageSrc}
								alt="Crop preview"
								onLoad={onImageLoad}
								crossOrigin="anonymous"
								style={{ maxHeight: '55vh', maxWidth: '100%' }}
							/>
						</ReactCrop>
					</div>
				</div>

				{/* Footer */}
				<div className="p-3 bg-color-gray-700 border-t border-color-gray-600">
					<p className="text-sm text-color-gray-100 text-center">
						Drag to reposition · Arrow keys to move · Shift+Arrow to resize handles
					</p>
				</div>
			</div>
		</Modal>
	);
};

export default ImageCropModal;
