import { baseAPI } from '../api';

interface ImportCategoryResult {
	created: number;
	modified: number;
	matched: number;
	failed: number;
	errors: string[];
}

interface ImportResponse {
	summary: {
		totalCreated: number;
		totalModified: number;
		totalMatched: number;
		totalFailed: number;
	};
	details: {
		focusRecords: ImportCategoryResult;
		tasks: ImportCategoryResult;
		projects: ImportCategoryResult;
		projectGroups: ImportCategoryResult;
		userSettings: ImportCategoryResult;
		customImages: ImportCategoryResult;
		customImageFolders: ImportCategoryResult;
	};
	errors?: string[];
}

export const importApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		importBackupData: builder.mutation<ImportResponse, File[]>({
			query: (files: File[]) => {
				const formData = new FormData();
				files.forEach((file) => {
					formData.append('fileToImport', file);
				});

				return {
					url: '/import/backup',
					method: 'POST',
					body: formData,
				};
			},
			// Note: Tags will NOT be invalidated automatically now
			// The caller must manually invalidate after all chunks complete
		}),
	}),
	overrideExisting: false,
});

export const { useImportBackupDataMutation } = importApi;
