import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from './Modal';
import Icon from '../Icon';

interface ImageCropModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string;
	onCropComplete: (croppedImageUrl: string) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
	isOpen,
	onClose,
	imageSrc,
	onCropComplete,
}) => {
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	// Reset crop when image changes
	useEffect(() => {
		setCrop(undefined);
		setCompletedCrop(null);
	}, [imageSrc]);

	const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;

		// Calculate initial crop centered with square aspect ratio
		const cropSize = Math.min(width, height) * 0.9;

		setCrop({
			unit: 'px',
			width: cropSize,
			height: cropSize,
			x: (width - cropSize) / 2,
			y: (height - cropSize) / 2,
		});
	}, []);

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
			const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop);
			onCropComplete(croppedImageUrl);
			// Don't call onClose here - let the parent handle closing after processing
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[90vw] lg:!max-w-[600px]">
			<div className="bg-color-gray-700 rounded-lg overflow-hidden">
				{/* Header */}
				<div className="p-4 border-b border-color-gray-600 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Icon
							name="close"
							customClass="!text-[24px] cursor-pointer text-color-gray-100 hover:text-white transition"
							onClick={onClose}
						/>
						<h3 className="text-xl font-bold">Crop Profile Picture</h3>
					</div>
					<button
						type="button"
						onClick={handleApplyCrop}
						className="px-5 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition"
					>
						Apply
					</button>
				</div>

				{/* Crop Area */}
				<div className="p-4 max-h-[60vh] overflow-auto flex items-center justify-center bg-color-gray-800">
					<ReactCrop
						crop={crop}
						onChange={(c) => setCrop(c)}
						onComplete={(c) => setCompletedCrop(c)}
						aspect={1}
					>
						<img
							ref={imgRef}
							src={imageSrc}
							alt="Crop preview"
							onLoad={onImageLoad}
							style={{ maxHeight: '55vh', maxWidth: '100%' }}
						/>
					</ReactCrop>
				</div>

				{/* Footer */}
				<div className="p-3 bg-color-gray-700 border-t border-color-gray-600">
					<p className="text-sm text-color-gray-100 text-center">
						Drag the selection to reposition your profile picture
					</p>
				</div>
			</div>
		</Modal>
	);
};

export default ImageCropModal;
