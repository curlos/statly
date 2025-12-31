import { useContext } from 'react';
import { ApplyDefaultDateRangeContext } from './ApplyDefaultDateRangeContext';

export const useApplyDefaultDateRangeContext = () => {
	const context = useContext(ApplyDefaultDateRangeContext);
	if (!context) {
		throw new Error('useApplyDefaultDateRangeContext must be used within ApplyDefaultDateRangeProvider');
	}
	return context;
};
