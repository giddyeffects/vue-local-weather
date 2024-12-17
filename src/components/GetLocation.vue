<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Ref } from "vue"
import WeatherReport from "./WeatherReport.vue";

type GeoLocation = {
    latitude: number;
    longitude: number;
}

const coords: Ref<GeoLocation | undefined>= ref()
//any message to show the user
let message: Ref<string | undefined>= ref("User Denied access")
//in case user denies access to geoLoc API
const geoLocationBlockedByUser: Ref<boolean>= ref(false)
// const hasGeoLocation = (): boolean => {
//     //check if client has geolocation API
//     return ("geolocation" in navigator)?true:false
// }

//static coords...37.68727602631315, -91.10727557952092 => Mark Twain National Forest
const static_coords:GeoLocation = { latitude: 37.68727602631315, longitude: -91.10727557952092}

//get geoloc
const getGeoLocation = async (): Promise<void> => {
    await navigator?.geolocation?.getCurrentPosition(
        async (position: { coords: GeoLocation }) => {
            coords.value = position.coords
        },//success callback
        (error: { message: string }) => {//error callback
            geoLocationBlockedByUser.value = true
            message.value = error.message
            console.error(error.message);
        }
    )
}

onMounted( async () => {
        await getGeoLocation()
})
</script>

<template>
    <WeatherReport v-if="coords && !geoLocationBlockedByUser" :coords="coords" />
    <WeatherReport :coords="static_coords" />
    <div v-if="geoLocationBlockedByUser">{{ message }}</div>
</template>