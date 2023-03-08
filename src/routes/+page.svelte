<script lang="ts">
	interface Status {
		Name: string;
		district_name: string;
		Code: string;
		ThaiName: string;
		EngName: string;
		ThaiShortName: string;
		Latitude: string;
		Longitude: string;
		Addr: string;
		District: string;
		District_en: string;
		Province: string;
		LastData: string;
		ThaiCode: string;
		groupname: string;
		groupname_en: string;
		status: string;
		Date_Time: string;
		PM10quality: number;
		PM10: number;
		PM25quality: number;
		PM25: number;
		COquality: number;
		CO: number;
		NO2quality: number;
		NO2: number;
		max_aqi: number;
		aqi_img: string;
		aqi_text: string;
	}

	const getStatusByPage = async (nextPage: number): Promise<Status[]> => {
		const res = await fetch('https://bangkokairquality.com/bma/Home/getDataHome', {
			method: 'POST',
			body: `lang=th&next_load=${nextPage}&group_district=0`,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		});

		const body = (await res.json()) as { arrStation: Status[] };

		return body.arrStation;
	};

	const load = async () => {
		const statuses = (await Promise.all([0, 30, 60].map(getStatusByPage))).flat();

		return statuses.sort((a, b) => b.PM25 - a.PM25);
	};

	let statuses: Promise<Status[]> = load();

	const rankingImages = [
		'https://pailin.voicetv.co.th/assets/aW1hZ2UvMjAxOC0wNC9hYTQwNjE4MWZhZDJiYTk1MzI4NmU2YTM3ZDE0ZDllZC5qcGc=',
		'https://static.thairath.co.th/media/dFQROr7oWzulq5FZUIEttgxCedpWNzVR4OOq2IVmMTFokKSUdDXsI0X6aEGkbCeRqn5.jpg',
		'https://pailin.voicetv.co.th/assets/aW1hZ2UvMjAxOC0wNC9hYTQwNjE4MWZhZDJiYTk1MzI4NmU2YTM3ZDE0ZDllZC5qcGc=',
		'https://static.thairath.co.th/media/dFQROr7oWzulq5FZUIEttgxCedpWNzVR4OOq2IVmMTFokKSUdDXsI0X6aEGkbCeRqn5.jpg',
		'https://pailin.voicetv.co.th/assets/aW1hZ2UvMjAxOC0wNC9hYTQwNjE4MWZhZDJiYTk1MzI4NmU2YTM3ZDE0ZDllZC5qcGc=',
		'https://static.thairath.co.th/media/dFQROr7oWzulq5FZUIEttgxCedpWNzVR4OOq2IVmMTFokKSUdDXsI0X6aEGkbCeRqn5.jpg'
	];

	const rankMins = [91, 81, 71, 61, 51, 41];

	const colors = [
		'bg-red-700',
		'bg-red-500',
		'bg-orange-500',
		'bg-yellow-500',
		'bg-yellow-400',
		'bg-green-500'
	];

	function rankByValue(value: number): number {
		for (const i in rankMins) {
			const min = rankMins[i];
			if (value >= min) return +i;
		}

		return rankMins.length;
	}
</script>

<div class="max-w-[1100px] mx-auto">
	<div class="flex gap-y-4 flex-col min-h-full px-6 py-4">
		{#await statuses}
			<div>loading...</div>
		{:then statuses}
			<!-- svelte-ignore a11y-distracting-elements -->
			<marquee behavior="" direction="">
				<h1 class="text-5xl">อากาศแย่สุด</h1>

				<div class="flex gap-x-12">
					{#each statuses.slice(0, 3) as status, i}
						<div
							class="flex flex-shrink-0 items-center justify-between relative animate-bounce"
							style="animation-delay: {[50, 300, 600][i]}ms;"
						>
							<div class="flex flex-col">
								<div class="text-9xl text-red-500">{status.PM25}</div>
								<div class="text-3xl">{status.District}</div>
								<small>({status.Date_Time})</small>
							</div>
							<img
								src={rankingImages[i]}
								alt=""
								class="w-40 aspect-square object-cover ml-6 rounded-md shadow-md"
							/>
						</div>
					{/each}
				</div>
			</marquee>

			<h1 class="text-5xl">Tier List</h1>

			<div class="flex flex-col bg-black p-2 gap-y-2">
				{#each rankMins as min, r}
					<div class="flex">
						<div>
							<img src={rankingImages[r]} alt="" class="w-40 aspect-square object-cover" />
						</div>
						<div class="flex flex-wrap ml-2 bg-gray-800 w-full relative">
							{#each statuses.filter((s) => rankByValue(s.PM25) == r) as status}
								<div
									class="text-white w-[200px] text-2xl m-2 p-2 rounded-md {colors[
										rankByValue(status.PM25)
									]}"
								>
									<div>
										{status.District}: <span class="text-white">{status.PM25}</span>
									</div>
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
