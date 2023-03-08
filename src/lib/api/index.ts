interface AirQualityData {
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

export async function getAirQuality(f: typeof fetch, nextPage: number): Promise<AirQualityData[]> {
	const res = await f('https://bangkokairquality.com/bma/Home/getDataHome', {
		method: 'POST',
		body: `lang=th&next_load=${nextPage}&group_district=0`,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
	});
	if (!res.ok) throw Error("Bangkok's API fucked up don't blame me");

	const data: { arrStation: AirQualityData[] } = await res.json();
	return data.arrStation;
}
