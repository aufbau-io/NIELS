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
			<img src="niels_bw.jpg" alt="niels, this is my website." width=144 />
			<a href="https://aufbau.io">websites/apps/graphics</a>
			<a href="https://bushlab-ucl.github.io/">ucl neuroscience</a>
			<br >
			<hr style="margin-top:5px;"/>
	</div>
	<div class="text-container">
			<p>{allWords}</p>
	</div>
</main>

<style>
	main {
			font-family: serif;
			height: 100dvh;
			display: flex;
			padding: 10px;
			padding-left: 20px
	}

	.header {
			flex: 0 0 144px; /* Fixed width for the first column */
			box-sizing: border-box;
	}

	.text-container {
			flex-grow: 1;
			overflow: auto;
			padding-left: 20px;
			column-width: 142px;
			column-gap: 20px;
			height: 100%;
	}

	img {
			width: 142px;
			height: auto;
			border: solid 1px black;
			display: block;
			margin: 5px auto;
	}

	p {
			break-inside: avoid; /* Avoid breaking inside paragraphs */
	}

	h2 {
			padding-left: 2px;
	}
	
	@media (max-width: 767px) {
			/* single column of text on mobile, scroll down rather than sideways */
			.header {
				padding-right: 20px;
			}

			.text-container {
            column-count: 1; /* Single column */
            column-width: 100%; /* Full width for the column */
            height: auto; /* Adjust height to content */
            overflow-y: scroll; /* Enable vertical scrolling */
            overflow-x: hidden; /* Hide horizontal scrollbar */
            padding-left: 0; /* Adjust padding if needed */
						column-fill: initial; /* Disable balancing of columns */
        }
	}
</style>