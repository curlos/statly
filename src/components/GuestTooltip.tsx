import { useEffect, useState } from 'react';
import { GUEST_DISABLED_ATTRIBUTE, GUEST_DISABLED_MESSAGE, getGuestTooltipPosition } from '../utils/guest.utils';

// Shows why something is turned off while the mouse is over anything marked as disabled for guests. One of these in the page covers every such control. The browser's own hover text isn't used because it doesn't show over disabled buttons.
const GuestTooltip: React.FC = () => {
	const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			const isOverDisabled = (event.target as Element | null)?.closest?.(`[${GUEST_DISABLED_ATTRIBUTE}]`);
			setMouse(isOverDisabled ? { x: event.clientX, y: event.clientY } : null);
		};
		const handleMouseOut = (event: MouseEvent) => {
			if (!event.relatedTarget) {
				setMouse(null);
			}
		};
		const hide = () => setMouse(null);

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseout', handleMouseOut);
		document.addEventListener('scroll', hide, true);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseout', handleMouseOut);
			document.removeEventListener('scroll', hide, true);
		};
	}, []);

	if (!mouse) {
		return null;
	}

	const { left, top } = getGuestTooltipPosition(mouse.x, mouse.y, window.innerWidth);

	return (
		<div
			role="tooltip"
			style={{ left, top }}
			className="ui-theme-tooltip fixed pointer-events-none z-[100000] max-w-[240px] px-3 py-2 bg-color-gray-300 border border-color-gray-50 text-white text-sm rounded"
		>
			{GUEST_DISABLED_MESSAGE}
		</div>
	);
};

export default GuestTooltip;
