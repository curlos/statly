import classNames from 'classnames';
import React from 'react';

interface CustomRadioButtonProps {
	label: string;
	name: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	customLabelClass?: string;
	customOuterCircleClasses: string;
	customInnerCircleClasses: string;
	customOuterCircleBorderColorClasses: string;
	customInnerCircleBgColorClasses: string;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
	label,
	name,
	checked,
	onChange,
	customLabelClass,
	customOuterCircleClasses,
	customInnerCircleClasses,
	customOuterCircleBorderColorClasses,
	customInnerCircleBgColorClasses,
}) => {
	return (
		<label className={classNames('flex items-center cursor-pointer', customLabelClass)}>
			<input
				type="radio"
				name={name}
				value={name}
				checked={checked}
				onChange={onChange}
				className="hidden" // hides the default radio button
			/>
			<div
				className={classNames(
					`border bg-color-gray-600 rounded-full w-[13px] h-[13px] flex items-center justify-center mr-2`,
					customOuterCircleClasses ? customOuterCircleClasses : '',
					customOuterCircleBorderColorClasses ? customOuterCircleBorderColorClasses : 'border-color-gray-100'
				)}
			>
				{checked && (
					<div
						className={classNames(
							'rounded-full w-[7px] h-[7px]',
							customInnerCircleClasses ? customInnerCircleClasses : '',
							customInnerCircleBgColorClasses ? customInnerCircleBgColorClasses : 'bg-color-gray-100'
						)}
					></div>
				)}
			</div>
			{label}
		</label>
	);
};

export default CustomRadioButton;
