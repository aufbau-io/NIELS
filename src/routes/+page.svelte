<script>
	const name = "Daniel Humphries";
	const title = "PhD Candidate in Applied Mathematics";
	const department = "Disordered Systems Group, King's College London";
	// const email = "jsmith [at] example [dot] edu";
	
	// const publications = [
	// 	{ authors: "Smith, J., & Collaborator, A.", year: 2024, title: "On the geometric structure of meaning in transformer representations", venue: "Proceedings of ACL" },
	// 	{ authors: "Smith, J.", year: 2023, title: "Cross-lingual transfer without parallel data: A cognitive perspective", venue: "Computational Linguistics, 49(2), 301–345" },
	// 	{ authors: "Smith, J., Other, B., & Third, C.", year: 2022, title: "Probing semantic knowledge in pretrained models", venue: "Proceedings of EMNLP" },
	// ];

	// const courses = [
	// 	{ code: "CS 571", name: "Natural Language Processing", term: "Fall 2024" },
	// 	{ code: "CS 301", name: "Introduction to Computational Linguistics", term: "Spring 2024" },
	// 	{ code: "CS 701", name: "Seminar in Language and Cognition", term: "Fall 2023" },
	// ];
</script>

<svelte:head>
	<title>{name}</title>
</svelte:head>

<main>
	<header>
		<h2>{name}</h2>
		<p class="affiliation">{title}<br>{department}</p>
	</header>

	<section>
		<h2>About</h2>
		<p>PhD student at King's College London and UCL, supervised by Izaak Neri, Daniel Bush, and Rick Adams. I study the geometry and arithmetic of memory and cognition; how periodic structures like grid cells and prefrontal circuits organise thought, and how defects in these systems lead to cognitive breakdown in conditions such as schizophrenia.</p>
	</section>

	<section>
		<h2>Research Interests</h2>
		<p>Hopfield networks, cognitive maps, schizophrenia, discrete algebraic geometry, theta functions, arithmetic.</p>
	</section>

	<p class="email">daeillion[at]proton.me</p>

	<!-- <section>
		<h2>Contact</h2>
		<p class="contact">
			Office: Engineering Building 412<br>
			Email: {email}<br>
			<a href="#">CV</a> · <a href="#">Google Scholar</a> · <a href="#">GitHub</a>
		</p>
	</section> -->
</main>

<style>
	main {
		padding-left: 20px;
		display: flex;
		flex-flow: column;
		gap: 16px;
		width: 50%;
		color: var(--primary);
	}

	h2 {
		padding-bottom: 8px;
	}

	p.email {
		padding-top: 4px;
		letter-spacing: 0.1em;
		text-decoration: var(--accent) underline;
	}
</style>