<script>
    export let repo;
</script>

<div class="grid-item">
    <img class="thumbnail" src={repo.thumbnail} alt={repo.title}/>
    <div class="text-overlay">
        <div class="p-9 text-xl text-slate-100">
            {repo.title}
        </div>
        <div class="p-10 text-base text-slate-500">
            {repo.description}
        </div>
    </div>
</div>

<style>
    .grid-item {
        grid-row-end: span 45;
    }

    .thumbnail {
        max-height: 70%;
        max-width: 100%;
        object-fit: cover
    }

    .text-overlay{
        position: absolute;
        transform: translate(50%, -50%);
    }
</style>