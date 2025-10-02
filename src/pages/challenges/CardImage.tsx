import classNames from 'classnames';
import ModalChangeCardImage from './ModalChangeCardImage';
import Icon from '../../components/Icon';
import { useState } from 'react';

const CardImage = ({ cardType, imageSrc, page }) => {
	const [hoverImage, setHoverImage] = useState(false);
	const [showModalChangeCardImage, setShowModalChangeCardImage] = useState(false);

	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<h3 className={page !== 'focus-records' && page !== 'completed-tasks' ? 'text-[20px] font-bold' : ''}>
					{cardType}
				</h3>
				<Icon name="image" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<div
				className="relative"
				onMouseOver={() => setHoverImage(true)}
				onMouseLeave={() => setHoverImage(false)}
				onClick={() => setShowModalChangeCardImage(!showModalChangeCardImage)}
			>
				{hoverImage && (
					<div className="absolute inset-0 flex justify-center items-center">
						<Icon name="edit" customClass="!text-[30px] text-color-gray-100 cursor-pointer" />
					</div>
				)}
				<img
					src={imageSrc}
					className={classNames(
						'cursor-pointer',
						hoverImage && 'opacity-50',
						page === 'focus-records' || page === 'completed-tasks' ? 'max-w-[150px]' : 'max-h-[250px]'
					)}
				/>
			</div>

			<ModalChangeCardImage
				{...{
					showModal: showModalChangeCardImage,
					setShowModal: setShowModalChangeCardImage,
					cardType: cardType.toLowerCase(),
					page,
					imageSrc,
				}}
			/>
		</div>
	);
};

export default CardImage;
