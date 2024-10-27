export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
	const response = await fetch('http://localhost:8888/ticktick-1.0/focus-records?last30Days=true');
	return response.json();
};
