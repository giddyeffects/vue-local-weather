<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue"
import WindDirection from "./WindDirection.vue";

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

const formatDate = (dateString: Date): string =>{
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("default", {
        dateStyle: "long",
        timeStyle: "short"
    }).format(date)
}

onMounted( async () => {
    const { latitude, longitude } = props.coords
    const weatherResponse = await fetchWeather({latitude,longitude})
    data.value = weatherResponse
})
</script>
<template>
    <div>
        <article v-if="data && data.current" class="max-w-md w-96 rounded-lg shadow-lg p-4 flex bg-white text-black">
            <div class="basis-1/4 text-left">
                <img :src="data.current.condition.icon" class="h-16 w-16" />
            </div>
            <div class="basis-3/4 text-left">
                <h1 class="text-3x1 font-bold">
                    {{ data.current.condition.text }}
                    <span class="text-2x1 block">{{ data.current.temp_c }}&#8451; <span class="font-thin">feels like {{ data.current.feelslike_c }}&#8451;</span></span>
                </h1>
                <p>{{ data.location.name }} {{ data.location.region }}</p>
                <p>Precipitation: {{ data.current.precip_mm }}mm</p>
                <p>Humidity: {{ data.current.humidity }}%</p>
                <p>
                    Wind: {{ data.current.wind_kph }} kph
                    <WindDirection :degrees="data.current.wind_degree" />
                </p>                
                <p>{{ formatDate(data.location.localtime) }}</p>
            </div>
        </article>
        <div v-else>Loading...</div>
    </div>
</template>