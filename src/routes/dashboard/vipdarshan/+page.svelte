<script lang="ts">
    import { goto } from "$app/navigation";
    import { createAppointment, getDevoteeProfile, getBookingSlotInfo } from "@src/api.js";
    import { auth_token } from "@src/store.js";
    import { get } from "svelte/store";
    import { Badge } from "flowbite-svelte";
    import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
    import { slotTimeTo12hr } from "@src/utils.js";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    export let title = "Book VIP Darshan (Protocol)";
    export let subtitle = "Select your protocol category to proceed.";
    export let sectionTitle = "Book VIP Darshan";

    let profile_data: any = null;
    let devoteee_name = "";
    export let protocols = [
        {
            value: "state-guest-class-1",
            label: "State Guest - Class I",
            fee: 500,
        },
        {
            value: "state-guest-class-2",
            label: "State Guest - Class II",
            fee: 500,
        },
        { value: "mp-govt-official", label: "MP Govt. Official", fee: 500 },
    ];

    let selectedProtocolValue = "";
    let companions: {
        name: string;
        phone: string;
        age: number;
        gender: string;
    }[] = [];
    let appointment_date = "";
    let selectedSlotName = "";
    let selected_slot_start_time = "";
    let selected_slot_end_time = "";
    let authorityLetterFile: File | null = null;
    let loading = false;
    let bookingSuccess = false;
    interface Slot {
        slot_name: string;
        slot_start_time: string;
        slot_end_time: string;
        seats: number;
        slot_capacity: number;
        [key: string]: any; // Allow additional properties
    }
    let slots_data: Slot[] = [];

    $: feePerPerson =
        protocols.find((p) => p.value === selectedProtocolValue)?.fee ?? 0;
    $: total = feePerPerson * (1 + companions.length);

    function addCompanion() {
        companions = [
            ...companions,
            { name: "", phone: "", age: 0, gender: "male" },
        ];
    }
    function removeCompanion(i: number) {
        companions = companions.filter((_, idx) => idx !== i);
    }
    async function submitBooking() {
        loading = true;
        const details = {
            appointment_date,
            slot_name: selectedSlotName,
            slot_start_time: selected_slot_start_time,
            slot_end_time: selected_slot_end_time,
            darshan_with_protocol: 1,
            protocol_rank: selectedProtocolValue,
            government_authority_letter: authorityLetterFile?.name || "",
            darshan_companion: companions.map((c) => ({
                companion_name: c.name,
                companion_phone: c.phone,
                companion_age: c.age,
                companion_gender: c.gender,
            })),
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
    function handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        authorityLetterFile = input.files?.[0] ?? null;
    }
    function slotClass(s: Slot) {
        const isSelected = selectedSlotName === s.slot_name;
        return `
            border rounded-lg transition
            ${isSelected ? "border-blue-700 bg-blue-100 ring-2 ring-blue-300" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}
            ${s.seats === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `;
    }

    async function fetch_slot_info(date: string) {
        const token = get(auth_token);
        const data = await getBookingSlotInfo(token, date);
        slots_data = data?.message || [];
    }
    function select_slot(
        slot_name: string,
        slot_start_time: string,
        slot_end_time: string,
    ) {
        selectedSlotName = slot_name;
        selected_slot_start_time = slot_start_time;
        selected_slot_end_time = slot_end_time;

        toast.message(
            "Selected " +
                selectedSlotName +
                " " +
                selected_slot_start_time +
                " TO " +
                selected_slot_end_time,
        );
    }
    onMount(async () => {
        const token = get(auth_token);
        const data = await getDevoteeProfile(token);
        profile_data = data?.message?.profile;
        devoteee_name = profile_data?.devoteee_name;
    });
</script>

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
            <h2 class="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
        </div>

        {#if !(devoteee_name?.length > 0)}
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4">
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
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                {devoteee_name}
            </div>

            <label for="protocol-select" class="block text-sm font-semibold text-gray-700 mt-2 mb-1"
                >Protocol</label
            >
            <select
                id="protocol-select"
                class="w-full border border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                bind:value={selectedProtocolValue}
            >
                <option value="" disabled selected>Select Protocol</option>
                {#each protocols as p}
                    <option value={p.value}>{p.label}</option>
                {/each}
            </select>

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-2"
                >Companions ({companions.length})</label
            >
            <div class="space-y-3">
                {#each companions as c, i}
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
                                bind:value={companions[i].name}
                            />
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="sr-only">Phone</label>
                            <input
                                class="w-full border border-gray-300 rounded-lg p-2"
                                type="tel"
                                placeholder="Phone"
                                bind:value={companions[i].phone}
                            />
                        </div>

                        <!-- Age -->
                        <div>
                            <label class="sr-only">Age</label>
                            <input
                                class="w-full border border-gray-300 rounded-lg p-2"
                                type="number"
                                placeholder="Age"
                                bind:value={companions[i].age}
                            />
                        </div>

                        <!-- Gender + remove button -->
                        <div class="flex gap-2 items-center">
                            <select
                                id="gender-select"
                                class="rounded-lg w-full p-2 border border-gray-300"
                                bind:value={companions[i].gender}
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
                        on:click={addCompanion}
                    >
                        + Add Companion
                    </button>
                </div>
            </div>

            <label for="date-input" class="block text-sm font-semibold text-gray-700 mt-4 mb-1"
                >Date of Visit</label
            >
            <input
                id="date-input"
                class="border border-gray-300 rounded-lg p-2 w-full"
                type="date"
                bind:value={appointment_date}
                on:change={() => fetch_slot_info(appointment_date)}
            />

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-2">
                Available Slots
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {#if slots_data?.length > 0}
                    {#each slots_data as s (s.slot_name)}
                        <button
                            class={`flex flex-col items-center justify-center gap-1 min-h-[64px] p-3 bg-white ${slotClass(s)}`}
                            on:click={() =>
                                select_slot(
                                    s.slot_name,
                                    s.slot_start_time,
                                    s.slot_end_time,
                                )}
                            disabled={s.seats === 0}
                            aria-pressed={selectedSlotName === s.slot_name}
                        >
                            <div
                                class="text-gray-900 font-bold text-sm sm:text-base"
                            >
                                {slotTimeTo12hr(s.slot_start_time)} – {slotTimeTo12hr(
                                    s.slot_end_time,
                                )}
                            </div>
                            <div class="text-green-600 text-sm">
                                {s.slot_capacity} Seats
                            </div>
                        </button>
                    {/each}
                {:else}
                    <div class="text-sm text-gray-500 col-span-full">
                        No slots available for selected date.
                    </div>
                {/if}
            </div>

            <label for="file-input" class="block text-sm font-semibold text-gray-700 mt-4 mb-1"
                >Authority Letter (PDF)</label
            >
            <input
                id="file-input"
                class="border border-gray-300 rounded-lg p-2 w-full"
                type="file"
                accept=".pdf"
                on:change={handleFileChange}
            />
            {#if authorityLetterFile}
                <div class="text-gray-500 text-sm mt-1">
                    Selected: {authorityLetterFile.name}
                </div>
            {/if}

            <div class="text-gray-500 text-sm mt-2">
                Fee: {feePerPerson} | Total: {total}
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
