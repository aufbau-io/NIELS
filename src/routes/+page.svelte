<script>
	let allWords = '';
	let displayIndex = 0;
	const maxWordLength = 3; // Adjustable maximum word length

	// Function to generate words up to a specified length
	function generateWords(maxLength) {
			const alphabet = 'abcdefghijklmnopqrstuvwxyz';
			let words = [];
			for (let length = 1; length <= maxLength; length++) {
					for (let combo of getCombinations(alphabet, length)) {
							words.push(combo);
					}
			}
			return words;
	}

	// Helper function to get combinations of letters
	function getCombinations(alphabet, length) {
			if (length === 1) return alphabet.split('');
			const combos = [];
			const smallerCombos = getCombinations(alphabet, length - 1);
			for (let letter of alphabet) {
					for (let combo of smallerCombos) {
							combos.push(letter + combo);
					}
			}
			return combos;
	}

	// Call function to generate words
	const words = generateWords(maxWordLength);

	// Timer to display words by appending to a string
	const timer = setInterval(() => {
			if (displayIndex < words.length) {
					allWords += words[displayIndex] + ' ';
					displayIndex++;
			} else {
					clearInterval(timer);
			}
	}, 10);
</script>

<main>
	<div class="header">
			<h2>Daniel Humphries</h2>
			<p class="less-spacing">[ Niels for Art Things ]</p>
			<img src="niels_bw.jpg" alt="daniel niels humphries, this is my website." width=144 height = 144 />
			<a href="https://aufbau.io"><p>websites/apps/graphics</p></a>
			<a href="https://bushlab-ucl.github.io/"><p>ucl neuroscience</p></a>
			<hr style="margin-top:5px;"/>
	</div>
	<div class="text-container">
			<p>{allWords}</p>
	</div>
</main>

<style>

	main {
		font-family: serif;
		display: flex;
		padding: 10px;
		overflow: hidden; /* Prevent scrolling on the main container */
		height: 100dvh;
		max-height: 100dvh;
		padding-left: 20px;
		padding-top: 10px;
		box-sizing: border-box;
	}
	.header {
			flex: 0 0 144px; /* Fixed width for the first column */
			box-sizing: border-box;

			/* Add any specific height if required */
	}

	.header p {
		margin-bottom: 0px;
	}

	.header p.less-spacing {
		letter-spacing: 0.082em;
		color: red;
		font-style: italic;
	} 

	.text-container {
			flex-grow: 1;
			overflow-y: auto; /* Enable vertical scrolling */
			overflow-x: auto; /* Hide horizontal scrollbar */
			padding-left: 20px;
			column-width: 142px;
			column-gap: 20px;
			height: 100%;
			text-align: justify;
			box-sizing: border-box;
	}

	img {
			border: 1px solid black;
			margin: 5px 0 0px 0;
	}

	p {
			break-inside: avoid; /* Avoid breaking inside paragraphs */
	}

	h2 {
			padding-left: 0px;
			font-size: 16px;
			font-weight: normal;
			letter-spacing: 0.115em;

	}

	
	@media (max-width: 767px) {

		/* Make the text-container scroll vertically within main on mobile rather than get stuck at 100% page height */
		main {
			height: auto;
			max-height: auto;
			overflow: auto;
		}

		.header {
			position: sticky;
			top: 0;
		}

		.text-container {
			height: fit-content;
			max-height: fit-content;
		}

			a {
				text-decoration: red underline;
				-webkit-text-decoration-color: red;
				text-decoration-color: red;
			}

			a:hover {
				text-decoration: underline;
			}

	}
</style>