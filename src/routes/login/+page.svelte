<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Card, Button, Label, Input } from "flowbite-svelte";
    import { Badge } from "flowbite-svelte";

    import { user_logged_in, auth_token } from "@src/store.js";

    import { loginCheck, verifyOtpLogin } from "@src/api.ts";
    import { toast } from "svelte-sonner";

    // phone as string to allow leading + / 0 etc
    export let phone = "";
    let otp: string = "";
    let loading: boolean = false;
    let otpSent: boolean = false;
    let otpLoading: boolean = false;

    async function sendOtp() {
        if (!phone.trim()) {
            toast.error("Please enter phone number");
            return;
        }

        otpLoading = true;
        const result = await loginCheck(phone);

        if (result?.message) {
            otpSent = true;
            toast.success("OTP sent to your phone");
        } else {
            toast.error("Failed to send OTP: " + JSON.stringify(result));
        }

        otpLoading = false;
    }

    async function verifyOtp(e: SubmitEvent) {
        e?.preventDefault();

        if (!otp.trim()) {
            toast.error("Please enter OTP");
            return;
        }

        loading = true;

        const result = await verifyOtpLogin(phone, otp);

        if (result?.message) {
            // Save the token
            auth_token.set(result.message);
            user_logged_in.set(true);
            toast.success("Login successful");
            await goto("/dashboard");
        } else {
            toast.error("Invalid OTP: " + JSON.stringify(result));
            loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card class="w-full max-w-md p-10">
        {#if !otpSent}
            <!-- Phone Number Input -->
            <form
                class="space-y-4"
                on:submit|preventDefault={sendOtp}
                aria-busy={otpLoading}
            >
                <h2
                    class="text-xl font-semibold text-gray-800 flex justify-center"
                >
                    Login
                </h2>

                <Badge color="indigo">Devoteee</Badge>

                <div>
                    <Label for="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        type="text"
                        bind:value={phone}
                        placeholder="Enter phone number"
                        inputmode="tel"
                        autocomplete="tel"
                        required
                    />
                </div>

                <div class="flex items-center justify-center">
                    <Button
                        type="submit"
                        disabled={otpLoading}
                        aria-disabled={otpLoading}
                        class="min-lg:w-7xl"
                    >
                        {#if otpLoading}Sending OTP...{:else}Send OTP{/if}
                    </Button>
                </div>
            </form>
        {:else}
            <!-- OTP Verification -->
            <form class="space-y-4" on:submit={verifyOtp} aria-busy={loading}>
                <h2
                    class="text-xl font-semibold text-gray-800 flex justify-center"
                >
                    Verify OTP
                </h2>

                <Badge color="indigo">Devoteee</Badge>

                <div>
                    <Label for="otp">Enter OTP</Label>
                    <Input
                        id="otp"
                        type="text"
                        bind:value={otp}
                        placeholder="Enter 6-digit OTP"
                        inputmode="numeric"
                        maxlength="6"
                        required
                    />
                    <p class="text-sm text-gray-600 mt-1">
                        OTP sent to: {phone}
                    </p>
                </div>

                <div class="flex items-center justify-center space-x-2 mb-4">
                    <Button
                        type="button"
                        color="light"
                        on:click={() => {
                            otpSent = false;
                            otp = "";
                            loading = false;
                            otpLoading = false;
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        type="button"
                        color="outline"
                        disabled={otpLoading}
                        on:click={sendOtp}
                    >
                        {#if otpLoading}Sending...{:else}Resend OTP{/if}
                    </Button>
                </div>

                <div class="flex items-center justify-center">
                    <Button
                        type="submit"
                        disabled={loading}
                        aria-disabled={loading}
                    >
                        {#if loading}Verifying...{:else}Verify OTP{/if}
                    </Button>
                </div>
            </form>
        {/if}
    </Card>
</div>
