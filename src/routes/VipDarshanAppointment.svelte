<script lang="ts">
    import {
        createAppointment,
        getDevoteeProfile,
        getBookingSlotInfo,
        getProtocolList,
        getVipDarshanSlots,
        getAppointment,
        updateAppointment,
        submitAppointment,
    } from "@src/api.js";
    import { auth_token } from "@src/store.js";
    import { get } from "svelte/store";
    import { Modal, Badge } from "flowbite-svelte";
    import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import type {
        DevoteeeProfile,
        Protocol,
        Companion,
        VipDarshanSlot,
        AppointmentFull,
    } from "@src/app.js";

    export let open = false;
    export let appointment_id: string | null = null;

    let title = "Book VIP Darshan (Protocol)";
    export let subtitle = "Select your protocol category to proceed.";
    export let sectionTitle = "Book VIP Darshan";

    $: title = appointment_id
        ? "Edit VIP Darshan Appointment"
        : "Book VIP Darshan (Protocol)";

    let profile: DevoteeeProfile;
    let protocol_list: Protocol[];
    let companion: Companion[] = [];

    let slots: VipDarshanSlot[] = [];

    let selectedProtocol = "";
    let devoteee_name = "";
    let slot_date = "";
    let selectedSlotName = "";
    let selectedState = "";
    let loading = false;
    let appointmentState = "";

    function addCompanion() {
        const c: Companion = {
            companion_name: "",
            phone: null,
            gender: "",
            age: 0,
        };
        companion = [...companion, c];
    }
    function removeCompanion(i: number) {
        companion = companion.filter((_, idx) => idx !== i);
    }

    async function fetch_slot_info(slot_date: string) {
        const data = await getVipDarshanSlots(slot_date);
        slots = data?.message || [];
    }
    function select_slot(slot_name: string) {
        selectedSlotName = slot_name;
        toast.message("Selected " + selectedSlotName);
    }

    function getAppointmentDetails() {
        return {
            slot_date: slot_date,
            slot: selectedSlotName,
            protocol: selectedProtocol,
            state: selectedState,
            companion: companion,
        };
    }

    async function createAppointmentFunc() {
        loading = true;
        const details = getAppointmentDetails();
        try {
            const token = get(auth_token);
            const result_data = await createAppointment(token, details);
            const result: AppointmentFull = result_data?.meeage;
            if (result) {
                appointment_id = result.name; // assuming id is name
                appointmentState = result.workflow_state;
                toast.message("Appointment created successfully");
            } else {
                toast.error("Failed to create appointment");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to create appointment");
        } finally {
            loading = false;
        }
    }

    async function saveAppointment() {
        if (!appointment_id) return;
        loading = true;
        const details = getAppointmentDetails();
        try {
            const token = get(auth_token);
            await updateAppointment(token, appointment_id, details);
            await resetForm();
            toast.message("Appointment saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save appointment");
        } finally {
            loading = false;
        }
    }

    async function submitAppointmentFunc() {
        if (!appointment_id) return;
        loading = true;
        try {
            const token = get(auth_token);
            await submitAppointment(token, appointment_id);
            await resetForm();
            // appointmentState = result_data?.message.workflow_state;
            toast.message("Appointment submitted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit appointment");
        } finally {
            loading = false;
        }
    }

    async function resetForm() {
        const token = get(auth_token);

        if (appointment_id) {
            const appointment_data = await getAppointment(
                token,
                appointment_id,
            );
            const appointment: AppointmentFull = appointment_data?.message;
            console.log(appointment);
            slot_date = appointment.slot_date;
            selectedSlotName = appointment.slot;
            selectedProtocol = appointment.protocol;
            selectedState = appointment.state;
            companion = appointment.companion;
            appointmentState = appointment.workflow_state;
            devoteee_name = appointment.devoteee_name;
        } else {
            const profile_data = await getDevoteeProfile(token);
            profile = profile_data?.message;
            companion = profile?.companion;
        }
    }

    onMount(async () => {
        loading = true;
        await resetForm();
        const protocols_data = await getProtocolList(get(auth_token));
        protocol_list = protocols_data?.message;

        loading = false;
    });
</script>

{#if loading}
    <h1>Loading</h1>
{:else}
    <Modal bind:open size="xl" class="w-full">
        <div class="bg-white rounded-xl shadow-lg p-5 sm:p-6 overflow-auto">
            <h1
                class="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-1"
            >
                {title}
            </h1>
            <p class="text-sm sm:text-base text-gray-500 text-center mb-4">
                {subtitle}
            </p>

            {#if appointment_id}
                <div class="mb-4">
                    <strong>Appointment ID:</strong>
                    {appointment_id}
                    <Badge
                        color={appointmentState === "draft"
                            ? "blue"
                            : appointmentState === "pending"
                              ? "orange"
                              : "green"}
                        class="ml-2"
                    >
                        {appointmentState}
                    </Badge>
                </div>
            {/if}

            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-900">
                    {sectionTitle}
                </h2>
            </div>

            {#if !(profile?.devoteee_name || devoteee_name)}
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
            <label class="block text-sm font-semibold text-gray-700 mb-1"
                >Devotee</label
            >
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                {profile?.devoteee_name || devoteee_name}
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

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-2"
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

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-2">
                Available Slots
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {#if slots?.length > 0}
                    {#each slots as s (s.slot_name)}
                        <button
                            class={`flex flex-col items-center justify-center gap-1 min-h-[64px] p-3 border-2 ${selectedSlotName === s.slot_name ? "bg-green-100 border-green-500" : "bg-white border-gray-300"} `}
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

            {#if !appointment_id}
                <button
                    class="w-full h-12 mt-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
                    on:click={createAppointmentFunc}
                    disabled={loading}
                >
                    {#if loading}Processing...{:else}Create Appointment{/if}
                </button>
            {:else if appointmentState === "Draft"}
                <div class="flex gap-3 mt-3">
                    <button
                        class="flex-1 h-12 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                        on:click={saveAppointment}
                        disabled={loading}
                    >
                        {#if loading}Processing...{:else}Save{/if}
                    </button>
                    <button
                        class="flex-1 h-12 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
                        on:click={submitAppointmentFunc}
                        disabled={loading}
                    >
                        {#if loading}Processing...{:else}Submit{/if}
                    </button>
                </div>
            {/if}

            {#if !appointment_id || appointmentState === "Draft"}
                <button
                    class="w-full h-12 mt-3 rounded-lg font-bold bg-gray-600 text-white hover:bg-gray-700 transition"
                    on:click={resetForm}
                >
                    Clear Form
                </button>
            {/if}
        </div>
    </Modal>
{/if}
