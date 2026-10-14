import { supabase } from "./supabase.js";

export async function saveSurveyResponse(form) {
  const { error } = await supabase
    .from("customer_preference_surveys")
    .insert({
      gender: form.gender,
      preferred_flavor: form.preferredFlavor,
      preferred_size: form.preferredSize,
      purchase_priority: form.purchasePriority,
      delivery_preference: form.deliveryPreference,
      purchase_frequency: form.purchaseFrequency,
    });

  if (error) {
    throw error;
  }
}