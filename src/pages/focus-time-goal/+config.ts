import vikeReact from 'vike-react/config';

export default {
	// TODO: Possibly make this an SSR page again in the future. It's just TOO SLOW as an SSR page at the moment to use without some sort of visual loading indicator.
	ssr: false,
	extends: [vikeReact],
};
