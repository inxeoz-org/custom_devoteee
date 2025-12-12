<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Card, Button, Alert, Badge } from "flowbite-svelte";

    import { getDevoteeProfile } from "@src/api.js";
    import type { DevoteeeProfile } from "@src/app.js";
    let is_basic_info_completed = false;
    let profile: DevoteeeProfile;
    export let title = "Dashboard";
    export let welcome = "Welcome back!";

    let show_dashboard = false;

    const defaultActions = [
        {
            id: "myProfile",
            label: "My Profile",
            site: "/dashboard/profile/",
            button_color: "green",
        },
        {
            id: "viewBookings",
            label: "Vip Bookings",
            site: "/dashboard/mybooking",
            button_color: "blue",
        },
        {
            id: "bookShigra",
            label: "Book - Shigra Darshan",
            site: "/dashboard/shigra",
            button_color: "light",
        },

        {
            id: "bookLocalide",
            label: "Book - Localide Darshan",
            site: "/dashboard/localide",
            button_color: "light",
        },
        {
            id: "bookBhasm",
            label: "Book - Bhasm Arti",
            site: "/dashboard/bhasmarti",
            button_color: "light",
        },
    ];

    onMount(async () => {
        try {
            const data = await getDevoteeProfile();
            profile = data?.message;

            is_basic_info_completed =
                profile.devoteee_name !== null && profile.phone !== null;
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    });

    function onActionClicked(site?: string) {
        if (site) goto(site);
    }
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    {#if show_dashboard}
        <Card class="w-full max-w-2xl text-center p-10">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p class="text-gray-600 mb-4">
                {welcome}
                {#if profile.devoteee_name}
                    {profile.devoteee_name}
                {:else}
                    {"devotee"}
                {/if}
            </p>

            {#if !is_basic_info_completed}
                <Alert color="red">
                    Please complete your profile to continue.
                    <Badge
                        color="gray"
                        outline
                        size="sm"
                        class="ml-2 cursor-pointer"
                        onclick={() =>
                            goto("/dashboard/profile/update_profile")}
                    >
                        Complete the Profile
                    </Badge>
                </Alert>
            {/if}

            <div class="grid gap-3 mt-4">
                {#each defaultActions as action (action.id)}
                    <Button
                        color={action.button_color}
                        onclick={() => onActionClicked(action.site)}
                        pill
                    >
                        {action.label}
                    </Button>
                {/each}
            </div>
        </Card>
    {:else}
        <p class="text-gray-600">
            Details Not Found ! <Badge
                color="red"
                class="cursor-pointer"
                onclick={() => goto("/login")}>Login First</Badge
            >
        </p>
    {/if}
</div>
