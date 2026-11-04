import { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import Icon from '../../Icon';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { useGetDocumentCountsQuery } from '../../../services/resources/userSettingsApi';
import {
	useDeleteFocusRecordsMutation,
	useDeleteTasksMutation,
	useDeleteProjectsMutation,
	useDeleteProjectGroupsMutation,
	useDeleteAllDocumentsMutation,
} from '../../../services/resources/deleteApi';
import { useDeleteAccountMutation } from '../../../services/resources/usersApi';
import { handleLogout } from '../../../utils/logout.utils';

type DeleteCategory = 'focusRecords' | 'tasks' | 'projects' | 'projectGroups' | 'all' | 'account';

const DeleteDataSection = () => {
	const dispatch = useDispatch();
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [deleteCategory, setDeleteCategory] = useState<DeleteCategory | null>(null);
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const { data: documentCounts } = useGetDocumentCountsQuery(undefined);
	const [deleteFocusRecords, { isLoading: isDeletingFocusRecords }] = useDeleteFocusRecordsMutation();
	const [deleteTasks, { isLoading: isDeletingTasks }] = useDeleteTasksMutation();
	const [deleteProjects, { isLoading: isDeletingProjects }] = useDeleteProjectsMutation();
	const [deleteProjectGroups, { isLoading: isDeletingProjectGroups }] = useDeleteProjectGroupsMutation();
	const [deleteAllDocuments, { isLoading: isDeletingAll }] = useDeleteAllDocumentsMutation();
	const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

	const isDeleting =
		isDeletingFocusRecords ||
		isDeletingTasks ||
		isDeletingProjects ||
		isDeletingProjectGroups ||
		isDeletingAll ||
		isDeletingAccount;

	const closeModal = () => {
		setConfirmModalOpen(false);
		setDeleteCategory(null);
		setPassword('');
		setPasswordError('');
	};

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
				case 'account':
					await deleteAccount({ password }).unwrap();
					handleLogout(dispatch);
					return;
			}

			closeModal();
		} catch (error) {
			if (deleteCategory === 'account') {
				const err = error as { data?: { message?: string } };
				setPasswordError(err?.data?.message || 'Failed to delete account');
				return;
			}
			console.error('Error deleting documents:', error);
		}
	};

	const getCounts = () => {
		if (!deleteCategory || !documentCounts) return {};

		if (deleteCategory === 'all' || deleteCategory === 'account') {
			return {
				focusRecords: documentCounts.focusRecords,
				tasks: documentCounts.tasks,
				projects: documentCounts.projects,
				projectGroups: documentCounts.projectGroups,
			};
		}

		return {
			[deleteCategory]: documentCounts[deleteCategory],
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
			case 'account':
				return 'Do you want to delete your account?';
			default:
				return 'Confirm Deletion';
		}
	};

	const deleteButtons = [
		{
			id: 'focusRecords' as DeleteCategory,
			label: 'Delete All Focus Records',
			icon: 'timer',
		},
		{
			id: 'tasks' as DeleteCategory,
			label: 'Delete All Tasks',
			icon: 'check_circle',
		},
		{
			id: 'projects' as DeleteCategory,
			label: 'Delete All Projects',
			icon: 'folder',
		},
		{
			id: 'projectGroups' as DeleteCategory,
			label: 'Delete All Project Groups',
			icon: 'folder_open',
		},
	];

	return (
		<div>
			<p className="text-color-gray-100 mb-4">Delete your data by category. This action cannot be undone.</p>

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
						<Icon name={button.icon} fill={0} customClass="!text-[20px] text-red-500" />
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
					<Icon name="delete_forever" fill={0} customClass="!text-[20px] text-red-500" />
					<div className="flex-1">
						<div className="text-red-500 font-semibold">Delete All Documents</div>
						<div className="text-sm text-color-gray-100">
							Delete all focus records, tasks, projects, and project groups
						</div>
					</div>
				</button>

				<div className="border-t border-color-gray-600 pt-3">
					<button
						type="button"
						className={classNames(
							'flex items-center gap-3 p-3 rounded cursor-pointer border-2 border-red-600 bg-red-600/10 w-full text-left',
							'hover:bg-red-600/20'
						)}
						onClick={() => handleDeleteClick('account')}
					>
						<Icon name="person_remove" fill={0} customClass="!text-[20px] text-red-500" />
						<div className="flex-1">
							<div className="text-red-500 font-semibold">Delete Account</div>
							<div className="text-sm text-color-gray-100">
								Permanently delete your account and all of its data
							</div>
						</div>
					</button>
				</div>
			</div>

			<ModalConfirmDelete
				isOpen={confirmModalOpen}
				onClose={closeModal}
				onConfirm={handleConfirmDelete}
				title={getModalTitle()}
				counts={getCounts()}
				isDeleting={isDeleting}
				isConfirmDisabled={deleteCategory === 'account' && !password}
			>
				{deleteCategory === 'account' && (
					<div className="mb-6">
						<input
							type="password"
							aria-label="Password"
							placeholder="Enter your password to confirm"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setPasswordError('');
							}}
							className="w-full text-[16px] p-2 bg-color-gray-600 rounded-lg border border-color-gray-100 outline-none"
						/>
						{passwordError && (
							<p role="alert" className="text-red-500 mt-1">
								{passwordError}
							</p>
						)}
					</div>
				)}
			</ModalConfirmDelete>
		</div>
	);
};

export default DeleteDataSection;
