<!-- <script>
    export let selectedDate = "";
    export let selectedTime = "";

    const timeSlots = [
        "06:00 AM - 07:00 AM",
        "07:00 AM - 08:00 AM",
        "08:00 AM - 09:00 AM",
        "09:00 AM - 10:00 AM",
        // "10:00 AM - 11:00 AM",
    ];

    function submitBooking() {
        if (!selectedDate || !selectedTime) {
            alert("Please select both date and time slot.");
            return;
        }
        alert(`Darshan booked for ${selectedDate} at ${selectedTime}`);
        // Connect to backend API to submit booking
    }
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">bhasm arti</h2>

    <label for="date" class="block mb-1 font-medium text-gray-700"
        >Select Date</label
    >
    <input
        type="date"
        id="date"
        class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        bind:value={selectedDate}
        min={new Date().toISOString().split("T")[0]}
    />

    <label for="time" class="block mb-1 font-medium text-gray-700"
        >Select Time Slot</label
    >
    <select
        id="time"
        class="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        bind:value={selectedTime}
    >
        <option value="" disabled selected>Choose a time slot</option>
        {#each timeSlots as slot}
            <option value={slot}>{slot}</option>
        {/each}
    </select>

    <button
        class="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
        on:click={submitBooking}
    >
        Book Now
    </button>
</div> -->
