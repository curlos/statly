import Icon from './Icon';
import { useThemeContext } from '../contexts/useThemeContext';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps {
	id: string;
	type: string;
	placeholder: string;
	iconName: string;
	register: UseFormRegisterReturn;
	error?: FieldError;
}

const FormInput = ({ id, type, placeholder, iconName, register, error }: FormInputProps) => {
	const { colorMode } = useThemeContext();
	return (
		<div>
			<div className={`flex items-center gap-2 ${colorMode === 'dark' ? 'bg-color-gray-200' : 'bg-color-gray-700'} rounded-xl p-2 border border-color-gray-100`}>
				<Icon name={iconName} customClass={'!text-[20px] '} />
				<input
					id={id}
					type={type}
					placeholder={placeholder}
					{...register}
					className="w-full text-[16px] p-1 bg-transparent placeholder:text-color-gray-50 mb-0 w-full resize-none outline-none rounded"
				/>
			</div>
			{error && <p className="text-red-500 mt-1">{error.message}</p>}
		</div>
	);
};

export default FormInput;
