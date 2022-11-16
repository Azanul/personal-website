<script>
	import Navbar from './Navbar.svelte'
	import Sidebar from './Sidebar.svelte'
	import { Router } from "@roxi/routify";
	import { routes } from "../.routify/routes";
	
	let open = false
</script>

<Sidebar bind:open/>
<Navbar bind:sidebar={open}/>

<svelte:head>
	<script src="https://cdn.tailwindcss.com"></script>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</svelte:head>

<style>
	:global(body) {
		padding: 0;
		font-family: "Poppins";
	}
</style>
<Router {routes}/>

