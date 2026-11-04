import { useMemo } from 'react';
import { useGetCustomImageFoldersQuery } from '../services/resources/customImageFoldersApi';

// Hook to get custom folder names (GENERAL first, then alphabetically). Skipping it means nothing is fetched.
export const useCustomFolderNames = (skip = false) => {
	const { data: customFolders } = useGetCustomImageFoldersQuery(undefined, { skip });

	return useMemo(() => {
		if (!customFolders || customFolders.length === 0) return ['GENERAL'];
		const folderNames = customFolders.map(f => f.name);
		const otherFolders = folderNames.filter(name => name !== 'GENERAL').sort();
		return ['GENERAL', ...otherFolders];
	}, [customFolders]);
};
