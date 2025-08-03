import classNames from 'classnames';
import ModalChangeCardImage from './ModalChangeCardImage';
import Icon from '../../../components/Icon';
import { useState } from 'react';

const CardImage = ({ cardType, imageSrc, page }) => {
	const [hoverImage, setHoverImage] = useState(false);
	const [showModalChangeCardImage, setShowModalChangeCardImage] = useState(false);

	return (
		<div>
			<div className="font-bold mb-1">{cardType}</div>
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
					className={classNames('cursor-pointer max-h-[250px]', hoverImage && 'opacity-50')}
				/>
			</div>

			<ModalChangeCardImage
				{...{
					showModal: showModalChangeCardImage,
					setShowModal: setShowModalChangeCardImage,
					cardType: cardType.toLowerCase(),
					page,
				}}
			/>
		</div>
	);
};

export default CardImage;
