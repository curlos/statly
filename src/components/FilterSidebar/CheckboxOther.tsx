import classNames from 'classnames';
import Icon from '../Icon';

const CheckboxOther = ({
	userSettings,
	userSettingProperty,
	name,
	showValue,
	handleError,
	editUserSettings,
	chosenColorObj,
	nextLightestColorObj,
}) => {
	return (
		<div
			className="flex gap-1 cursor-pointer"
			onClick={() => {
				const newShowValue = !showValue;

				const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;

				handleError(async () => {
					const payload = {
						tickTickOne: {
							pages: {
								focusRecords: {
									...restOfFocusRecordsKeysAndVals,
									[userSettingProperty]: newShowValue,
								},
							},
						},
					};

					await editUserSettings(payload).unwrap();
				});
			}}
		>
			<Icon
				name={showValue ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj.hover.textColor)}
			/>
			<div>{name}</div>
		</div>
	);
};

export default CheckboxOther;
