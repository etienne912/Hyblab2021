"use strict";

import { autocompleteAddress } from "./modules/autocompleteAddress.js";
import { getTraficData } from "./modules/roadMonitoring.js";
import { slide } from "./modules/background.js";

function bootstrap() {
	document.querySelectorAll("body > div").forEach((el) => {
		el.setAttribute("style", "");
	});


	slide(velos, backgroundContinue, ["question_pane", "question_velo", "question_trajet"]);
	togglePath();

	if (localStorage.getItem("adresseDepart")) document.getElementById("input_depart").value = localStorage.getItem("adresseDepart");
	if (localStorage.getItem("adresseArrivee")) document.getElementById("input_arrivee").value = localStorage.getItem("adresseArrivee");

	autocompleteAddress(document.getElementById("input_depart"), document.getElementById("input_depart_container"), "adresseDepart");
	autocompleteAddress(document.getElementById("input_arrivee"), document.getElementById("input_arrivee_container"), "adresseArrivee");

	document.getElementById("validerTrajet").addEventListener("click", event => {

		const adresseDepart = localStorage.getItem("adresseDepartCoord");
		const adresseArrivee = localStorage.getItem("adresseArriveeCoord");

		if (!adresseDepart || !adresseArrivee) return;

		Array.from(document.getElementsByClassName("button-slide")).forEach((el) => {
			el.setAttribute("disabled", "true");
		});

		fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${adresseDepart};${adresseArrivee}?steps=true&access_token=pk.eyJ1IjoiZGpvdmFubmlmb3VpbiIsImEiOiJja2szdGpvMHQxZW1sMm9vNWp0eHJ6ZXR1In0.KJzAGbwYjUS20dFd37YZgw`)
			.then(res => res.json())
			.then(routes => {
				if (!routes || !routes.routes || !routes.routes[0]) return;
				const { steps, distance, duration } = routes.routes[0]["legs"][0];
				const roadNames = steps.map(s => s.name).filter((value, index, self) => self.indexOf(value) === index && value.length > 0);

				getTraficData({ roadNames, distance, duration }).then(() => {
					Array.from(document.getElementsByClassName("button-slide")).forEach((el) => {
						el.setAttribute("disabled", "false");
					});
					document.location = 'starterPack.html';
				});
			})
			.catch(err => {
				Array.from(document.getElementsByClassName("button-slide")).forEach((el) => {
					el.setAttribute("disabled", "false");
				});
			});
	});

	document.getElementById("bosser").addEventListener("click", () => {
		localStorage.setItem("butTrajet", "bosser");
	});
	document.getElementById("flaner").addEventListener("click", () => {
		localStorage.setItem("butTrajet", "flaner");
	});
	document.getElementById("pioncer").addEventListener("click", () => {
		localStorage.setItem("butTrajet", "pioncer");
	});
	document.getElementById("glander").addEventListener("click", () => {
		localStorage.setItem("butTrajet", "glander");
	});

	document.getElementById("simple").addEventListener("click", () => {
		localStorage.setItem("velo", "simple");
	});
	document.getElementById("electrique").addEventListener("click", () => {
		localStorage.setItem("velo", "electrique");
	});
	document.getElementById("bicloo").addEventListener("click", () => {
		localStorage.setItem("velo", "bicloo");
	});
}

/**
 * Handles hover on the pane
 */
function togglePath() {
	Array.from(document.getElementsByClassName("base")).forEach((el, index) => {
		el.addEventListener("mouseenter", () => {
			const hover = document.getElementsByClassName("hover")[index];
			if (hover.style.visibility !== 'visible')
				hover.style.visibility = 'visible';
		});
	});

	Array.from(document.getElementsByClassName("hover")).forEach((el) => {
		el.addEventListener("mouseleave", () => {
			el.style.visibility = 'hidden';
		});
	});
}

/**
 * Handles changing the bikes
 * @return {Promise<void>}
 */
async function velos() {

	let isMovingMouseEnter = false;
	let isMovingClick = false;

	document.querySelectorAll("#question_velo button").forEach((el) => {
		el.addEventListener("click", async () => {
			await sleep(
				() => {
					if (!isMovingClick) {
						Array.from(document.querySelectorAll(".velo.velo_in:not(#velo_" + el.id + ")")).forEach(async (e) => {
							isMovingClick = true;
							await sleep(async () => {
								e.setAttribute("class", "velo velo_out");
							}, 2000);
							isMovingClick = false;
						});


						const velo = document.getElementById("velo_" + el.id);
						velo.setAttribute("class", "velo velo_in");
					}

				}, 2000);
		});
	});
	await startVelos(0);

	document.querySelectorAll("#question_velo button").forEach((el) => {

		el.addEventListener("mouseenter", () => {
			if (!isMovingMouseEnter) {
				Array.from(document.querySelectorAll(".velo.velo_in:not(#velo_" + el.id + ")")).forEach(async (e) => {
					isMovingMouseEnter = true;
					await sleep(async () => {
						e.setAttribute("class", "velo velo_out");
					}, 2000);
					isMovingMouseEnter = false;
				});

				const velo = document.getElementById("velo_" + el.id);
				velo.setAttribute("class", "velo velo_in");
			}
		});
	});
}

/**
 * Starting bikes
 * @param {number} i
 * @return {Promise<void>}
 */
async function startVelos(i) {
	let e = Array.from(document.querySelectorAll(".velo"))[i];
	if (e != null) {
		await sleep(async () => {
			e.setAttribute("class", "velo velo_in");
			await startVelos(++i)
		}, 200);
	} else {
		await sleep(async () => {
			await goVelos(--i)
		}, 1600);
	}
}

/**
 * Moving bikes
 * @param {number} i
 * @return {Promise<void>}
 */
async function goVelos(i) {

	let e = Array.from(document.querySelectorAll(".velo"))[i];
	if (e != null && i > 0)
		await sleep(async () => {
			e.setAttribute("class", "velo velo_out");
			await goVelos(--i)
		}, 200);
}

/**
 * Sleep with timeout
 * @param {function} callback
 * @param {number} time
 * @return {Promise<*>}
 */
function sleep(callback, time) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(callback()), time)
	})
}

/**
 * Slide the background
 * @param {HTMLElement} el
 * @param {[String]} slides
 * @param {boolean} plus
 */
function backgroundContinue(el, slides, plus) {
	let parent = el.parentElement;
	if (parent.id === "pane")
		parent = parent.parentElement;
	parent.setAttribute("class", "hide");
	if (plus) {
		document.getElementById(slides[slides.indexOf(parent.id) + 1]).setAttribute("class", "");
		setTimeout(() => {
			document.getElementById(slides[slides.indexOf(parent.id) + 1]).setAttribute("class", "show");
		},50)
	}	else {
		document.getElementById(slides[slides.indexOf(parent.id) - 1]).setAttribute("class", "");
		setTimeout(() => {
			document.getElementById(slides[slides.indexOf(parent.id) - 1]).setAttribute("class", "show");
		},50)
	}
}

window.addEventListener('DOMContentLoaded', () => {
	bootstrap();
});

