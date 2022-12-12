<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<p class="font-ueberschrift">TestSlug</p>
<h1>{data.title}</h1>
<div>{@html data.content}</div>
<p>{data.slug}</p>