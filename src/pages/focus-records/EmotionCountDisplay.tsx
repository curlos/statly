import EmotionTag from '../../components/EmotionTag';
import { useHandleEmotionTagClick } from './useHandleEmotionTagClick';

interface EmotionCountDisplayProps {
	emotionCounts: Record<string, number>;
}

const EmotionCountDisplay = ({ emotionCounts }: EmotionCountDisplayProps) => {
	const { buildEmotionUrl } = useHandleEmotionTagClick();

	if (!emotionCounts || Object.keys(emotionCounts).length === 0) {
		return null;
	}

	// Sort emotions by count (descending) and then by name
	const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => {
		if (b[1] !== a[1]) {
			return b[1] - a[1]; // Sort by count descending
		}
		return a[0].localeCompare(b[0]); // Then by name alphabetically
	});

	return (
		<div className="container mb-4 pt-1">
			<div className="flex flex-wrap gap-2">
				{sortedEmotions.map(([emotion, count]) => (
					<EmotionTag
						key={emotion}
						emotionObj={{ emotion, score: 0 }}
						count={count}
						href={buildEmotionUrl(emotion)}
					/>
				))}
			</div>
		</div>
	);
};

export default EmotionCountDisplay;
