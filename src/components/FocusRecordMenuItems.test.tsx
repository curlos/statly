import { describe, expect, it, jest } from '@jest/globals';
import { renderToStaticMarkup } from 'react-dom/server';
import FocusRecordMenuItems from './FocusRecordMenuItems';

// The icon pulls in the app's font loading, which these tests have no use for
jest.mock('./Icon', () => ({ __esModule: true, default: () => null }));

const noop = () => undefined;

const render = (menuItems: React.ComponentProps<typeof FocusRecordMenuItems>['menuItems']) =>
	renderToStaticMarkup(<FocusRecordMenuItems menuItems={menuItems} />);

describe('FocusRecordMenuItems', () => {
	it("shows an item that's turned off for guests, but not natively disabled so the hover message can show", () => {
		const html = render([{ icon: 'delete', label: 'Delete Record', onClick: noop, guestDisabled: true }]);

		expect(html).toContain('Delete Record');
		expect(html).toContain('aria-disabled="true"');
		expect(html).toContain('data-guest-disabled');
		expect(html).toContain('cursor-not-allowed');
		expect(html).not.toContain(' disabled=""');
	});

	it("doesn't blame the demo for an item that's disabled for another reason", () => {
		const html = render([{ icon: 'content_copy', label: 'Copy Note', onClick: noop, disabled: true }]);

		expect(html).toContain(' disabled=""');
		expect(html).not.toContain('data-guest-disabled');
		expect(html).not.toContain('aria-disabled');
	});

	it('leaves normal items alone', () => {
		const html = render([{ icon: 'content_copy', label: 'Copy Focus Record', onClick: noop }]);

		expect(html).not.toContain('disabled');
		expect(html).not.toContain('data-guest-disabled');
	});
});
