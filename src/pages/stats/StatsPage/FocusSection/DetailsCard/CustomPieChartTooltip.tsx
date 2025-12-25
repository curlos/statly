import { getFormattedDuration } from "../../../../../utils/helpers.utils";

interface TooltipPayloadItem {
	payload: {
		payload: {
			name?: string;
			value?: number;
			duration?: number;
			count?: number;
			color?: string;
			percentage?: number;
		};
	};
}

interface CustomPieChartTooltipProps {
	active?: boolean;
	payload?: TooltipPayloadItem[];
}

const CustomPieChartTooltip: React.FC<CustomPieChartTooltipProps> = ({ active, payload }) => {
	if (active && payload && payload.length > 0) {
		const dataItem = payload[0].payload.payload;
		const { name, value, duration, count, color, percentage } = dataItem;

		// Format display value based on data type
		let displayValue: string | number;
		if (duration !== undefined) {
			displayValue = getFormattedDuration(duration, false);
		} else if (count !== undefined) {
			displayValue = `${count.toLocaleString()} tasks`;
		} else {
			displayValue = value || 0;
		}

		return (
			<div className="bg-color-gray-600 border border-color-gray-50 rounded p-2 flex items-center gap-2">
				<div>
					<div style={{ backgroundColor: color }} className="w-[10px] h-[10px] rounded-full" />
				</div>
				<div>
					{name}, {displayValue} ({percentage}%)
				</div>
			</div>
		);
	}

	return null;
};

export default CustomPieChartTooltip;
