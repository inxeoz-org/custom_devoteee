<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        createAppointment,
        getDevoteeProfile,
        getBookingSlotInfo,
        getProtocolList,
        getVipDarshanSlots,
    } from "@src/api.js";
    import { auth_token } from "@src/store.js";
    import { get } from "svelte/store";
    import { Badge } from "flowbite-svelte";
    import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
    import { slotTimeTo12hr } from "@src/utils.js";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import type {
        DevoteeeProfile,
        Protocol,
        Companion,
        VipDarshanSlot,
    } from "@src/app.js";

    export let title = "Book VIP Darshan (Protocol)";
    export let subtitle = "Select your protocol category to proceed.";
    export let sectionTitle = "Book VIP Darshan";

    let profile: DevoteeeProfile;
    let protocol_list: Protocol[];
    let companion: Companion[] = [];

    let slots: VipDarshanSlot[] = [];

    let selectedProtocol = "";

    let slot_date = "";
    let selectedSlotName = "";
    let selectedState = "";
    let loading = false;
    let bookingSuccess = false;

    function addCompanion() {
        const c: Companion = {
            companion_name: "",
            phone: null,
            gender: "",
            age: 0,
        };
        companion.push(c);
    }
    function removeCompanion(i: number) {
        companion = companion.filter((_, idx) => idx !== i);
    }
    async function submitBooking() {
        loading = true;
        const details = {
            slot_date: slot_date,
            slot: selectedSlotName,
            protocol: selectedProtocol,
            state: selectedState,
            companion: companion,
        };
        try {
            const token = get(auth_token);
            await createAppointment(token, details);
            bookingSuccess = true;
        } catch (err) {
            console.error(err);
            alert("Failed to submit. Check console.");
        } finally {
            loading = false;
        }
    }

    function slotClass(s: VipDarshanSlot) {
        const isSelected = selectedSlotName === s.slot_name;
        return `
            border rounded-lg transition
            ${isSelected ? "border-blue-700 bg-blue-100 ring-2 ring-blue-300" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}
            ${s.seats === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `;
    }

    async function fetch_slot_info(slot_date: string) {
        const data = await getVipDarshanSlots(slot_date);
        slots = data?.message || [];
    }
    function select_slot(slot_name: string) {
        selectedSlotName = slot_name;
        toast.message("Selected " + selectedSlotName);
    }
    onMount(async () => {
        loading = true;
        const token = get(auth_token);
        const profile_data = await getDevoteeProfile(token);
        const protocols_data = await getProtocolList(token);
        protocol_list = protocols_data?.message;
        profile = profile_data?.message;

        console.log("Profile:", profile);
        console.log("Protocols:", protocol_list);
        loading = false;
    });
</script>

{#if loading}
    <div class="min-h-screen bg-gray-100 grid place-items-center px-4 py-6">
        <div
            class="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-5 sm:p-6 overflow-auto"
        >
            <h1
                class="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-1"
            >
                {title}
            </h1>
            <p class="text-sm sm:text-base text-gray-500 text-center mb-4">
                {subtitle}
            </p>

            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-900">
                    {sectionTitle}
                </h2>
            </div>

            {#if !(profile.devoteee_name.length > 0 || profile.phone.length > 0)}
                <div
                    class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4"
                >
                    <a href="/" class="block mb-2 text-gray-500 font-semibold"
                        >Complete profile required !!!</a
                    >
                    <a
                        href="/"
                        class="text-blue-600 inline-flex items-center hover:underline"
                    >
                        Complete Profile Dashboard
                        <ArrowUpRightFromSquareOutline class="ms-2.5 h-4 w-4" />
                    </a>
                </div>
            {/if}

            {#if !bookingSuccess}
                <label class="block text-sm font-semibold text-gray-700 mb-1"
                    >Primary Devotee</label
                >
                <div
                    class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3"
                >
                    {profile.devoteee_name}
                </div>

                <label
                    for="protocol-select"
                    class="block text-sm font-semibold text-gray-700 mt-2 mb-1"
                    >Protocol</label
                >
                <select
                    id="protocol-select"
                    class="w-full border border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    bind:value={selectedProtocol}
                >
                    <option value="" disabled selected>Select Protocol</option>
                    {#each protocol_list as p}
                        <option value={p.name}>{p.name}</option>
                    {/each}
                </select>

                <label
                    class="block text-sm font-semibold text-gray-700 mt-4 mb-2"
                    >Companions ({companion.length})</label
                >
                <div class="space-y-3">
                    {#each companion as c, i}
                        <div
                            class="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end"
                        >
                            <!-- Full name -->
                            <div class="col-span-1">
                                <label class="sr-only">Full name</label>
                                <input
                                    class="w-full border border-gray-300 rounded-lg p-2"
                                    type="text"
                                    placeholder="Full name"
                                    bind:value={companion[i].companion_name}
                                />
                            </div>

                            <!-- Phone -->
                            <div>
                                <label class="sr-only">Phone</label>
                                <input
                                    class="w-full border border-gray-300 rounded-lg p-2"
                                    type="tel"
                                    placeholder="Phone"
                                    bind:value={companion[i].phone}
                                />
                            </div>

                            <!-- Age -->
                            <div>
                                <label class="sr-only">Age</label>
                                <input
                                    class="w-full border border-gray-300 rounded-lg p-2"
                                    type="number"
                                    placeholder="Age"
                                    bind:value={companion[i].age}
                                />
                            </div>

                            <!-- Gender + remove button -->
                            <div class="flex gap-2 items-center">
                                <select
                                    id="gender-select"
                                    class="rounded-lg w-full p-2 border border-gray-300"
                                    bind:value={companion[i].gender}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <button
                                    type="button"
                                    class="bg-red-100 text-red-700 rounded-lg px-3 py-2 cursor-pointer"
                                    on:click={() => removeCompanion(i)}
                                    aria-label="Remove companion"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    {/each}

                    <div>
                        <button
                            type="button"
                            class="bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2 font-semibold cursor-pointer"
                            on:click={() => addCompanion()}
                        >
                            + Add Companion
                        </button>
                    </div>
                </div>

                <label
                    for="date-input"
                    class="block text-sm font-semibold text-gray-700 mt-4 mb-1"
                    >Date of Visit</label
                >
                <input
                    id="date-input"
                    class="border border-gray-300 rounded-lg p-2 w-full"
                    type="date"
                    bind:value={slot_date}
                    on:change={() => fetch_slot_info(slot_date)}
                />

                <label
                    for="state-input"
                    class="block text-sm font-semibold text-gray-700 mt-4 mb-1"
                    >State</label
                >
                <input
                    id="state-input"
                    class="border border-gray-300 rounded-lg p-2 w-full"
                    type="text"
                    bind:value={selectedState}
                />

                <label
                    class="block text-sm font-semibold text-gray-700 mt-4 mb-2"
                >
                    Available Slots
                </label>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                >
                    {#if slots?.length > 0}
                        {#each slots as s (s.slot_name)}
                            <button
                                class={`flex flex-col items-center justify-center gap-1 min-h-[64px] p-3 bg-white ${slotClass(s)}`}
                                on:click={() => select_slot(s.slot_name)}
                                aria-pressed={selectedSlotName === s.slot_name}
                            >
                                <div
                                    class="text-gray-900 font-bold text-sm sm:text-base"
                                >
                                    {s.slot_name}
                                </div>
                                <div class="text-green-600 text-sm">
                                    {s.current_capacity} Seats
                                </div>
                            </button>
                        {/each}
                    {:else}
                        <div class="text-sm text-gray-500 col-span-full">
                            No slots available for selected date.
                        </div>
                    {/if}
                </div>

                <button
                    class="w-full h-12 mt-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                    on:click={submitBooking}
                    disabled={loading}
                >
                    {#if loading}Processing...{:else}Apply For Appointment{/if}
                </button>
            {:else}
                <div class="text-center mt-6">
                    <Badge color="green" class="text-base"
                        >Appointment applied.</Badge
                    >
                    <div
                        class="flex flex-col sm:flex-row gap-3 mt-4 justify-center"
                    >
                        <button
                            class="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold"
                            on:click={() => goto("/dashboard/mybooking")}
                            >See your bookings</button
                        >
                        <button
                            class="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-4 py-2 font-semibold"
                            on:click={() => goto("/dashboard")}
                            >Back to Dashboard</button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
{:else}
    <h1>Loading</h1>
{/if}
