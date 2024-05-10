export class pos {
	static create(x: number, y: number) {
		return { x, y };
	}
}

export function draw_line(
	img: Buffer,
	img_data: { width: number; height: number; channels: number },
	pos1: { x: number; y: number },
	pos2: { x: number; y: number },
	color = { r: 0, g: 0, b: 0, a: 255 },
	recursive = false //falseならx軸,trueならy軸方向に描画
) {
	const x_diff = pos2.x - pos1.x;
	const y_diff = pos2.y - pos1.y;
	let a: number, b: number;
	if (!recursive) {
		a = x_diff === 0 ? 1 : y_diff / x_diff;
		b = pos1.y - a * pos1.x;
	} else {
		a = y_diff === 0 ? 1 : x_diff / y_diff;
		b = pos1.x - a * pos1.y;
	}

	const x_min = Math.min(...[pos1.x, pos2.x]);
	const x_max = Math.max(...[pos1.x, pos2.x]);
	const y_min = Math.min(...[pos1.y, pos2.y]);
	const y_max = Math.max(...[pos1.y, pos2.y]);

	for (let i in [...Array(img_data.width)]) {
		let x: number, y: number;
		if (!recursive) {
			x = Number(i);
			y = Math.round(a * x + b);
		} else {
			y = Number(i);
			x = Math.round(a * y + b);
		}

		if (y < 0 || img_data.height + 1 < y) continue;
		if (x < x_min || x_max + 1 < x) continue;
		if (y < y_min || y_max + 1 < y) continue;

		const base_pos = (y * img_data.width + x) * 4;
		const alpha = color.a / 255;
		img[base_pos + 0] = Math.round(img[base_pos + 0] * (1 - alpha) + color.r * alpha);
		img[base_pos + 1] = Math.round(img[base_pos + 1] * (1 - alpha) + color.g * alpha);
		img[base_pos + 2] = Math.round(img[base_pos + 2] * (1 - alpha) + color.b * alpha);
	}
	if (!recursive) img = draw_line(img, img_data, pos1, pos2, color, true);
	return img;
}
