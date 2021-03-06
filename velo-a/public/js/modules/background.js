"use strict";

// For safari support
let veloClass = " background_velo";
if (typeof WebKitNamespace !== 'undefined') {
	veloClass += " safari";
}

/**
 * Sliding background
 * @param {function} onStart
 * @param {function} onContinue
 * @param {[String] | null} slides
 */
export function slide(onStart, onContinue, slides) {

	velosSlide();
	nuagesSlide();

	let start = true;
	let i = 0;
	const batiment_return = document.getElementById("batiment_return");

	if (batiment_return) batiment_return.style.display = "none";
	document.querySelectorAll(".batiment_button").forEach((el) => {
		if (slides == null || slides[slides.length - 1] !== el.parentElement.id)
			el.addEventListener('click', () => {
				document.getElementById("batiment").className = "batiment_pause" + i;
				setTimeout(function () {
					document.getElementById("batiment").className = "batiment_move" + (++i);
					if (batiment_return) {
						if (i <= 0) batiment_return.style.display = "none";
						else {
							batiment_return.style.display = null;
							if (start) {
								onStart();
								start = false;
							}
						}
					}
				}, 50);

			});
	});
	if (batiment_return) {
		batiment_return.addEventListener('click', () => {
			document.getElementById("batiment").className = "batiment_pause" + i;
			setTimeout(function () {
				document.getElementById("batiment").className = "batiment_back" + (i--);
				if (i <= 0) {
					batiment_return.style.display = "none";
				}

				const el = document.querySelector(".show > .batiment_button");

				onContinue(el, slides, false);

			}, 50);
		});
	}

	document.querySelectorAll(".batiment_button").forEach((el, index, list) => {
		if (slides == null || el.parentElement.parentElement.id !== slides[0]) {
			el.parentElement.setAttribute("class", "hide_start");
		}
		if (slides == null || slides[slides.length - 1] !== el.parentElement.id)
			el.addEventListener("click", () => {
				onContinue(el, slides, true);
			});
	});

}

/**
 * Make "velos" slide
 */
function velosSlide() {

	_velosSlide([
		"src=\"img/velos/simple.svg\" alt=\"Vélo classique\"",
		"src=\"img/velos/elec.svg\" alt=\"Vélo électrique\"",
		"src=\"img/velos/bicloo.svg\" alt=\"Le bicloo\""
	], 0);
}

/**
 * Make "velos" slide
 * @param {[String]} velos
 * @param {number} i number of the "velo"
 * @private
 */
function _velosSlide(velos, i) {
	const time = Math.floor(Math.random() * 10000);
	setTimeout(function () {
		const rand = Math.round(Math.random() * 2);

		const background_velos = document.getElementById("background_velos");
		background_velos.insertAdjacentHTML('beforeend',
			"<img id='background_velo" + i + "' class='move" + Math.round(Math.random()) + veloClass +"' " + velos[rand] + "/>"
		);

		const img = background_velos.lastElementChild;
		setTimeout(function () {
			img.remove();
		}, 10000);
		_velosSlide(velos, ++i);
	}, time);
}

/**
 * Make "nuages" slide
 */
function nuagesSlide() {

	_nuagesSlide([
		'src="img/background/cloud1.svg" alt="Vélo classique"',
		'src="img/background/cloud2.svg" alt="Vélo électrique"'
	], 0);
}


/**
 * Make "velos" slide
 * @param {[String]} nuages
 * @param i number of the "nuage"
 * @private
 */
function _nuagesSlide(nuages, i) {
	const time = Math.floor(Math.random() * 20000);
	setTimeout(function () {
		const rand = Math.round(Math.random());

		const background_nuages = document.getElementById("background_nuages");
		background_nuages.insertAdjacentHTML('beforeend',
			"<img alt='nuage' id='background_nuage" + i + "' "
			+ "class='background_nuage move" + Math.round(Math.random())
			+ "' " + nuages[rand]
			+ "/>"
		);

		const img = background_nuages.lastElementChild;
		img.style.setProperty("--nuage-top", Math.floor(Math.random() * 35) + "%");
		img.style.setProperty("--nuage-size", (Math.floor(Math.random() * 100) + 100) + "px");
		setTimeout(function () {
			img.remove();
		}, 35000);
		_nuagesSlide(nuages, ++i);
	}, time);
}
