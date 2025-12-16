import { useEffect, useRef } from 'react';

// This hook now takes an additional parameter `setState` which is the state setter function for updating dimensions
const useResizeObserver = (
	ref: React.RefObject<HTMLElement>,
	setState: (value: number | Record<string, number>) => void,
	dimensions: string | string[] = 'width'
) => {
	const observer = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		observer.current = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (Array.isArray(dimensions)) {
					const newState: Record<string, number> = {};

					for (const dimension of dimensions) {
						const computedStyle = getComputedStyle(entry.target);
						const size = parseFloat(computedStyle[dimension as keyof CSSStyleDeclaration] as string);
						newState[dimension] = size;
					}

					setState(newState);
				} else {
					const computedStyle = getComputedStyle(entry.target);
					const size = parseFloat(computedStyle[dimensions as keyof CSSStyleDeclaration] as string);
					setState(size);
				}
			}
		});

		const currentRef = ref.current;
		if (currentRef && observer.current) {
			observer.current.observe(currentRef);
		}

		return () => {
			if (observer.current && currentRef) {
				observer.current.disconnect();
			}
		};
	}, [ref, setState, dimensions]);

	return observer.current;
};

export default useResizeObserver;
