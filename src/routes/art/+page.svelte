<script>
  	// import chat from '$lib/images/icons/chat.svg';
</script>

<section>
<div class="main">
  <!-- <div class="icons">
		<img src={chat} alt="graph" class="icon" />
	</div> -->
  <h1>ART / WORDS<br>-</h1>
	<a href="https://www.instagram.com/metamodernism.as.a.service/" target="_blank" rel="noreferrer"><p>metamodernism.as.a.service - 2020/21</p></a>
  <!-- <p>Computational Soul (seminar) - Bartlett DfPI : 2020/21</p> -->
  <!-- <p>Raumen Bar - London Space and Representation Meet-Up</p> -->
  <!-- <p>psychosis (book) - wip</p> -->
  
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
			bottom: 5%;
			z-index: -1;
			width: 90vw;
			gap: 24px;
			padding:  40px 24px;
		}
	}
</style>
