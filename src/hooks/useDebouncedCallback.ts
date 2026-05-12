import { useRef } from 'react';

const useDebouncedCallback = <TArgs extends unknown[], TReturn>(
	callback: (...args: TArgs) => TReturn,
	delay: number
): ((...args: TArgs) => void) => {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	return (...args: TArgs) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => callback(...args), delay);
	};
};

export default useDebouncedCallback;
