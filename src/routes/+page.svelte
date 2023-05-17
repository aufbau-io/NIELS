<script>
		let text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper velit id quam bibendum, eu viverra leo dictum. Duis tempus mauris vitae fermentum dictum. Mauris quis purus ut lacus porttitor tempor mollis id felis. Praesent sit amet placerat magna, eu egestas nulla. Donec nec nunc sed risus convallis malesuada. Nulla nulla neque, accumsan id egestas non, varius et nibh. Duis hendrerit vestibulum elementum. Duis ut mauris tincidunt, cursus nibh in, hendrerit lectus. Nulla blandit arcu ut mollis vehicula. Pellentesque ligula arcu, laoreet sit amet ante auctor, egestas condimentum lacus. Sed consectetur auctor velit, lobortis fringilla tellus tincidunt sit amet. Integer non tortor pellentesque, venenatis est eget, volutpat augue. Phasellus imperdiet semper ultrices."
</script>

<section>
	<div class="main">
		<h1>EMMETT THOMPSON<br>-</h1>
		<p>{text}</p>
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

		background: var(--background-50);
		overflow: auto;
	}

	.main {
		max-width: 800px;

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		gap: 40px;

		border: solid 1px var(--primary);
		padding: 40px;
	}

</style>
