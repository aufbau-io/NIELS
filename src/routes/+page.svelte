<script>
	import { onMount } from 'svelte';

	let allWords = '';
	let displayIndex = 0;
	const maxWordLength = 3;
	const unicodeRanges = [
		[0x0041, 0x007A], // Latin (A-Z, a-z)
		[0x0370, 0x03FF], // Greek
		[0x0400, 0x04FF], // Cyrillic
		[0x0590, 0x05FF], // Hebrew
		[0x0600, 0x06FF], // Arabic
		[0x0900, 0x097F], // Devanagari
		[0x4E00, 0x9FFF], // CJK Unified Ideographs
	];

	// Function to generate random words from Unicode ranges
	function generateRandomWord() {
		let word = '';
		for (let i = 0; i < maxWordLength; i++) {
			const range = unicodeRanges[Math.floor(Math.random() * unicodeRanges.length)];
			const randomChar = String.fromCharCode(Math.floor(Math.random() * (range[1] - range[0])) + range[0]);
			word += randomChar;
		}
		return word;
	}

	// This ensures the code runs only on the client side
	onMount(() => {
		const textContainer = document.querySelector('.text-container p');

		const timer = setInterval(() => {
			allWords += generateRandomWord() + ' ';
			displayIndex++;

			// Update the content of the paragraph in real-time using textContent for better performance
			textContainer.textContent = allWords;
		}, 10);

		// Optional: Cleanup the timer when the component is destroyed
		return () => clearInterval(timer);
	});
</script>

<div class="text-container">
	<p></p>
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
		font-size: 12px;
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
