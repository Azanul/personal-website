<script>
    import projectData from "../../static/projectData.json";

	import { onMount } from 'svelte';
    import Project from "../../Project.svelte";

    let repos = [];
	async function projectLoad() {
        console.log(projectData)
	}

	onMount(projectLoad);
</script>
	
<div class="grid place-content-around m-4">
    {#each projectData as repo}
        <Project repo={repo} />
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-gap: 10px;
        grid-auto-rows: 0;
        grid-template-columns: repeat(auto-fill,minmax(13.33333rem,1fr));
    }
</style>