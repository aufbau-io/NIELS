<script>
	let allWords = '';
	let displayIndex = 0;
	const maxWordLength = 10; // was 8, now 10 places: 2^10 = 1024 words

	// Function to generate words of exactly maxLength
	function generateWords(maxLength) {
			const alphabet = '01';
			let words = [];
			// Generating only full-length combos means every word is
			// naturally zero-padded to the same width: 0000000000,
			// 0000000001, ... 1111111111. (Padding shorter words to
			// this width would just duplicate these.)
			for (let combo of getCombinations(alphabet, maxLength)) {
					words.push(combo);
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
			column-width: 64px;
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
		overflow-y: auto;   /* main scroll stays vertical */
		overflow-x: clip;   /* a started column bleeds off the edge, no h-scroll */
	}
}
</style>