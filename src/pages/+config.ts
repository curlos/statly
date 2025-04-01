import vikeReact from 'vike-react/config';

export default {
	ssr: false,
	extends: [vikeReact],
	redirects: {
		"/signup": "/login"
	}
};
