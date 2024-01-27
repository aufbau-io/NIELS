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


<div class="text-container">
		<p>{allWords}</p>
</div>

<style>
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

	p {
			break-inside: avoid; /* Avoid breaking inside paragraphs */
	}
	
	@media (max-width: 767px) {
		.text-container {
			height: 100%;
			max-height: 100%;
			overflow: auto;
		}
	}
</style>