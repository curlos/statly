import classNames from 'classnames';
import { EMOTIONS } from '../utils/constants/constants.utils';

interface EmotionObject {
	emotion: string;
	score: number;
}

interface EmotionTagProps {
	emotionObj: EmotionObject;
	onClick?: () => void;
	showBorder?: boolean;
	showScore?: boolean;
	count?: number;
}

const EmotionTag = ({ emotionObj, onClick, showScore = false, count }: EmotionTagProps) => {
	const emotionData = EMOTIONS[emotionObj.emotion as keyof typeof EMOTIONS];

	if (!emotionData) {
		return null;
	}

	const formattedScore = (emotionObj.score * 100).toFixed(0);

	return (
		<div className="bg-gray-800 rounded-full">
			<div
				onClick={onClick}
				className={classNames(
					'px-3 py-1 text-[14px] text-[#ffffff] rounded-full transition-opacity border border-color-gray-25',
					emotionData.bg,
					onClick && 'cursor-pointer hover:opacity-80',
				)}
			>
				{emotionData.name}
				{showScore && ` - ${formattedScore}%`}
				{count !== undefined && ` - ${count.toLocaleString()}x`}
			</div>
		</div>
	);
};

export default EmotionTag;
