import ProgressBar from '../ProgressBar';
import classNames from 'classnames';

interface ProgressBarListProps {
	data: Array<any>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({ data, fromModal, setIsOpen }) => {
	const sortedData = data.sort((a, b) => b.percentage - a.percentage);
	const maxDataLen = fromModal ? sortedData.length : 5;

	return (
		<div className="space-y-4 w-full p-2">
			<div className={classNames('space-y-4', fromModal && 'max-h-[500px] overflow-auto gray-scrollbar')}>
				{sortedData.slice(0, maxDataLen).map((item) => (
					<ProgressBar key={item.name} item={item} fromModal={fromModal} />
				))}
			</div>

			{!fromModal && (
				<div
					className="text-color-gray-100 cursor-pointer text-[16px] lg:text-[14px] xl:text-[16px]"
					onClick={() => setIsOpen(true)}
				>
					View More
				</div>
			)}
		</div>
	);
};

export default ProgressBarList;
