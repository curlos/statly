import classNames from 'classnames';
import ModalChangeCardImage from './ModalChangeCardImage';
import Icon from '../../components/Icon';
import { useState } from 'react';
import LazyImage from '../../components/LazyImage';
import { toTitleCase } from '../../utils/helpers.utils';

interface CardImageProps {
	cardType: string;
	imageSrc: string;
	page: string;
	showGlow?: boolean;
}

const CardImage: React.FC<CardImageProps> = ({ cardType, imageSrc, page, showGlow = false }) => {
	const [hoverImage, setHoverImage] = useState(false);
	const [showModalChangeCardImage, setShowModalChangeCardImage] = useState(false);

	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<h3 className={page !== 'focus-records' && page !== 'completed-tasks' ? 'text-[20px] font-bold' : ''}>
					{toTitleCase(cardType)} - Card Image
				</h3>
				<Icon name="image" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<button
				type="button"
				aria-label={`Change ${toTitleCase(cardType)} card image`}
				className="relative bg-transparent border-0 p-0 cursor-pointer w-fit focus-visible:outline-none focus-visible:after:content-[''] focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:border-2 focus-visible:after:border-white focus-visible:after:pointer-events-none"
				onMouseOver={() => setHoverImage(true)}
				onMouseLeave={() => setHoverImage(false)}
				onClick={() => setShowModalChangeCardImage(!showModalChangeCardImage)}
			>
				{hoverImage && (
					<div className="absolute inset-0 flex justify-center items-center" aria-hidden="true">
						<Icon name="edit" customClass="!text-[25px] text-color-gray-100" />
					</div>
				)}
				<LazyImage
					src={imageSrc}
					className={classNames(
						'cursor-pointer',
						hoverImage && 'opacity-50',
						page === 'focus-records' || page === 'completed-tasks' ? 'max-w-[150px]' : 'max-h-[250px]'
					)}
					showGlow={showGlow}
				/>
			</button>

			<ModalChangeCardImage
				{...{
					showModal: showModalChangeCardImage,
					setShowModal: setShowModalChangeCardImage as (show: boolean) => void,
					cardType: cardType.toLowerCase() as 'focus' | 'tasks' | 'background',
					page: page as 'challenges' | 'medals' | 'focus-records' | 'completed-tasks',
					imageSrc,
				}}
			/>
		</div>
	);
};

export default CardImage;
