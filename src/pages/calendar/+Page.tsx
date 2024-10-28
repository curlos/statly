import { CalendarProvider } from '../../contexts/useCalendarContext';
import CalendarPage from '../CalendarPage/CalendarPage';

export const Page = () => {
	return (
		<CalendarProvider>
			<CalendarPage />
		</CalendarProvider>
	);
};
