import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import type { PlacedTree } from './forestLayout';

// A press that moves less than this many pixels and ends within this many milliseconds counts as a tap or click, not a drag.
const TAP_MAX_MOVE = 8;
const TAP_MAX_DURATION_MS = 600;

export interface ForestViewState {
	scale: number;
	x: number;
	y: number;
	fitScale: number;
	hasUserMoved: boolean;
}

export type HoveredTree = { tree: PlacedTree; x: number; y: number } | null;

interface UseForestGesturesOptions {
	viewRef: MutableRefObject<ForestViewState>;
	canvasRef: MutableRefObject<HTMLCanvasElement | null>;
	scheduleDraw: () => void;
	findTreeAtPoint: (x: number, y: number) => PlacedTree | null;
	setHoveredTree: (hovered: HoveredTree) => void;
	onOpenTree?: (tree: PlacedTree) => void;
}

// Moving and zooming the forest with the mouse wheel, a mouse drag, one finger or two, and telling a tap from a drag.
export const useForestGestures = ({ viewRef, canvasRef, scheduleDraw, findTreeAtPoint, setHoveredTree, onOpenTree }: UseForestGesturesOptions) => {
	// Every finger or mouse button currently pressed on the canvas, so one pointer can pan and two can pinch
	const pointersRef = useRef(new Map<number, { x: number; y: number }>());
	const tapRef = useRef<{ x: number; y: number; time: number; moved: boolean } | null>(null);
	const lastTappedKeyRef = useRef<string | null>(null);

	// React's onWheel is passive, and zooming needs to stop the page from scrolling.
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();
			const view = viewRef.current;
			const bounds = canvas.getBoundingClientRect();
			const cursorX = event.clientX - bounds.left;
			const cursorY = event.clientY - bounds.top;
			const maxScale = Math.max(3, view.fitScale * 3);
			const newScale = Math.min(maxScale, Math.max(view.fitScale * 0.8, view.scale * Math.exp(-event.deltaY * 0.002)));

			view.x = cursorX - ((cursorX - view.x) / view.scale) * newScale;
			view.y = cursorY - ((cursorY - view.y) / view.scale) * newScale;
			view.scale = newScale;
			view.hasUserMoved = true;
			setHoveredTree(null);
			scheduleDraw();
		};

		canvas.addEventListener('wheel', handleWheel, { passive: false });
		return () => canvas.removeEventListener('wheel', handleWheel);
	}, [canvasRef, viewRef, setHoveredTree, scheduleDraw]);

	const getPointInCanvas = (event: React.PointerEvent<HTMLCanvasElement>) => {
		const bounds = event.currentTarget.getBoundingClientRect();
		return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
		// Only the main button counts. A right click or a Ctrl-click opens a menu and may never send a release, which would leave the forest stuck to the mouse.
		if (event.pointerType === 'mouse' && (event.button !== 0 || event.ctrlKey)) return;

		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// The pointer can already be gone, which only means there is nothing to capture.
		}

		pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
		tapRef.current = pointersRef.current.size === 1 ? { x: event.clientX, y: event.clientY, time: Date.now(), moved: false } : null;

		// On touch the details stay until the finger starts dragging, so a second tap on the same tree can open its day.
		if (event.pointerType === 'mouse') setHoveredTree(null);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
		const pointers = pointersRef.current;
		const previous = pointers.get(event.pointerId);

		// Only a mouse can move without being pressed, and that is hovering.
		if (!previous) {
			if (event.pointerType !== 'mouse') return;
			const { x, y } = getPointInCanvas(event);
			const tree = findTreeAtPoint(x, y);
			setHoveredTree(tree ? { tree, x, y } : null);
			return;
		}

		const view = viewRef.current;
		const bounds = event.currentTarget.getBoundingClientRect();
		const pointersBefore = [...pointers.values()];
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

		const tap = tapRef.current;
		if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TAP_MAX_MOVE) tap.moved = true;
		if (tap?.moved || pointers.size > 1) {
			setHoveredTree(null);
			lastTappedKeyRef.current = null;
		}

		if (pointers.size === 1) {
			view.x += event.clientX - previous.x;
			view.y += event.clientY - previous.y;
		} else if (pointers.size === 2) {
			// Two fingers: the forest follows the point between them and grows or shrinks with the distance between them.
			const [oldFirst, oldSecond] = pointersBefore;
			const [newFirst, newSecond] = [...pointers.values()];
			const oldDistance = Math.hypot(oldFirst.x - oldSecond.x, oldFirst.y - oldSecond.y) || 1;
			const newDistance = Math.hypot(newFirst.x - newSecond.x, newFirst.y - newSecond.y);
			const oldCenter = { x: (oldFirst.x + oldSecond.x) / 2 - bounds.left, y: (oldFirst.y + oldSecond.y) / 2 - bounds.top };
			const newCenter = { x: (newFirst.x + newSecond.x) / 2 - bounds.left, y: (newFirst.y + newSecond.y) / 2 - bounds.top };

			const maxScale = Math.max(3, view.fitScale * 3);
			const newScale = Math.min(maxScale, Math.max(view.fitScale * 0.8, (view.scale * newDistance) / oldDistance));
			const worldX = (oldCenter.x - view.x) / view.scale;
			const worldY = (oldCenter.y - view.y) / view.scale;
			view.x = newCenter.x - worldX * newScale;
			view.y = newCenter.y - worldY * newScale;
			view.scale = newScale;
		} else {
			return;
		}

		view.hasUserMoved = true;
		scheduleDraw();
	};

	const handlePointerEnd = (event: React.PointerEvent<HTMLCanvasElement>) => {
		const tap = tapRef.current;
		const wasOnlyPointer = pointersRef.current.size === 1;
		pointersRef.current.delete(event.pointerId);
		tapRef.current = null;

		const isTap = event.type === 'pointerup' && tap && !tap.moved && wasOnlyPointer && Date.now() - tap.time <= TAP_MAX_DURATION_MS;
		if (!isTap) return;

		const { x, y } = getPointInCanvas(event);
		const tree = findTreeAtPoint(x, y);

		if (event.pointerType === 'mouse') {
			if (tree) onOpenTree?.(tree);
			return;
		}

		// On touch, a first tap shows a tree's details and a second tap on the same tree opens its day.
		if (tree && lastTappedKeyRef.current === tree.key) {
			onOpenTree?.(tree);
			return;
		}
		lastTappedKeyRef.current = tree ? tree.key : null;
		setHoveredTree(tree ? { tree, x, y } : null);
	};

	// Forgets the last tapped tree, so a tap after the trees change starts over
	const resetTap = useCallback(() => {
		lastTappedKeyRef.current = null;
	}, []);

	return { handlePointerDown, handlePointerMove, handlePointerEnd, resetTap };
};
