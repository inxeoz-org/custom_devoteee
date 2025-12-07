import { API_BASE } from "$lib/env.js";

const DEVOTEE = `${API_BASE}/api/method/custom_booking.custom_booking.`;
const APPOINTMENT = `${API_BASE}/api/method/custom_booking.custom_booking.`;
const BOOKING = `${API_BASE}/api/method/custom_booking.custom_booking.`;

// ========== API FUNCTIONS ========== //

// Authentication APIs
export async function loginCheck(phone: string) {
  try {
    const res = await fetch(DEVOTEE + "devoteee_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("loginCheck:", err);
    return null;
  }
}

export async function verifyOtpLogin(phone: string, otp: string) {
  try {
    const res = await fetch(DEVOTEE + "devoteee_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("verifyOtpLogin:", err);
    return null;
  }
}

// Profile APIs
export async function getDevoteeProfile(token: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("getDevoteeProfile:", err);
    return null;
  }
}

export async function updateProfile(token: string, profileData: any) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(profileData),
    });
    return await res.json();
   } catch (err: any) {
    console.error("updateProfile:", err);
    return null;
  }
}

// Phone Update APIs
export async function requestUpdatePhone(token: string, newPhone: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ new_phone: newPhone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("requestUpdatePhone:", err);
    return null;
  }
}

export async function updatePhone(token: string, newPhone: string, otpPhone: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ new_phone: newPhone, otp_phone: otpPhone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("updatePhone:", err);
    return null;
  }
}

// Email Update APIs
export async function requestUpdateEmail(token: string, newEmail: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ new_email: newEmail }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("requestUpdateEmail:", err);
    return null;
  }
}

export async function updateEmail(token: string, newEmail: string, otpEmail: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ new_email: newEmail, otp_email: otpEmail }),
    });
    return await res.json();
   } catch (err: any) {
    console.error("updateEmail:", err);
    return null;
  }
}



// Companion APIs
export async function getDefaultCompanion(token: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.companion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("getDefaultCompanion:", err);
    return null;
  }
}

export async function addCompanion(token: string, companionData: { companion_name: string; gender: string; age: number }) {
  try {
    const res = await fetch(DEVOTEE + "profile.add_companion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(companionData),
    });
    return await res.json();
  } catch (err: any) {
    console.error("addCompanion:", err);
    return null;
  }
}

export async function removeCompanion(token: string, companionId: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.remove_companion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ companion_id: companionId }),
    });
    return await res.json();
   } catch (err: any) {
    console.error("removeCompanion:", err);
    return null;
  }
}



// Appointment APIs
export async function createAppointment(token: string, appointmentData: {
  slot: string;
  slot_date: string;
  protocol: string;
  state: string;
  companion: Array<{ companion_name: string; age: number; gender: string }>;
}) {
  try {
    const res = await fetch(APPOINTMENT + "appointment.create_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(appointmentData),
    });
    return await res.json();
  } catch (err: any) {
    console.error("createAppointment:", err);
    return null;
  }
}

export async function getAppointment(token: string, appointmentId: string) {
  try {
    const res = await fetch(APPOINTMENT + "appointment.get_appointment_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getAppointment:", err);
    return null;
  }
}

export async function submitAppointment(token: string, appointmentId: string) {
  try {
    const res = await fetch(APPOINTMENT + "appointment.submit_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("submitAppointment:", err);
    return null;
  }
}

export async function getAppointmentList(token: string, params?: {
  limitStart?: number;
  pageLength?: number;
  darshan_type?: string;
  workflow_state?: string;
}) {
  try {
    const res = await fetch(APPOINTMENT + "appointment.get_appointment_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(params || {}),
    });
    return await res.json();
   } catch (err: any) {
    console.error("getAppointmentList:", err);
    return null;
  }
}


// Booking Slot APIs
export async function getBookingSlotInfo(token: string, slotDate: string) {
  try {
    const res = await fetch(BOOKING + "get_slot_occupancy_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ slot_date: slotDate }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getBookingSlotInfo:", err);
    return null;
  }
}

export async function getVipDarshanSlots(slotDate: string) {
  try {
    const res = await fetch(BOOKING + "get_vip_darshan_slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ slot_date: slotDate }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getVipDarshanSlots:", err);
    return null;
  }
}

// VIP Protocol APIs
export async function getProtocolInfo(protocolName: string) {
  try {
    const res = await fetch(BOOKING + "protocol_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ protocol_name: protocolName }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getProtocolInfo:", err);
    return null;
  }
}

export async function getProtocolList(protocolName: string) {
  try {
    const res = await fetch(BOOKING + "protocol_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ protocol_name: protocolName }),
    });
    return await res.json();
   } catch (err: any) {
    console.error("getProtocolList:", err);
    return null;
  }
}



// Authentication APIs
export async function logout(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/method/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("logout:", err);
    return null;
  }
}

export async function getAuthToken(phone: number) {
  try {
    const url = DEVOTEE + "get_auth_token";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "phone": phone + ""
      }),
    });

    const data = await res.json();

    return data;
   } catch (err: any) {
    console.error("getAuthToken:", err);
    return null;
  }
}

// Utility functions
export function deleteAllCookies() {
  // Implementation for deleting cookies
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

// Custom registration function
export async function registrationDevotee(phone: number) {
  try {
    const res = await fetch(DEVOTEE + "create_devoteee_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("registrationDevotee:", err);
    return null;
  }
}
