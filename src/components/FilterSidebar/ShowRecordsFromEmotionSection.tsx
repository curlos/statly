import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getCommaSeparatedObj } from '../../utils/helpers.utils';
import { EMOTIONS } from '../../utils/constants/constants.utils';
import EmotionTag from '../EmotionTag';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import { useHandleEmotionTagClick } from '../../pages/focus-records/useHandleEmotionTagClick';

const ShowRecordsFromEmotionSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const { searchParams } = useSearchParamsContext();
	const emotionsFromUrl = searchParams.get('emotions');
	const emotionsByName = getCommaSeparatedObj(emotionsFromUrl ?? undefined);
	const { handleEmotionTagClick } = useHandleEmotionTagClick();

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Show Records From Emotion</h3>
						<Icon
							name="favorite"
							fill={1}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
					</div>
				}
				openByDefault={true}
				setIsOpenForParent={undefined}
				isChildDropdownOpen={false}
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				{Object.values(EMOTIONS).map((emotion) => {
					const isChecked = emotionsByName[emotion.id];

					return (
						<div
							key={emotion.id}
							className="flex items-center gap-2 cursor-pointer mb-2"
							onClick={() => handleEmotionTagClick(emotion.id, true)}
						>
							<Icon
								name={isChecked ? 'check_box' : 'check_box_outline_blank'}
								fill={1}
								customClass={classNames('!text-[22px]', chosenColorObj.textColor, (nextLightestColorObj || chosenColorObj).hover.textColor)}
							/>
							<EmotionTag
								emotionObj={{ emotion: emotion.id, score: 0 }}
							/>
						</div>
					);
				})}
			</Accordion>
		</div>
	);
};

export default ShowRecordsFromEmotionSection;
