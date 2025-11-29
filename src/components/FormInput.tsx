import Icon from './Icon';

interface FormInputProps {
	id: string;
	type: string;
	placeholder: string;
	iconName: string;
	register: any;
	error?: any;
}

const FormInput = ({ id, type, placeholder, iconName, register, error }: FormInputProps) => {
	return (
		<div>
			<div className="flex items-center gap-2 bg-color-gray-200 rounded-xl p-2">
				<Icon name={iconName} customClass={'!text-[20px] '} />
				<input
					id={id}
					type={type}
					placeholder={placeholder}
					{...register}
					className="w-full text-[16px] p-1 bg-transparent placeholder:text-color-gray-100 mb-0 w-full resize-none outline-none rounded"
				/>
			</div>
			{error && <p className="text-red-500 mt-1">{error.message}</p>}
		</div>
	);
};

export default FormInput;
