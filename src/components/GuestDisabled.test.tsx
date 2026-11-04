import { describe, expect, it } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import userReducer, { selectIsGuest } from '../slices/userSlice';
import GuestDisabled from './GuestDisabled';

const makeToken = (payload: object) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

const makeStore = (token: string | null) =>
	configureStore({
		reducer: { user: userReducer },
		preloadedState: { user: { user: null, token, isLoggedIn: !!token } },
	});

const render = (token: string | null) =>
	renderToStaticMarkup(
		<Provider store={makeStore(token)}>
			<GuestDisabled>
				<button type="button">Delete Record</button>
			</GuestDisabled>
		</Provider>
	);

describe('GuestDisabled', () => {
	it('fades and disables what is inside it for a guest, but still shows it', () => {
		const html = render(makeToken({ userId: '1', isGuest: true }));

		expect(html).toContain('<fieldset disabled=""');
		expect(html).toContain('opacity-50');
		expect(html).toContain('cursor-not-allowed');
		expect(html).toContain('Delete Record');
		// What GuestTooltip looks for to say why it's turned off, and the children ignoring the mouse so the fieldset is what's hovered
		expect(html).toContain('data-guest-disabled');
		expect(html).toContain('[&amp;_*]:pointer-events-none');
	});

	it('does nothing for a normal account', () => {
		const html = render(makeToken({ userId: '1' }));

		expect(html).toBe('<button type="button">Delete Record</button>');
	});
});

describe('selectIsGuest', () => {
	it('is true only for a guest token', () => {
		expect(selectIsGuest(makeStore(makeToken({ isGuest: true })).getState() as never)).toBe(true);
		expect(selectIsGuest(makeStore(makeToken({ userId: '1' })).getState() as never)).toBe(false);
		expect(selectIsGuest(makeStore(null).getState() as never)).toBe(false);
	});
});
