<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Ref } from "vue"
type GeoLocation = {
    latitude: number;
    longitude: number;
}

const coords: Ref<GeoLocation | undefined>= ref()
//any message to show the user
let message: Ref<string | undefined>= ref("")
//in case user denies access to geoLoc API
const geoLocationBlockedByUser: Ref<boolean>= ref(false)
const hasGeoLocation = (): boolean => {
    //check if client has geolocation API
    return ("geolocation" in navigator)?true:false
}
//get geoloc
const getGeoLocation = async (): Promise<void> => {
    await navigator.geolocation.getCurrentPosition(
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
    //first check if geolocation services are available
    if(hasGeoLocation()){
        await getGeoLocation()
    }
    else {
        message.value = "Geolocation not available"
    }
})
</script>

<template>
    <div v-if="coords && !geoLocationBlockedByUser">{{ coords.latitude }} {{ coords.longitude }}</div>
    <div v-if="geoLocationBlockedByUser || !hasGeoLocation">{{ message }}</div>
</template>