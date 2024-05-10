import { Sharp, default as sharp } from "sharp";
import { buffer } from "stream/consumers";
import { calc } from "./calc";
import { pos, draw_line } from "./modules";

async function createImage() {
	//点の座標
	const plot_coordinate = [pos.create(10, 50), pos.create(30, 20), pos.create(70, 35), pos.create(90, 90)];
	//次元数
	const dimensions_num = plot_coordinate.length - 1;
	//分割数
	const divisions_num = plot_coordinate.length * 3; //1~3辺りが良さそう

	const img = sharp({ create: { width: 100, height: 100, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } });

	const metadata = await img.metadata();
	const info = { raw: { width: metadata.width!, height: metadata.height!, channels: metadata.channels! } };

	let buffer = await img.toBuffer();

	for (let i in [...Array(plot_coordinate.length - 1)]) {
		const index = Number(i);
		const pos1 = plot_coordinate[index];
		const pos2 = plot_coordinate[index + 1];
		buffer = draw_line(buffer, info.raw, pos1, pos2);
	}

	const points = calc(plot_coordinate, dimensions_num, divisions_num);

	console.log("points:");
	console.log(points);

	for (let i in [...Array(points.length - 1)]) {
		const index = Number(i);
		const pos1 = points[index];
		const pos2 = points[index + 1];
		buffer = draw_line(buffer, info.raw, pos1, pos2, { r: 255, g: 0, b: 0, a: 150 });
	}
	sharp(buffer, info).toFile(__dirname + "/output.png");
}

createImage();
