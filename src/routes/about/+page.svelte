<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<p class="font-ueberschrift bg-yellow-400">Test Test</p>
<h1>{data.title}</h1>
<div>{@html data.content}</div>