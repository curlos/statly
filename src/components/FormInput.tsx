import { useThemeContext } from '../contexts/useThemeContext';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps {
	id: string;
	type: string;
	placeholder: string;
	register: UseFormRegisterReturn;
	error?: FieldError;
	rightElement?: React.ReactNode;
}

const FormInput = ({ id, type, placeholder, register, error, rightElement }: FormInputProps) => {
	const { colorMode } = useThemeContext();
	return (
		<div>
			<label htmlFor={id} className="block mb-1 text-[14px] text-color-gray-25">{placeholder}</label>
			<div className={`flex items-center gap-2 ${colorMode === 'dark' ? 'bg-color-gray-200' : 'bg-color-gray-700'} rounded-xl p-2 border border-color-gray-100`}>
				<input
					id={id}
					type={type}
					aria-describedby={error ? `${id}-error` : undefined}
					aria-invalid={!!error}
					{...register}
					className="w-full text-[16px] p-1 bg-transparent mb-0 w-full resize-none outline-none rounded"
				/>
				{rightElement}
			</div>
			{error && <p id={`${id}-error`} role="alert" className="text-red-500 mt-1">{error.message}</p>}
		</div>
	);
};

export default FormInput;
