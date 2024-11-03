// @ts-nocheck
import { renderPage } from 'vike/server';

// We use JSDoc instead of TypeScript because Vercel seems buggy with /api/**/*.ts files

/**
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
	const { url } = req;
	console.log('Request to url:', url);
	if (url === undefined) throw new Error('req.url is undefined');

	const pageContextInit = { urlOriginal: url };
	const pageContext = await renderPage(pageContextInit);
	const { httpResponse } = pageContext;

	if (!httpResponse) {
		res.statusCode = 404;
		res.end();
		return;
	}

	const { body, statusCode, headers } = httpResponse;

	console.log(body);
	res.statusCode = statusCode;
	headers.forEach(([name, value]) => res.setHeader(name, value));
	res.end(body);
}
