import { useRef, useEffect } from 'react';

const useDebouncedCallback = <TArgs extends unknown[], TReturn>(
	callback: (...args: TArgs) => TReturn,
	delay: number,
	onlyForKeyboard = false
): ((...args: TArgs) => void) => {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const usingKeyboard = useRef(false);

	useEffect(() => {
		if (!onlyForKeyboard) return;
		const onKeyDown = () => { usingKeyboard.current = true; };
		const onMouseDown = () => { usingKeyboard.current = false; };
		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('mousedown', onMouseDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('mousedown', onMouseDown);
		};
	}, [onlyForKeyboard]);

	return (...args: TArgs) => {
		if (onlyForKeyboard && !usingKeyboard.current) {
			callback(...args);
			return;
		}
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => callback(...args), delay);
	};
};

export default useDebouncedCallback;
