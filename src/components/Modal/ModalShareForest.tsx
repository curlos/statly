import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { saveAs } from 'file-saver';
import Modal from './Modal';
import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import { drawShareCard, type ShareCardData, type ShareView } from '../../pages/forest/drawShareCard';
import { getFormattedDuration } from '../../utils/helpers.utils';

const VIEWS: { id: ShareView; label: string }[] = [
	{ id: 'forest', label: 'Forest' },
	{ id: 'projects', label: 'By Project' },
	{ id: 'time', label: 'By Time' },
];

interface ModalShareForestProps {
	isOpen: boolean;
	onClose: () => void;
	data: ShareCardData;
	renderForest: (width: number, height: number) => HTMLCanvasElement;
}

const ModalShareForest: React.FC<ModalShareForestProps> = ({ isOpen, onClose, data, renderForest }) => {
	const [view, setView] = useState<ShareView>('forest');
	const [card, setCard] = useState<HTMLCanvasElement | null>(null);
	const [previewUrl, setPreviewUrl] = useState('');
	const { chosenColorObj } = useThemeContext();

	useEffect(() => {
		if (!isOpen) return;

		const newCard = drawShareCard(view, data, renderForest);
		setCard(newCard);
		setPreviewUrl(newCard.toDataURL('image/png'));
	}, [isOpen, view, data, renderForest]);

	const fileName = `statly-forest-${view}-${data.rangeLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
	const canShareFiles = typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [new File([], 'forest.png', { type: 'image/png' })] });

	const getBlob = () => new Promise<Blob | null>((resolve) => (card ? card.toBlob(resolve, 'image/png') : resolve(null)));

	const handleSave = async () => {
		const blob = await getBlob();
		if (blob) saveAs(blob, fileName);
	};

	const handleShare = async () => {
		const blob = await getBlob();
		if (!blob) return;

		try {
			await navigator.share({ files: [new File([blob], fileName, { type: 'image/png' })], title: `My Statly forest: ${data.rangeLabel}` });
		} catch {
			// Closing the share sheet counts as an error, and there is nothing to do about it.
		}
	};

	const buttonClasses = 'px-4 py-1 rounded-full cursor-pointer text-[14px]';

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!w-[560px]" ariaLabelledBy="modal-share-forest-heading">
			<div className="bg-color-gray-600 rounded-lg p-4">
				<div className="flex justify-between items-center mb-3">
					<h2 id="modal-share-forest-heading" className="font-bold text-[18px]">Share Your Forest</h2>
					<button type="button" aria-label="Close" className="bg-transparent border-0 p-0 cursor-pointer" onClick={onClose}>
						<Icon name="close" customClass="!text-[24px] text-color-gray-50" />
					</button>
				</div>

				<div role="group" aria-label="Card style" className="flex flex-wrap gap-2 mb-3">
					{VIEWS.map(({ id, label }) => (
						<button
							key={id}
							type="button"
							aria-pressed={view === id}
							className={classNames(buttonClasses, view === id ? `${chosenColorObj.bgColor} font-semibold` : 'bg-color-gray-300 text-color-gray-25')}
							onClick={() => setView(id)}
						>
							{label}
						</button>
					))}
				</div>

				{previewUrl && (
					<img
						src={previewUrl}
						alt={`Share card for ${data.rangeLabel}: ${getFormattedDuration(data.totalSeconds, false)} focused and ${data.treeCount.toLocaleString()} ${data.treeCount === 1 ? 'tree' : 'trees'}.`}
						className="w-full max-h-[62vh] object-contain rounded-md"
					/>
				)}

				<div className="flex gap-2 mt-3">
					<button type="button" className={classNames(buttonClasses, 'flex-1 bg-color-gray-300 text-color-gray-25 border border-color-gray-50')} onClick={handleSave}>
						Save
					</button>
					{canShareFiles && (
						<button type="button" className={classNames(buttonClasses, 'flex-1 bg-color-gray-300 text-color-gray-25 border border-color-gray-50')} onClick={handleShare}>
							Share
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default ModalShareForest;
