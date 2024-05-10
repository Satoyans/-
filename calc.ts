export function calc(points: { x: number; y: number }[], dimensions: number, divisions: number) {
	const t_increment = 1 / divisions;
	let t = 0;
	const return_list: { x: number; y: number }[] = [];
	for (let div in [...Array(divisions)]) {
		let split: { x: number; y: number }[][] = [];
		split.push(points);
		for (let dim in [...Array(dimensions)]) {
			//中間点保存用のリストを追加
			let previous_points = split[split.length - 1];
			split.push([]);
			for (let i in [...Array(previous_points.length - 1)]) {
				//前回の点をループ
				const index = Number(i);

				const point = previous_points[index];
				const next_point = previous_points[index + 1];

				const x = Math.round(point.x + (next_point.x - point.x) * t);
				const y = Math.round(point.y + (next_point.y - point.y) * t);
				split[split.length - 1].push({ x, y });
			}
		}
		return_list.push(...split[split.length - 1]);
		t += t_increment;
	}
	return_list.push(points[points.length - 1]);
	return return_list;
}
/*
divisions(分割)
dimensions(次元)

t = 0
分割数回繰り返す => tを増やす
 次元回繰り返す
  ポイントごとに中間点を取る

*/
