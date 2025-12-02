import Modal from './Modal';

interface ModalConfirmDeleteProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	counts: {
		focusRecords?: number;
		tasks?: number;
		projects?: number;
		projectGroups?: number;
	};
	isDeleting: boolean;
	showCounts?: boolean;
}

const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	counts,
	isDeleting,
	showCounts = true
}) => {
	const hasMultipleCategories = Object.keys(counts).length > 1;

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[500px]">
			<div className="bg-color-gray-700 rounded-lg p-6">
				<h3 className="text-xl font-semibold mb-4">{title}</h3>

				{showCounts && (
					<div className="mb-6">
						<p className="text-color-gray-100 mb-3">
							{hasMultipleCategories ? 'Deleting:' : `Deleting ${Object.values(counts)[0]?.toLocaleString()} documents`}
						</p>

						{hasMultipleCategories && (
							<ul className="space-y-2 text-color-gray-100">
								{counts.focusRecords !== undefined && (
									<li>- {counts.focusRecords.toLocaleString()} focus records</li>
								)}
								{counts.tasks !== undefined && (
									<li>- {counts.tasks.toLocaleString()} tasks</li>
								)}
								{counts.projects !== undefined && (
									<li>- {counts.projects.toLocaleString()} projects</li>
								)}
								{counts.projectGroups !== undefined && (
									<li>- {counts.projectGroups.toLocaleString()} project groups</li>
								)}
							</ul>
						)}
					</div>
				)}

				<p className="text-red-500 mb-6 font-medium">
					This action cannot be undone!
				</p>

				<div className="flex gap-3 justify-end">
					<button
						onClick={onClose}
						disabled={isDeleting}
						className="px-4 py-2 bg-color-gray-600 hover:bg-color-gray-500 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={isDeleting}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isDeleting ? 'Deleting...' : 'Confirm Delete'}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalConfirmDelete;
