import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => {
	return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
	const calendar = useTheme();
	return <ThemeContext.Provider value={calendar}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
	const [bgColorKey, setBgColorKey] = useState('red-500');

	return {
		'/ticktick-1.00/focus-records': {
			bgColorKey,
			setBgColorKey,
			cssStyles: {
				'blue-500': {
					textColor: 'text-blue-500',
					bgColor: 'bg-blue-500/50',
					borderColor: 'border-blue-500',
				},
				'emerald-500': {
					textColor: 'text-emerald-500',
					bgColor: 'bg-emerald-500/50',
					borderColor: 'border-emerald-500',
				},
				'red-500': {
					textColor: 'text-red-500',
					bgColor: 'bg-red-500/50',
					borderColor: 'border-red-500',
				},
				'slate-500': {
					textColor: 'text-slate-500',
					bgColor: 'bg-slate-500/50',
					borderColor: 'border-slate-500',
				},
				'gray-500': {
					textColor: 'text-gray-500',
					bgColor: 'bg-gray-500/50',
					borderColor: 'border-gray-500',
				},
				'zinc-500': {
					textColor: 'text-zinc-500',
					bgColor: 'bg-zinc-500/50',
					borderColor: 'border-zinc-500',
				},
				'neutral-500': {
					textColor: 'text-neutral-500',
					bgColor: 'bg-neutral-500/50',
					borderColor: 'border-neutral-500',
				},
				'stone-500': {
					textColor: 'text-stone-500',
					bgColor: 'bg-stone-500/50',
					borderColor: 'border-stone-500',
				},
				'orange-500': {
					textColor: 'text-orange-500',
					bgColor: 'bg-orange-500/50',
					borderColor: 'border-orange-500',
				},
				'amber-500': {
					textColor: 'text-amber-500',
					bgColor: 'bg-amber-500/50',
					borderColor: 'border-amber-500',
				},
				'yellow-500': {
					textColor: 'text-yellow-500',
					bgColor: 'bg-yellow-500/50',
					borderColor: 'border-yellow-500',
				},
				'lime-500': {
					textColor: 'text-lime-500',
					bgColor: 'bg-lime-500/50',
					borderColor: 'border-lime-500',
				},
				'green-500': {
					textColor: 'text-green-500',
					bgColor: 'bg-green-500/50',
					borderColor: 'border-green-500',
				},
				'teal-500': {
					textColor: 'text-teal-500',
					bgColor: 'bg-teal-500/50',
					borderColor: 'border-teal-500',
				},
				'cyan-500': {
					textColor: 'text-cyan-500',
					bgColor: 'bg-cyan-500/50',
					borderColor: 'border-cyan-500',
				},
				'sky-500': {
					textColor: 'text-sky-500',
					bgColor: 'bg-sky-500/50',
					borderColor: 'border-sky-500',
				},
				'indigo-500': {
					textColor: 'text-indigo-500',
					bgColor: 'bg-indigo-500/50',
					borderColor: 'border-indigo-500',
				},
				'violet-500': {
					textColor: 'text-violet-500',
					bgColor: 'bg-violet-500/50',
					borderColor: 'border-violet-500',
				},
				'purple-500': {
					textColor: 'text-purple-500',
					bgColor: 'bg-purple-500/50',
					borderColor: 'border-purple-500',
				},
				'fuchsia-500': {
					textColor: 'text-fuchsia-500',
					bgColor: 'bg-fuchsia-500/50',
					borderColor: 'border-fuchsia-500',
				},
				'pink-500': {
					textColor: 'text-pink-500',
					bgColor: 'bg-pink-500/50',
					borderColor: 'border-pink-500',
				},
				'rose-500': {
					textColor: 'text-rose-500',
					bgColor: 'bg-rose-500/50',
					borderColor: 'border-rose-500',
				},
			},
		},
	};
};
