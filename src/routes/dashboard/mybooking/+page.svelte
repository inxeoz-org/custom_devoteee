<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import ShowAppointment from "@src/routes/ShowAppointment.svelte";
    import { getAppointmentList } from "@src/api.js";
    import { auth_token } from "@src/store.js";
    import { get } from "svelte/store";
    import type { Booking, Status } from "@src/appointment.js";
    import type { AppointmentBasic } from "@src/app.js";
    import { Card, Button, Badge } from "flowbite-svelte";

    let appointments: AppointmentBasic[] = [];
    export let limitStart = 0;
    export let pageLength = 10;

    export let heading = "My Bookings";
    export let subtitle = "View your darshan bookings.";
    export let sectionTitle = "My Bookings";

    let loading = false;
    let error: string | null = null;

    let show = false;
    let selectedAppointmentId: string | null = null;

    function badgeClass(workflowState: Status | string) {
        switch (workflowState) {
            case "Approved":
                return "green";
            case "Pending":
                return "orange";
            case "Pending Verification":
                return "blue";
            default:
                return "gray";
        }
    }

    async function FetchBookings() {
        loading = true;
        error = null;

        const token = get(auth_token);
        const data = await getAppointmentList(token, {
            limitStart,
            pageLength,
        });
        appointments = data?.message;
        loading = false;
    }

    onMount(() => FetchBookings());

    function openModal(appointment_id: string) {
        selectedAppointmentId = appointment_id;
        show = true;
    }
    function handleModalClose() {
        show = false;
    }
</script>

<div class="min-h-screen bg-slate-50 p-6 flex justify-center">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <div class="text-center mb-4">
            <h1 class="text-2xl font-extrabold text-slate-800">{heading}</h1>
            <p class="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-700">{sectionTitle}</h2>
            <div class="flex items-center gap-3">
                <Button
                    color="light"
                    onclick={FetchBookings}
                    disabled={loading}
                >
                    {#if loading}
                        Refreshing...
                    {:else}
                        Refresh
                    {/if}
                </Button>
            </div>
        </div>

        {#if error}
            <div class="text-red-600 mb-3">Error: {error}</div>
        {/if}

        <section>
            <h3 class="text-sm font-semibold text-slate-700 mb-2">Bookings</h3>
            <div class="grid gap-3">
                {#if loading && appointments.length === 0}
                    <div class="text-slate-500">Loading bookings…</div>
                {:else}
                    {#each appointments as a}
                        <Button
                            class="flex items-start justify-between p-4 rounded-xl border bg-white hover:shadow-sm"
                            color="light"
                            onclick={() => openModal(a.name)}
                            aria-label={`Open booking ${a.name}`}
                        >
                            <div class="text-left">
                                <div class="font-semibold text-slate-800">
                                    {a.name}
                                </div>
                                <div class="text-xs text-slate-500 mt-1">
                                    Darshan: {a.slot}
                                </div>
                                <div class="text-xs text-slate-400 mt-1">
                                    {a.slot_date}
                                </div>
                            </div>
                            <div class="ml-4">
                                <Badge color={badgeClass(a.workflow_state)}>
                                    {a.workflow_state}
                                </Badge>
                            </div>
                        </Button>
                    {/each}
                    {#if appointments.length === 0 && !loading}
                        <div class="text-slate-500">No bookings.</div>
                    {/if}
                {/if}
            </div>
        </section>
    </div>
</div>

{#if show && selectedAppointmentId}
    <ShowAppointment
        appointmentId={selectedAppointmentId}
        on:close={handleModalClose}
    />
{/if}
