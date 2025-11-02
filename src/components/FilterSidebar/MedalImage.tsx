import classNames from 'classnames';
import CardImage from '../../pages/challenges/CardImage';
import CustomRadioButton from '../CustomRadioButton';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import Icon from '../Icon';

const MedalImage = () => {
	const {
		focusRecordsPageSettings: { selectedMedalImage, medalImageSizePx, showMedalGlow },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const medalImageSizeOptions = [
		{
			name: 'Small (60px)',
			px: 60,
		},
		{
			name: 'Medium (100px)',
			px: 100,
		},
		{
			name: 'Large (150px)',
			px: 150,
		},
	];

	const { chosenColorObj } = useThemeContext();

	return (
		<div>
			<CardImage cardType="Medal Image" imageSrc={selectedMedalImage} page={'focus-records'} showGlow={showMedalGlow} />

			<div className="space-y-1 mt-2">
				{medalImageSizeOptions.map((imageSizeOption) => {
					return (
						<CustomRadioButton
							key={imageSizeOption.name + 'radio'}
							label={imageSizeOption.name}
							name={imageSizeOption.name}
							checked={imageSizeOption.px === medalImageSizePx}
							onChange={() => {
								handleUpdateUserSettingForPage('focusRecords', 'medalImageSizePx', imageSizeOption.px);
							}}
							customOuterCircleClasses={classNames('!w-[20px] !h-[20px]')}
							customInnerCircleClasses={classNames('!w-[10px] !h-[10px]')}
							customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
							customInnerCircleBgColorClasses={chosenColorObj.bgColor}
						/>
					);
				})}
			</div>

			<div
				className="flex items-center gap-1 mt-2 cursor-pointer ml-6"
				onClick={() => {
					handleUpdateUserSettingForPage('focusRecords', 'showMedalGlow', !showMedalGlow);
				}}
			>
				<Icon
					name={showMedalGlow ? 'check_box' : 'check_box_outline_blank'}
					fill={1}
					customClass={classNames('!text-[22px]', chosenColorObj.textColor)}
				/>
				<div>Show Medal Glow</div>
			</div>
		</div>
	);
};

export default MedalImage;
