<script>
  	// import www from '$lib/images/icons/www2.svg';
</script>

<section>
<div class="main">
  <!-- <div class="icons">
		<img src={www} alt="graph" class="icon" />
	</div> -->
  <!-- <h1>TECHNOLOGY<br>-</h1> -->
  <a href="https://aufbau.io" target="_blank" rel="noreferrer"><p>Aufbau - creative web engineer</p></a>
  <a href="https://midnight.agency" target="_blank" rel="noreferrer"><p>Midnight Agency - intern</p></a>
  <!-- <a href="https://iota.health" target="_blank" rel="noreferrer"><p>IOTA - CTO / Co-Founder</p></a> -->
	<!-- <p>IOTA - Co-Founder</p> -->
</div>
</section>

<style>
section {
  padding: 0 0;
  height: 100%;
  width: 100%;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  align-items: center;
  text-align: center;

  overflow: auto;
}

.main {
		max-width: 800px;

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		gap: 10px;

		background: var(--background);
		color: var(--primary);
		border: var(--border);
		padding:  40px 48px;
	}

  .icons {
		display: flex;
		flex-flow: row;
		padding-bottom: 10px;
	}

	.icon {
		height: 60px;
		width: 100%;
	}

	@media only screen and (max-width: 768px) {
		.main {
			position: absolute;
			bottom: 20px;
			z-index: -1;
			width: 90vw;
			padding:  40px 24px;
		}
	}
</style>
