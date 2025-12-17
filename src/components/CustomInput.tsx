import classNames from 'classnames';
import { useThemeContext } from '../contexts/useThemeContext';

interface CustomInputProps {
	type?: string;
	placeholder?: string;
	min?: number;
	max?: number;
	value: string | number;
	setValue: React.Dispatch<React.SetStateAction<string | number>>;
	customClasses?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
				'text-center text-[16px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 resize-none outline-none rounded',
				chosenColorObj.focus.outlineColor,
				customClasses
			)}
			placeholder={placeholder ? placeholder : ''}
			value={value}
			onChange={
				onChange
					? onChange
					: (e) => {
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
