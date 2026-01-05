import classNames from 'classnames';
import Icon from '../Icon';
import Modal from './Modal';
import FormPickDateRange from '../FormPickDateRange';

interface ModalPickDateRangeProps {
	isModalOpen: boolean;
	setIsModalOpen: (open: boolean) => void;
	startDate: Date;
	setStartDate: React.Dispatch<React.SetStateAction<Date>>;
	endDate: Date;
	setEndDate: React.Dispatch<React.SetStateAction<Date>>;
}

const ModalPickDateRange: React.FC<ModalPickDateRangeProps> = ({
	isModalOpen,
	setIsModalOpen,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<Modal isOpen={isModalOpen} onClose={closeModal}  customClasses="!w-[350px] !max-h-[700px] !overflow-visible">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Custom</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<FormPickDateRange
						{...{
							startDate,
							setStartDate,
							endDate,
							setEndDate,
							onCancel: () => closeModal(),
							onConfirm: () => closeModal(),
						}}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default ModalPickDateRange;
