import HabitDetails from '../../HabitDetails/HabitDetails';
import Modal from '../Modal';

const ModalHabitDetails: React.FC = ({ isOpen, setIsOpen, habitId }) => {
	return (
		<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} position="top-center">
			<div className="rounded-xl shadow-lg">
				<HabitDetails fromModal={true} habitId={habitId} />
			</div>
		</Modal>
	);
};

export default ModalHabitDetails;
