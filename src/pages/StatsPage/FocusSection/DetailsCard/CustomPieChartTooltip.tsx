const CustomPieChartTooltip = ({ active, payload }) => {
	if (active && payload?.length > 0) {
		const dataItem = payload[0].payload.payload;
		const { name, value, color, percentage } = dataItem;

		return (
			<div className="bg-color-gray-600 border border-color-gray-50 rounded p-2 flex items-center gap-2">
				<div>
					<div style={{ backgroundColor: color }} className="w-[10px] h-[10px] rounded-full" />
				</div>
				<div>
					{name}, {value} ({percentage}%)
				</div>
			</div>
		);
	}
};

export default CustomPieChartTooltip;
