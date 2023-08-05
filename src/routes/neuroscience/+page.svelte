<script>
	// import graph from '$lib/images/icons/graph.svg';
</script>

<section>
<div class="main">
  <!-- <div class="icons">
		<img src={graph} alt="graph" class="icon" />
	</div> -->
  <!-- <h1>NEUROSCIENCE<br>-</h1> -->
  <a href="https://bushlab-ucl.github.io" target="_blank" rel="noreferrer"><p>Human Electrophysiology Lab - UCL</p></a>
  <a href="https://www.ucl.ac.uk/icn/research/research-groups/space-memory" target="_blank" rel="noreferrer"><p>Space and Memory Lab - UCL ICN</p></a>

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

	.main p, a {
		font-size: 13px;
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
			padding:  40px 24px;
			gap: 10px;
		}
	}
</style>
