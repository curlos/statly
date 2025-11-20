import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getCommaSeparatedObj } from '../../utils/focus-apps/helpers.utils';

export const useHandleEmotionTagClick = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const emotionsFromUrl = searchParams.get('emotions');
	const emotionsByName = getCommaSeparatedObj(emotionsFromUrl);

	const handleEmotionTagClick = (emotionId: string, multiSelect: boolean = false) => {
		if (!multiSelect) {
			// Single select mode: only set the clicked emotion
			updateQueryParams({ emotions: emotionId, page: '' });
			return;
		}

		// Multi-select mode: toggle the emotion in the existing array
		const updatedEmotions = { ...emotionsByName };

		if (updatedEmotions[emotionId]) {
			updatedEmotions[emotionId] = false;
		} else {
			updatedEmotions[emotionId] = true;
		}

		const selectedEmotions = Object.keys(updatedEmotions).filter(key => updatedEmotions[key]);
		updateQueryParams({ emotions: selectedEmotions.join(','), page: '' });
	};

	return { handleEmotionTagClick };
};
