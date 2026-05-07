import Icon from '../Icon';

const CookieInstructions = () => {
	return (
		<div className="bg-color-gray-600 rounded-lg p-4 space-y-4">
			<div className="flex items-center gap-2">
				<Icon name="warning" fill={1} customClass="!text-[20px] text-yellow-400" />
				<h4 className="font-bold text-[16px]">How to Get Your TickTick Cookie</h4>
			</div>

			<div className="space-y-3 text-[14px] text-color-gray-25">
				<div className="flex gap-2">
					<span className="font-bold text-white">1.</span>
					<div>
						Go to{' '}
						<a
							href="https://ticktick.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:underline"
						>
							TickTick
						</a>{' '}
						and log in
					</div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">2.</span>
					<div>
						Press <kbd className="px-2 py-1 bg-color-gray-700 rounded text-xs">F12</kbd> (or{' '}
						<kbd className="px-2 py-1 bg-color-gray-700 rounded text-xs">Cmd+Option+I</kbd> on Mac) to open DevTools
					</div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">3.</span>
					<div>Click the <strong className="text-white">Network</strong> tab at the top</div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">4.</span>
					<div>Refresh the page</div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">5.</span>
					<div>Click on any request to <code className="px-1.5 py-0.5 bg-color-gray-700 rounded text-xs">api.ticktick.com</code></div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">6.</span>
					<div>In the right panel, find the <strong className="text-white">Request Headers</strong> section</div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">7.</span>
					<div>Find the <code className="px-1.5 py-0.5 bg-color-gray-700 rounded text-xs">Cookie:</code> header and copy its entire value</div>
				</div>

				<div className="flex gap-2">
					<span className="font-bold text-white">8.</span>
					<div>Paste the cookie into the Cookie input above and click "Update TickTick Cookie""</div>
				</div>
			</div>

			<div className="pt-2 border-t border-color-gray-500">
				<div className="flex items-start gap-2 text-xs text-color-gray-25">
					<Icon name="lock" fill={1} customClass="!text-[14px] mt-0.5" />
					<div>
						Your cookie is sensitive data that grants access to your TickTick account. It's stored securely
						in your user settings and never share it publicly.
					</div>
				</div>
			</div>
		</div>
	);
};

export default CookieInstructions;
