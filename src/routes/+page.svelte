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

body, html {
    margin: 0;
    height: 100vh; /* Keep the full viewport height */
}

main {
    font-family: serif;
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    padding: 10px;
    height: 100vh; /* Set main to full viewport height */
    overflow: hidden; /* Prevent scrolling on the main container */
}

.header {
    flex-shrink: 0; /* Ensure the header doesn't shrink */
    width: 100%; /* Full width */
    /* Additional header styles */
}

.text-container {
    flex-grow: 1; /* Allow text container to grow */
    overflow-y: auto; /* Enable vertical scrolling */
    overflow-x: hidden; /* Hide horizontal scrollbar */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS devices */
		column-count: 1; /* Single column on mobile */
    column-width: 100%; /* Full width of the column */
    column-gap: 20px;
    padding-left: 20px;
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
        column-count: 1;
        column-width: 100%;
        height: auto; /* Ensure it's auto to grow as needed */
        overflow-y: auto; /* Auto instead of scroll for mobile */
        overflow-x: hidden;
        padding-left: 0;
        column-fill: initial;
				column-gap: initial;
				/* scroll properly on mobile */
				-webkit-overflow-scrolling: touch;
        }
	}
</style>