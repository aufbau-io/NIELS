<script>
  	import chat from '$lib/images/icons/chat.svg';
</script>

<section>
<div class="main">
  <div class="icons">
		<img src={chat} alt="graph" class="icon" />
	</div>
  <h1>ART / PHILOSOPHY<br>-</h1>
  <a href="https://www.ucl.ac.uk/bartlett/architecture/programmes/postgraduate/march-design-for-performance-and-interaction" target="_blank" rel="noreferrer"><p>Computational Soul (seminar) - Bartlett DfPI, 2021</p></a>
  <p>Raumen Bar - London Space and Representation Meet-Up</p>
  <!-- <p>psychosis (book) - wip</p> -->
  
</div>
</section>

<style>
section {
  padding: 0 20%;
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
			width: 80vw;
		}
	}
</style>
