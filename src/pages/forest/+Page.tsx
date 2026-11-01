import Forest from './Forest';
import Navbar from '../../components/Navbar/Navbar';
import AppliedFilterItemList from '../focus-records/AppliedFilterItemList';

export default function Page() {
	return (
		<div className="min-h-screen bg-color-gray-700">
			<div className="flex flex-col min-h-screen">
				<div className="w-full">
					<Navbar page="forest-page" showFilterSidebarIcon={true} showSettingsIcon={true} />

					<div className="container mt-2 hidden lg:block">
						<AppliedFilterItemList />
					</div>
				</div>

				<main id="main-content" tabIndex={-1} className="flex-1 flex flex-col container py-4 outline-none">
					<h1 className="sr-only">Forest</h1>
					<Forest />
				</main>
			</div>
		</div>
	);
}
