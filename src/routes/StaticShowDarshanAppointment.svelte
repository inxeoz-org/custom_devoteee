<script lang="ts">
    import { getAppointment } from "@src/api.js";
    import { auth_token } from "@src/store.js";
    import { get } from "svelte/store";
    import { Modal, Badge } from "flowbite-svelte";
    import { ArrowUpRightFromSquareOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import type {
        DevoteeeProfile,
        Protocol,
        Companion,
        VipDarshanSlot,
        AppointmentFull,
    } from "@src/app.js";

    export let open = false;
    export let appointment_id: string | null = null;

    let title = "View VIP Darshan Appointment";
    export let subtitle = "Appointment details.";
    export let sectionTitle = "VIP Darshan Appointment";

    let appointment: AppointmentFull;

    let loading = false;

    async function resetForm() {
        const token = get(auth_token);

        if (appointment_id) {
            const appointment_data = await getAppointment(
                token,
                appointment_id,
            );
            appointment = appointment_data?.message;
        }
    }

    onMount(async () => {
        loading = true;
        await resetForm();
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
                        color={appointment.workflow_state === "draft"
                            ? "blue"
                            : appointment.workflow_state === "pending"
                              ? "orange"
                              : "green"}
                        class="ml-2"
                    >
                        {appointment.workflow_state}
                    </Badge>
                </div>
            {/if}

            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-900">
                    {sectionTitle}
                </h2>
            </div>

            {#if !appointment?.devoteee_name}
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
                {appointment.devoteee_name}
            </div>

            <label class="block text-sm font-semibold text-gray-700 mt-2 mb-1"
                >Protocol</label
            >
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                {appointment.protocol || "Not selected"}
            </div>

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-2"
                >Companions ({appointment.companion.length})</label
            >
            <div class="space-y-3">
                {#each appointment.companion as c, i}
                    <div
                        class="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end"
                    >
                        <!-- Full name -->
                        <div class="col-span-1">
                            <label class="sr-only">Full name</label>
                            <div
                                class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                            >
                                {c.companion_name || ""}
                            </div>
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="sr-only">Phone</label>
                            <div
                                class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                            >
                                {c.phone || ""}
                            </div>
                        </div>

                        <!-- Age -->
                        <div>
                            <label class="sr-only">Age</label>
                            <div
                                class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                            >
                                {c.age || ""}
                            </div>
                        </div>

                        <!-- Gender -->
                        <div>
                            <label class="sr-only">Gender</label>
                            <div
                                class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                            >
                                {c.gender || ""}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-1"
                >State</label
            >
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                {appointment.state}
            </div>

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-1"
                >Date of Visit</label
            >
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                {appointment.slot_date}
            </div>

            <label class="block text-sm font-semibold text-gray-700 mt-4 mb-2">
                Selected Slot
            </label>
            <div class="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                {appointment.slot || "No slot selected"}
            </div>
        </div>
    </Modal>
{/if}
