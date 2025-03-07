/**
 * 角度からラジアンに変換
 *
 * @param {number} deg
 * @returns {number}
 */
const deg2rad = (deg) => deg * (Math.PI / 180);

/**
 * ラジアンから角度に変換
 *
 * @param {number} rad
 * @returns {number}
 */
const rad2deg = (rad) => rad * (180 / Math.PI);

/**
 * 角度と高さから底辺を計算
 *
 * @param {number} degree
 * @param {number} opposite
 * @returns {number}
 */
const getAdjacentFromDegreeAndOpposite = (degree, opposite) => {
	return opposite / Math.tan(degree);
};

/**
 * 角度と高さから斜辺を計算
 *
 * @param {number} degree
 * @param {number} opposite
 * @returns {number}
 */
const getHypotenuseFromDegreeAndOpposite = (degree, opposite) => {
	return opposite / Math.sin(degree);
};

/**
 * 角度と斜辺から底辺を計算
 *
 * @param {number} degree
 * @param {number} hypotenuse
 * @returns {number}
 */
const getAdjacentFromDegreeAndHypotenuse = (degree, hypotenuse) => {
	return hypotenuse * Math.cos(degree);
};

/**
 * 角度と底辺から高さを計算
 *
 * @param {number} degree
 * @param {number} adjacent
 * @returns {number}
 */
const getOppositeFromDegreeAndAdjacent = (degree, adjacent) => {
	return adjacent * Math.tan(degree);
};

/**
 * 角度と斜辺から高さを計算
 *
 * @param {number} degree
 * @param {number} hypotenuse
 * @returns {number}
 */
const getOppositeFromDegreeAndHypotenuse = (degree, hypotenuse) => {
	return hypotenuse * Math.sin(degree);
};

/**
 * 角度と底辺から斜辺を計算
 *
 * @param {number} degree
 * @param {number} adjacent
 * @returns {number}
 */
const getHypotenuseFromDegreeAndAdjacent = (degree, adjacent) => {
	return adjacent / Math.cos(degree);
};

/**
 * 底辺と高さから角度を計算
 *
 * @param {number} adjacent
 * @param {number} opposite
 * @param {boolean} degree
 * @returns {number}
 */
const getDegreeFromAdjacentAndOpposite = (adjacent, opposite, degree = true) => {
	const rad = Math.atan(opposite / adjacent);
	return (degree) ? rad2deg(rad) : rad;
};

/**
 * 底辺と高さから斜辺を計算
 *
 * @param {number} adjacent
 * @param {number} opposite
 * @returns {number}
 */
const getHypotenuseFromAdjacentAndOpposite = (adjacent, opposite) => {
	return Math.sqrt(adjacent ** 2 + opposite ** 2);
};

/**
 * 底辺と斜辺から角度を計算
 *
 * @param {number} adjacent
 * @param {number} hypotenuse
 * @param {boolean} degree
 * @returns {number}
 */
const getDegreeFromAdjacentAndHypotenuse = (adjacent, hypotenuse, degree = true) => {
	const rad = Math.acos(adjacent / hypotenuse);
	return (degree) ? rad2deg(rad) : rad;
};

/**
 * 底辺と斜辺から高さを計算
 *
 * @param {number} adjacent
 * @param {number} hypotenuse
 * @returns {number}
 */
const getOppositeFromAdjacentAndHypotenuse = (adjacent, hypotenuse) => {
	return Math.sqrt(hypotenuse ** 2 - adjacent ** 2);
};

/**
 * 高さと斜辺から角度を計算
 *
 * @param {number} opposite
 * @param {number} hypotenuse
 * @param {boolean} degree
 * @returns {number}
 */
const getDegreeFromOppositeAndHypotenuse = (opposite, hypotenuse, degree = true) => {
	const rad = Math.asin(opposite / hypotenuse);
	return (degree) ? rad2deg(rad) : rad;
};

/**
 * 高さと斜辺から底辺を計算
 *
 * @param {number} opposite
 * @param {number} hypotenuse
 * @returns {number}
 */
const getAdjacentFromOppositeAndHypotenuse = (opposite, hypotenuse) => {
	return Math.sqrt(hypotenuse ** 2 - opposite ** 2);
};

/**
 * 三角形の三辺から高さや3つの角度を計算 (
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {{a: number, b: number, c: number, degAB: number, degBC: number, h: number, degAC: number}|null}
 */
const getTriangleDetailFromThreeSides = (a, b, c) => {

	const s = (a + b + c) / 2;
	const S = Math.sqrt(s * (s - a) * (s - b) * (s - c));

	let h, degAB, degAC, degBC;

	if(a >= b && a >= c){
		if(a !== Math.sqrt(b ** 2 + c ** 2))
			return null;

		h = 2 * S / a;
		degAB = Math.asin(h / b);
		degAC = Math.asin(h / c);
		degBC = 180 - degAB - degAC;
	} else if(b >= a && b >= c){
		if(b !== Math.sqrt(a ** 2 + c ** 2))
			return null;

		h = 2 * S / b;
		degAB = Math.asin(h / a);
		degBC = Math.asin(h / c);
		degAC = 180 - degAB - degBC;
	} else if(c >= a && c >= b){
		if(c !== Math.sqrt(b ** 2 + c ** 2))
			return null;

		h = 2 * S / c;
		degAC = Math.asin(h / a);
		degBC = Math.asin(h / b);
		degAB = 180 - degAC - degBC;
	} else{
		return null;
	}

	if(isNaN(degAB) || isNaN(degAC) || isNaN(degBC))
		return null;

	return {
		'a': a,
		'b': b,
		'c': c,
		'h': h,
		'degAB': degAB,
		'degAC': degAC,
		'degBC': degBC
	};
};
