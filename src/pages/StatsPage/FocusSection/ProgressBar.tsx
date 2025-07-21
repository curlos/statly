import classNames from 'classnames';

const ProgressBar = ({ item, fromModal = false }) => {
	return (
		<div>
			<div className="flex justify-between items-center mb-1 w-full">
				<div
					className={classNames(
						!fromModal
							? 'truncate w-[150px] xs:w-[200px] sm:w-[150px] md:w-[200px] lg:w-[110px] xl:w-[200px]'
							: 'truncate w-[150px] xs:w-[200px] sm:w-[150px] md:w-[350px] break-words',
						'text-[14px] md:text-[16px] lg:text-[14px] xl:text-[16px]'
					)}
				>
					{item.name}
				</div>
				<div className="text-[14px] md:text-[16px] lg:text-[14px] xl:text-[16px] text-[#8C8C8C] truncate">
					{item.value} • {item.percentage}%
				</div>
			</div>
			<div key={item.name} className="rounded-full dark:bg-[#232323]">
				<div
					className={`text-xs font-medium text-blue-100 text-center p-[3px] leading-none rounded-full`}
					style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
