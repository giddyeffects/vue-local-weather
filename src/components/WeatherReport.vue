<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue"
type WeatherData = {
    location: {
        localtime: Date;
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        feelslike_c: number;
        feelslike_f: number;
        precip_mm: number;
        condition: {
            text: string;
            icon: string;
        };
        wind_degree: number;
        wind_dir: string;
        wind_kph: number;
        wind_mph: number;
        humidity: number;
        uv: number
    };
};

type Coords = {
    latitude: number;
    longitude: number;
}

interface Props {
    coords: Coords
}

const props = defineProps<Props>();
const data: Ref<WeatherData | undefined>= ref()
//fetch weather data
const fetchWeather = async (coords: Coords) : Promise<WeatherData> => {
    const {latitude, longitude} = coords
    const q = `${latitude},${longitude}`;
    const res = await fetch(`${import.meta.env.VITE_APP_WEATHER_URL}?key=${import.meta.env.VITE_APP_WEATHER_API_KEY}&q=${q}&aqi=no`)
    const data = await res && res.json()
    return data
}

onMounted( async () => {
    const { latitude, longitude } = props.coords
    const weatherResponse = await fetchWeather({latitude,longitude})
    data.value = weatherResponse
})
</script>
<template>
    <div v-if="data && data.current">
        <article>
            {{  data.current }}
        </article>
    </div>
    <div v-else>Loading...</div>
</template>