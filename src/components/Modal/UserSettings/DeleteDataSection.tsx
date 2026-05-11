import { useState } from 'react';
import classNames from 'classnames';
import Icon from '../../Icon';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { useGetDocumentCountsQuery } from '../../../services/resources/userSettingsApi';
import {
	useDeleteFocusRecordsMutation,
	useDeleteTasksMutation,
	useDeleteProjectsMutation,
	useDeleteProjectGroupsMutation,
	useDeleteAllDocumentsMutation
} from '../../../services/resources/deleteApi';

type DeleteCategory = 'focusRecords' | 'tasks' | 'projects' | 'projectGroups' | 'all';

const DeleteDataSection = () => {
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [deleteCategory, setDeleteCategory] = useState<DeleteCategory | null>(null);

	const { data: documentCounts } = useGetDocumentCountsQuery(undefined);
	const [deleteFocusRecords, { isLoading: isDeletingFocusRecords }] = useDeleteFocusRecordsMutation();
	const [deleteTasks, { isLoading: isDeletingTasks }] = useDeleteTasksMutation();
	const [deleteProjects, { isLoading: isDeletingProjects }] = useDeleteProjectsMutation();
	const [deleteProjectGroups, { isLoading: isDeletingProjectGroups }] = useDeleteProjectGroupsMutation();
	const [deleteAllDocuments, { isLoading: isDeletingAll }] = useDeleteAllDocumentsMutation();

	const isDeleting =
		isDeletingFocusRecords || isDeletingTasks || isDeletingProjects || isDeletingProjectGroups || isDeletingAll;

	const handleDeleteClick = (category: DeleteCategory) => {
		setDeleteCategory(category);
		setConfirmModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!deleteCategory) return;

		try {
			switch (deleteCategory) {
				case 'focusRecords':
					await deleteFocusRecords(undefined).unwrap();
					break;
				case 'tasks':
					await deleteTasks(undefined).unwrap();
					break;
				case 'projects':
					await deleteProjects(undefined).unwrap();
					break;
				case 'projectGroups':
					await deleteProjectGroups(undefined).unwrap();
					break;
				case 'all':
					await deleteAllDocuments(undefined).unwrap();
					break;
			}

			setConfirmModalOpen(false);
			setDeleteCategory(null);
		} catch (error) {
			console.error('Error deleting documents:', error);
		}
	};

	const getCounts = () => {
		if (!deleteCategory || !documentCounts) return {};

		if (deleteCategory === 'all') {
			return {
				focusRecords: documentCounts.focusRecords,
				tasks: documentCounts.tasks,
				projects: documentCounts.projects,
				projectGroups: documentCounts.projectGroups
			};
		}

		return {
			[deleteCategory]: documentCounts[deleteCategory]
		};
	};

	const getModalTitle = () => {
		switch (deleteCategory) {
			case 'focusRecords':
				return 'Delete All Focus Records?';
			case 'tasks':
				return 'Delete All Tasks?';
			case 'projects':
				return 'Delete All Projects?';
			case 'projectGroups':
				return 'Delete All Project Groups?';
			case 'all':
				return 'Delete All Documents?';
			default:
				return 'Confirm Deletion';
		}
	};

	const deleteButtons = [
		{
			id: 'focusRecords' as DeleteCategory,
			label: 'Delete All Focus Records',
			icon: 'timer'
		},
		{
			id: 'tasks' as DeleteCategory,
			label: 'Delete All Tasks',
			icon: 'check_circle'
		},
		{
			id: 'projects' as DeleteCategory,
			label: 'Delete All Projects',
			icon: 'folder'
		},
		{
			id: 'projectGroups' as DeleteCategory,
			label: 'Delete All Project Groups',
			icon: 'folder_open'
		}
	];

	return (
		<div>
			<p className="text-color-gray-100 mb-4">
				Delete your data by category. This action cannot be undone.
			</p>

			<div className="space-y-3">
				{deleteButtons.map((button) => (
					<button
						key={button.id}
						type="button"
						className={classNames(
							'flex items-center gap-3 p-3 rounded cursor-pointer border border-color-gray-600 w-full text-left',
							'hover:bg-red-600/20'
						)}
						onClick={() => handleDeleteClick(button.id)}
					>
						<Icon
							name={button.icon}
							fill={0}
							customClass="!text-[20px] text-red-500"
						/>
						<div className="flex-1">
							<div className="text-color-gray-50">{button.label}</div>
							{documentCounts && (
								<div className="text-sm text-color-gray-100">
									{documentCounts[button.id]?.toLocaleString() || 0} documents
								</div>
							)}
						</div>
					</button>
				))}

				<button
					type="button"
					className={classNames(
						'flex items-center gap-3 p-3 rounded cursor-pointer border-2 border-red-600 bg-red-600/10 w-full text-left',
						'hover:bg-red-600/20'
					)}
					onClick={() => handleDeleteClick('all')}
				>
					<Icon
						name="delete_forever"
						fill={0}
						customClass="!text-[20px] text-red-500"
					/>
					<div className="flex-1">
						<div className="text-red-500 font-semibold">Delete All Documents</div>
						<div className="text-sm text-color-gray-100">
							Delete all focus records, tasks, projects, and project groups
						</div>
					</div>
				</button>
			</div>

			<ModalConfirmDelete
				isOpen={confirmModalOpen}
				onClose={() => {
					setConfirmModalOpen(false);
					setDeleteCategory(null);
				}}
				onConfirm={handleConfirmDelete}
				title={getModalTitle()}
				counts={getCounts()}
				isDeleting={isDeleting}
			/>
		</div>
	);
};

export default DeleteDataSection;
