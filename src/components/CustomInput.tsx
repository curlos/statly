import classNames from 'classnames';
import { useThemeContext } from '../contexts/useThemeContext';

interface CustomInputProps {
	type?: string;
	placeholder?: string;
	min?: number;
	max?: number;
	value: any;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	customClasses?: string;
	onChange?: any;
	required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
	type,
	placeholder,
	min,
	max,
	value,
	setValue,
	onChange,
	customClasses,
	required,
}) => {
	const { chosenColorObj } = useThemeContext();

	return (
		<input
			type={type || 'text'}
			className={classNames(
				'text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded',
				chosenColorObj.focus.outlineColor,
				customClasses
			)}
			placeholder={placeholder ? placeholder : ''}
			value={value}
			onChange={
				onChange
					? onChange
					: (e) => {
							// if (isNaN(e.target.value)) {
							// 	setValue(e.target.value);
							// } else {
							// 	setValue(Number(e.target.value));
							// }
							setValue(e.target.value);
						}
			}
			min={type === 'number' ? min : undefined}
			max={type === 'number' ? max : undefined}
			required={required}
		/>
	);
};

export default CustomInput;
