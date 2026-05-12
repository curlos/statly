import classNames from 'classnames';
import { EMOTIONS } from '../utils/constants/constants.utils';

interface EmotionObject {
	emotion: string;
	score: number;
}

interface EmotionTagProps {
	emotionObj: EmotionObject;
	href?: string;
	showBorder?: boolean;
	showScore?: boolean;
	count?: number;
}

const EmotionTag = ({ emotionObj, href, showScore = false, count }: EmotionTagProps) => {
	const emotionData = EMOTIONS[emotionObj.emotion as keyof typeof EMOTIONS];

	if (!emotionData) {
		return null;
	}

	const formattedScore = (emotionObj.score * 100).toFixed(0);

	const sharedClasses = classNames(
		'px-3 py-1 text-[14px] text-[#ffffff] rounded-full transition-opacity border border-color-gray-25',
		emotionData.bg,
		href && 'cursor-pointer hover:opacity-80',
	);

	const content = (
		<>
			{emotionData.name}
			{showScore && ` - ${formattedScore}%`}
			{count !== undefined && ` - ${count.toLocaleString()}x`}
		</>
	);

	return (
		<div className="bg-gray-800 rounded-full">
			{href ? (
				<a href={href} className={sharedClasses}>
					{content}
				</a>
			) : (
				<div className={sharedClasses}>
					{content}
				</div>
			)}
		</div>
	);
};

export default EmotionTag;
