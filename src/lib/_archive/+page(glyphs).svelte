<!-- <script>
	let allGlyphs = '';
	let displayIndex = 0;

	// Unicode ranges (excluding emoji/symbol ranges)
	const scripts = [
		{ name: 'Latin', start: 0x0041, end: 0x007A },
		{ name: 'LatinExt', start: 0x00C0, end: 0x00FF },
		{ name: 'Greek', start: 0x0391, end: 0x03C9 },
		{ name: 'Cyrillic', start: 0x0410, end: 0x044F },
		{ name: 'Hebrew', start: 0x05D0, end: 0x05EA },
		{ name: 'Arabic', start: 0x0621, end: 0x064A },
		{ name: 'Devanagari', start: 0x0905, end: 0x0939 },
		{ name: 'Bengali', start: 0x0985, end: 0x09B9 },
		{ name: 'Tamil', start: 0x0B85, end: 0x0BB9 },
		{ name: 'Thai', start: 0x0E01, end: 0x0E3A },
		{ name: 'Lao', start: 0x0E81, end: 0x0EAE },
		{ name: 'Georgian', start: 0x10A0, end: 0x10FF },
		{ name: 'Hangul', start: 0xAC00, end: 0xD7AF },
		{ name: 'Hiragana', start: 0x3041, end: 0x3096 },
		{ name: 'Katakana', start: 0x30A1, end: 0x30FA },
		{ name: 'CJK', start: 0x4E00, end: 0x9FFF },
		{ name: 'Ethiopic', start: 0x1200, end: 0x137F },
		{ name: 'Armenian', start: 0x0531, end: 0x0587 },
		{ name: 'Tibetan', start: 0x0F40, end: 0x0F6C },
		{ name: 'Myanmar', start: 0x1000, end: 0x104F },
		{ name: 'Khmer', start: 0x1780, end: 0x17DD },
		{ name: 'Mongolian', start: 0x1820, end: 0x1877 },
		{ name: 'Runic', start: 0x16A0, end: 0x16F0 },
		{ name: 'Ogham', start: 0x1680, end: 0x169C },
		{ name: 'Cherokee', start: 0x13A0, end: 0x13F5 },
		{ name: 'Canadian', start: 0x1400, end: 0x167F },
		{ name: 'Sinhala', start: 0x0D85, end: 0x0DC6 },
		{ name: 'Malayalam', start: 0x0D05, end: 0x0D39 },
		{ name: 'Telugu', start: 0x0C05, end: 0x0C39 },
		{ name: 'Kannada', start: 0x0C85, end: 0x0CB9 },
		{ name: 'Gujarati', start: 0x0A85, end: 0x0AB9 },
		{ name: 'Oriya', start: 0x0B05, end: 0x0B39 },
		{ name: 'Gurmukhi', start: 0x0A05, end: 0x0A39 },
	];

	function getRandomGlyph() {
		const script = scripts[Math.floor(Math.random() * scripts.length)];
		const codePoint = script.start + Math.floor(Math.random() * (script.end - script.start + 1));
		return String.fromCodePoint(codePoint);
	}

	function generateBlock(size = 1) {
		let block = '';
		for (let i = 0; i < size; i++) {
			block += getRandomGlyph();
		}
		return block;
	}

	const maxGlyphs = 10000;
	const batchSize = 5;

	const timer = setInterval(() => {
		if (displayIndex < maxGlyphs) {
			allGlyphs += generateBlock(batchSize);
			displayIndex += batchSize;
		} else {
			clearInterval(timer);
		}
	}, 10);
</script>

<div class="text-container">
	<p>{allGlyphs}</p>
</div>

<style>
	.text-container {
		position: absolute;
		flex-grow: 1;
		overflow-y: auto;
		overflow-x: auto;
        /* padding-left: 20px; */
		column-width: 142px;
		column-gap: 20px;
		height: 100%;
        padding-top: 25%;
		text-align: justify;
		box-sizing: border-box;
		z-index: -1;
	}

	p {
		break-inside: avoid;
		/* color: white; */
        color: var(--primary-50);
		word-break: break-all;
		line-height: 1.4;
		letter-spacing: 0.05em;
	}
	
	@media (max-width: 767px) {
		.text-container {
			height: 100%;
			max-height: 100%;
			overflow: auto;
		}
	}
</style> -->