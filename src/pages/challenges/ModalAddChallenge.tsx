import { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal/Modal';

const ModalAddChallenge = ({ showAddChallengeModal, setShowAddChallengeModal }) => {
	const editingExistingChallenge = true;

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	return (
		<Modal isOpen={showAddChallengeModal} onClose={() => setShowAddChallengeModal(false)} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-600 p-3">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[20px]">
						{editingExistingChallenge ? 'Edit Challenge' : 'Create Challenge'}
					</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setShowAddChallengeModal(false)}
					/>
				</div>
				<div className="max-h-[800px] overflow-auto gray-scrollbar p-3">
					<div className="relative group cursor-pointer">
						<div className="absolute top-[40%] left-[47%] hidden group-hover:block">
							<Icon name="edit" customClass={'!text-[32px] text-white cursor-pointer flex-1'} />
						</div>
						<img src="/mg_strike_rouge_small.jpg" className="aspect-[4/1] group-hover:opacity-[40%]" />
					</div>

					<div className="flex items-center gap-3 mt-3 ">
						<div className="w-[80px]">Name</div>

						<div className="flex-1">
							<CustomInput
								value={name}
								placeholder="Name"
								setValue={setName}
								customClasses="!text-left p-[6px] px-3"
							/>
						</div>
					</div>

					<div className="flex items-center gap-3 mt-3 ">
						<div className="w-[80px]">Description</div>

						<div className="flex-1">
							<CustomInput
								value={description}
								placeholder="Description"
								setValue={setDescription}
								customClasses="!text-left p-[6px] px-3"
							/>
						</div>
					</div>

					<div className="flex items-center gap-3 mt-3 ">
						<div className="w-[80px]">Deadline</div>

						<div className="flex-1">
							<CustomInput
								value={description}
								placeholder="Description"
								setValue={setDescription}
								customClasses="!text-left p-[6px] px-3"
							/>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddChallenge;
