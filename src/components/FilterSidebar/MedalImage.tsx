import classNames from 'classnames';
import CardImage from '../../pages/challenges/CardImage';
import CustomRadioButton from '../CustomRadioButton';
import CheckboxOther from './CheckboxOther';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';

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

	const handleMedalImageSizeChange = useDebouncedCallback((px: number) => {
		handleUpdateUserSettingForPage('focusRecords', 'medalImageSizePx', String(px));
	}, 500);

	return (
		<div>
			<CardImage cardType="Medal Image" imageSrc={selectedMedalImage} page={'focus-records'} showGlow={showMedalGlow} />

			<fieldset className="space-y-1 mt-2 border-0 p-0 m-0">
				<legend className="sr-only">Medal image size</legend>
				{medalImageSizeOptions.map((imageSizeOption) => {
					return (
						<CustomRadioButton
							key={imageSizeOption.name + 'radio'}
							label={imageSizeOption.name}
							name="medal-image-size"
							checked={imageSizeOption.px === medalImageSizePx}
							onChange={() => handleMedalImageSizeChange(imageSizeOption.px)}
							customOuterCircleClasses={classNames('!w-[20px] !h-[20px]')}
							customInnerCircleClasses={classNames('!w-[10px] !h-[10px]')}
							customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
							customInnerCircleBgColorClasses={chosenColorObj.bgColor}
						/>
					);
				})}
			</fieldset>

			<div className="ml-6 mt-2">
				<CheckboxOther
					name="Show Medal Glow"
					showValue={showMedalGlow}
					handleCheckboxClick={() => handleUpdateUserSettingForPage('focusRecords', 'showMedalGlow', !showMedalGlow)}
				/>
			</div>
		</div>
	);
};

export default MedalImage;
