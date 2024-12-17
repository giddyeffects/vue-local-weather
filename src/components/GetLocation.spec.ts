import { shallowMount } from "@vue/test-utils";
import GetLocation from "./GetLocation.vue";
import { vi } from "vitest";

describe("GetLocation", (): void => {
    it("should render the component without crashing", async (): Promise<void> => {
        const compo = await shallowMount(GetLocation);
        expect(compo).toBeTruthy();
    })
    it("displays when geolocation resolved successfully", async (): Promise<void> => {
        const mockGeolocation = vi.fn((successCallback: Function) => {
            const position = {
                coords: {
                    latitude: 26.148,
                    longitude: 57.634,
                },
            }
            successCallback(position)
        })
        global.navigator.geolocation = {
            getCurrentPosition: mockGeolocation
        }
        const wrapper = await shallowMount<GetLocation>(GetLocation)
        expect(wrapper.vm.coords).toEqual({
            latitude: 26.148,
            longitude: 57.634,
        })
    })
    it("displays a message when user denied access", async (): Promise<void> => {
        const mockGeolocation = vi.fn((successCallback: Function, errorCallback: Function) => {
            const error = new Error("User denied geolocation access")
            errorCallback(error)
        })
        global.navigator.geolocation = {
            getCurrentPosition: mockGeolocation
        }
        const wrapper = await shallowMount<GetLocation>(GetLocation)
        expect(wrapper.vm.geolocationBlockedByUser).toEqual(true)
        expect(wrapper.html()).toContain("User denied access")
    })    
})