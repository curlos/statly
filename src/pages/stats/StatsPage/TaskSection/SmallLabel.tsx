import classNames from 'classnames';

const SmallLabel = ({ data, fromDropdown = false, onClick }) => {
	const { name, value, color } = data;

	return (
		<div
			className="flex items-center gap-2 hover:underline cursor-pointer"
			onClick={() => {
				if (onClick) {
					onClick(data);
				}
			}}
		>
			<div
				className="w-[15px] h-[15px] rounded-full"
				style={{
					backgroundColor: color,
				}}
			></div>
			<div className="w-[45px]">{value.toLocaleString()}</div>
			<div className={classNames('border-l border-color-gray-100 pl-2 w-[200px]', !fromDropdown && 'truncate')}>
				{name}
			</div>
		</div>
	);
};

export default SmallLabel;
