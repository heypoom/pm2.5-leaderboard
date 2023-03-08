<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const rankingImages = [
		{
			src: '/ranking/1.jpeg',
			focalPoint: { x: 0.5, y: 0.5 }
		},
		{
			src: '/ranking/2.jpg',
			focalPoint: { x: 0, y: 0.5 }
		},
		{
			src: '/ranking/3.jpg',
			focalPoint: { x: 0, y: 0.5 }
		},
		{
			src: '/ranking/4.png',
			focalPoint: { x: 0, y: 0.5 }
		},
		{
			src: '/ranking/5.webp',
			focalPoint: { x: 0, y: 0.5 }
		},
		{
			src: '/ranking/6.jpg',
			focalPoint: { x: 0.55, y: 0 }
		}
	];
	const rankMins = [91, 81, 71, 61, 51, 41];
	const colors = [
		'bg-red-700',
		'bg-red-500',
		'bg-orange-500',
		'bg-yellow-700',
		'bg-yellow-500',
		'bg-green-500'
	];

	function getRankMinIndex(value: number): number {
		return rankMins.findIndex((min) => value >= min);
	}

	function formatDate(date: string) {
		const dt = new Date(date);
		return new Intl.DateTimeFormat('th', {
			day: 'numeric',
			weekday: 'short',
			month: 'long'
		}).format(dt);
	}

	function getObjectPosition(focalPoint: { x: number; y: number }): string {
		return `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
	}
</script>

<!-- svelte-ignore a11y-distracting-elements -->

<div class="max-w-7xl mx-auto">
	<div class="flex gap-y-4 flex-col min-h-full px-6 py-4">
		{#await data.aqi}
			<div>loading...</div>
		{:then value}
			{@const aqi = value.flat().sort((a, b) => b.PM25 - a.PM25)}

			<h1 class="text-5xl">อากาศแย่สุด</h1>

			<marquee>
				<div class="flex mt-12 gap-x-12">
					{#each aqi.slice(0, 3) as index, i}
						<div
							class="flex flex-shrink-0 items-center justify-between relative animate-bounce"
							style="animation-delay: {[0, 300, 600][i]}ms;"
						>
							<div class="flex flex-col">
								<div class="text-9xl text-red-500">{index.PM25}</div>
								<div class="text-3xl">{index.District}</div>
								<div class="text-sm">({formatDate(index.Date_Time)})</div>
							</div>
							<img
								src={rankingImages[i].src}
								alt=""
								class="w-40 aspect-square object-cover ml-6 rounded-md shadow-md"
								style:object-position={getObjectPosition(rankingImages[i].focalPoint)}
							/>
						</div>
					{/each}
				</div>
			</marquee>

			<h2 class="text-5xl">การจัดอันดับศึกสุดยอดความเป็นไทย</h2>
			<div class="flex flex-col bg-black p-2 gap-y-2 rounded-md">
				{#each rankMins as sum, i}
					<div class="flex">
						<div>
							<img
								src={rankingImages[i].src}
								alt=""
								class="w-40 aspect-square object-cover rounded-md"
								style:object-position={getObjectPosition(rankingImages[i].focalPoint)}
							/>
						</div>
						<div class="whitespace-normal ml-2 bg-gray-800 w-full relative rounded-md">
							{#each aqi.filter((s) => getRankMinIndex(s.PM25) == i) as status}
								<div
									class="inline-block align-top text-white text-2xl m-2 p-2 rounded-md {colors[
										getRankMinIndex(status.PM25)
									]}"
								>
									{status.District}: <span class="text-white">{status.PM25}</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:catch}
			<div>Bangkok's API fucked up don't blame me</div>
		{/await}
	</div>
</div>
