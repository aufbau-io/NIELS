<script>
		let text1="Part-Time Web Engineer"
		let text2="Part-Time Neuroscientist"
		let text3="Full-Time Loser"

	import graph from '$lib/images/icons/graph.svg';
	import www from '$lib/images/icons/www2.svg';
	import chat from '$lib/images/icons/chat.svg';
</script>

<section>
	<div class="main">
		<div class="icons">

		<img src={graph} alt="graph" class="icon" />
		<img src={www} alt="www" class="icon" />
		<img src={chat} alt="chat" class="icon" />
	</div>

		<h1>DANIEL HUMPHRIES<br>-</h1>
		<!-- <p>Space, Representation, Communication</p> -->
		<p>{text1}</p>
		<p>{text2}</p>
		<p>{text3}</p>
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

		/* background: var(--primary-50); */
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
		padding-bottom: 16px;
	}

	.icon {
		height: 60px;
		width: 100%;
	}


	@media only screen and (max-width: 768px) {
		.main {
			width: 80vw;
			gap: 16px;
		}
	}
</style>
