const exportCsv = (filename, plotData) => {
	if (!plotData?.length) return;

	const hasX = plotData.some((d) => Array.isArray(d.x) && d.x.length > 0);
	let csv = "";

	if (hasX) {
		const xValues = plotData.find((d) => Array.isArray(d.x))?.x ?? [];
		const headers = ["x", ...plotData.map((d, i) => d.title || `Series ${i + 1}`)];
		csv += `${headers.join(",")}\n`;
		for (let i = 0; i < xValues.length; i++) {
			const row = [xValues[i], ...plotData.map((d) => d.y?.[i] ?? "")];
			csv += `${row.map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v)).join(",")}\n`;
		}
	} else {
		const maxLen = Math.max(...plotData.map((d) => d.y?.length ?? 0));
		const headers = plotData.map((d, i) => d.title || `Series ${i + 1}`);
		csv += `${headers.join(",")}\n`;
		for (let i = 0; i < maxLen; i++) {
			csv += `${plotData.map((d) => d.y?.[i] ?? "").join(",")}\n`;
		}
	}

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${filename}.csv`;
	a.click();
	URL.revokeObjectURL(url);
};

export default exportCsv;
