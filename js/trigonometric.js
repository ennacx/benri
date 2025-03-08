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
const getAdjacentFromDegreeAndOpposite = (degree, opposite) =>
	opposite / Math.tan(deg2rad(degree));

/**
 * 角度と高さから斜辺を計算
 *
 * @param {number} degree
 * @param {number} opposite
 * @returns {number}
 */
const getHypotenuseFromDegreeAndOpposite = (degree, opposite) =>
	opposite / Math.sin(deg2rad(degree));

/**
 * 角度と斜辺から底辺を計算
 *
 * @param {number} degree
 * @param {number} hypotenuse
 * @returns {number}
 */
const getAdjacentFromDegreeAndHypotenuse = (degree, hypotenuse) =>
	hypotenuse * Math.cos(deg2rad(degree));

/**
 * 角度と底辺から高さを計算
 *
 * @param {number} degree
 * @param {number} adjacent
 * @returns {number}
 */
const getOppositeFromDegreeAndAdjacent = (degree, adjacent) =>
	adjacent * Math.tan(deg2rad(degree));

/**
 * 角度と斜辺から高さを計算
 *
 * @param {number} degree
 * @param {number} hypotenuse
 * @returns {number}
 */
const getOppositeFromDegreeAndHypotenuse = (degree, hypotenuse) =>
	hypotenuse * Math.sin(deg2rad(degree));

/**
 * 角度と底辺から斜辺を計算
 *
 * @param {number} degree
 * @param {number} adjacent
 * @returns {number}
 */
const getHypotenuseFromDegreeAndAdjacent = (degree, adjacent) =>
	adjacent / Math.cos(deg2rad(degree));

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
const getHypotenuseFromAdjacentAndOpposite = (adjacent, opposite) =>
	Math.sqrt(adjacent ** 2 + opposite ** 2);

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
const getOppositeFromAdjacentAndHypotenuse = (adjacent, hypotenuse) =>
	Math.sqrt(hypotenuse ** 2 - adjacent ** 2);

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
const getAdjacentFromOppositeAndHypotenuse = (opposite, hypotenuse) =>
	Math.sqrt(hypotenuse ** 2 - opposite ** 2);

/**
 * 三角形の三辺から高さや3つの角度を計算 (
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {boolean} strict
 * @returns {{a: number, b: number, c: number, h: number, deg_ab: number, deg_ac: number, deg_bc: number}|null}
 */
const getTriangleDetailFromThreeSides = (a, b, c, strict = false) => {

	const s = (a + b + c) / 2;
	const S = Math.sqrt(s * (s - a) * (s - b) * (s - c));

	let h, deg_ab, deg_ac, deg_bc, buff1, buff2;

	if(a >= b && a >= c){
		if(strict && a !== Math.sqrt(b ** 2 + c ** 2))
			return null;

		h = 2 * S / a;
		deg_ab = rad2deg(Math.asin(h / b));
		deg_ac = rad2deg(Math.asin(h / c));
		deg_bc = 180 - deg_ab - deg_ac;
	} else if(b >= a && b >= c){
		if(strict && b !== Math.sqrt(a ** 2 + c ** 2))
			return null;

		h = 2 * S / b;
		deg_ab = rad2deg(Math.asin(h / a));
		deg_bc = rad2deg(Math.asin(h / c));
		deg_ac = 180 - deg_ab - deg_bc;
	} else if(strict && c >= a && c >= b){
		if(c !== Math.sqrt(b ** 2 + c ** 2))
			return null;

		h = 2 * S / c;
		deg_ac = rad2deg(Math.asin(h / a));
		deg_bc = rad2deg(Math.asin(h / b));
		deg_ab = 180 - deg_ac - deg_bc;
	} else{
		return null;
	}

	if(isNaN(deg_ab) || isNaN(deg_ac) || isNaN(deg_bc))
		return null;

	return {
		'a': a,
		'b': b,
		'c': c,
		'h': h,
		'deg_ab': deg_ab,
		'deg_ac': deg_ac,
		'deg_bc': deg_bc
	};
};
