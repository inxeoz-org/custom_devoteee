<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher, tick } from "svelte";
    import { Button, Modal, Badge } from "flowbite-svelte";

    import { getAppointment, submitAppointment } from "@src/api.js";
    import { auth_token } from "@src/store.js";
    import { get } from "svelte/store";
    import { toast } from "svelte-sonner";
    import type { AppointmentFull } from "@src/app.js";

    let workflow_state = "Demo";

    let appointment: AppointmentFull;

    export let appointmentId: string;

    const dispatch = createEventDispatcher();

    let loading = false;
    let submitting = false;
    let error: string | null = null;
    let showRaw = false;
    // local modal open — used for Flowbite's bind:open (triggers modal open/close)
    let open = true;

    async function fetchAppointment() {
        if (!appointmentId) {
            error = "No appointment id provided.";
            return;
        }
        loading = true;
        error = null;
        try {
            const token = get(auth_token);
            const payload = await getAppointment(token, appointmentId);
            appointment = payload?.message;
            workflow_state = appointment.workflow_state;
            console.log(workflow_state);
        } catch (err: any) {
            error = err?.message ?? String(err);
        } finally {
            loading = false;
        }
    }

    // Prevent recursion: use handleClose everywhere
    async function handleClose() {
        // start modal close animation by toggling bound open
        open = false;

        // Wait a tick for DOM/Flowbite to start close animation; small delay helps animation finish
        // If you prefer immediate unmount, dispatch immediately.
        await tick();
        // allow animation to run — adjust 200ms if needed to match Flowbite animation length
        setTimeout(() => {
            dispatch("close");
        }, 200);
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") handleClose();
    }

    onMount(() => {
        fetchAppointment();
        window.addEventListener("keydown", onKeydown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", onKeydown);
    });

    async function handleSubmitAppointment() {
        if (!appointmentId) return;

        submitting = true;
        try {
            const token = get(auth_token);
            const result = await submitAppointment(token, appointmentId);

            if (result?.message) {
                toast.success("Appointment submitted successfully!");
                // Refresh appointment appointment to show updated workflow_state
                await fetchAppointment();
            } else {
                toast.error(
                    "Failed to submit appointment: " + JSON.stringify(result),
                );
            }
        } catch (err: any) {
            toast.error(
                "Error submitting appointment: " +
                    (err?.message || String(err)),
            );
        } finally {
            submitting = false;
        }
    }

    // safe stringify to avoid circular JSON crashes
    function safeStringify(obj: any, space = 2) {
        const seen = new WeakSet();
        return JSON.stringify(
            obj,
            function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) return "[Circular]";
                    seen.add(value);
                }
                return value;
            },
            space,
        );
    }
</script>

<Modal bind:open title="Appointment Details" size="lg" onclose={handleClose}>
    {#if loading}
        <div class="text-center text-gray-500 py-6">Loading appointment…</div>
    {:else if error}
        <div class="p-3 bg-red-50 text-red-600 rounded-md">Error: {error}</div>
    {:else if appointment}
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
                <strong>Appointment ID:</strong>
                {appointment.name}
            </div>
            <div>
                <strong>Status:</strong>
                <Badge
                    color={appointment.workflow_state === "Approved"
                        ? "green"
                        : appointment.workflow_state === "Pending"
                          ? "orange"
                          : "red"}
                >
                    {appointment.workflow_state ?? "—"}
                </Badge>
            </div>

            <div>
                <strong>Date:</strong>
                {appointment.slot_date}
            </div>

            <div>
                <strong>Slot</strong>
                {appointment.slot}
            </div>

            {#if appointment.protocol}
                <div>
                    <strong>Protocol:</strong>
                    {appointment.protocol}
                </div>
            {/if}

            {#if appointment.group_size}
                <div class="col-span-2">
                    <strong>Group Size:</strong>
                    <Badge color="blue">
                        {appointment.group_size ?? "—"}
                    </Badge>
                </div>
            {/if}
        </div>

        <div class="mb-3">
            <h3 class="font-semibold mb-1">Companions</h3>
            {#if Array.isArray(appointment.companion) && appointment.companion.length > 0}
                <ul class="divide-y divide-gray-200 border rounded-md">
                    {#each appointment.companion as c}
                        <li class="flex justify-between items-center p-2">
                            <div class="w-1/3">
                                <div class="font-semibold text-gray-800">
                                    {c.companion_name ?? "Unknown"}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {c.gender ?? ""}
                                </div>
                            </div>
                            <div class="w-1/6">
                                <div class="text-gray-800 font-medium">
                                    Age {c.age ?? "—"}
                                </div>
                            </div>
                            <div class=" w-1/3">
                                phone :
                                <Badge color="green">
                                    {c.phone ?? "—"}
                                </Badge>
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <div class="text-gray-500 text-sm italic p-2">
                    No companions listed.
                </div>
            {/if}
        </div>

        <div>
            <div class="flex flex-wrap gap-2 mb-4">
                {#if workflow_state === "Draft"}
                    <Button
                        color="blue"
                        size="sm"
                        disabled={submitting}
                        onclick={handleSubmitAppointment}
                    >
                        {#if submitting}Submitting...{:else}Submit Appointment{/if}
                    </Button>
                {/if}

                <Button
                    color="light"
                    size="sm"
                    onclick={() => (showRaw = !showRaw)}
                >
                    {showRaw ? "Hide JSON" : "Show raw JSON"}
                </Button>

                <Button
                    color="light"
                    size="sm"
                    onclick={() => {
                        navigator.clipboard
                            .writeText(safeStringify(appointment, 2))
                            .then(() => alert("JSON copied to clipboard!"))
                            .catch(() => alert("Failed to copy JSON"));
                    }}
                >
                    Copy JSON
                </Button>
            </div>

            {#if showRaw}
                <pre
                    class="bg-gray-900 text-gray-100 mt-2 p-2 rounded overflow-auto max-h-60 text-sm">
{safeStringify(appointment, 2)}</pre>
            {/if}
        </div>
    {:else}
        <div class="text-center text-gray-500 py-6">
            No appointment available.
        </div>
    {/if}
</Modal>
