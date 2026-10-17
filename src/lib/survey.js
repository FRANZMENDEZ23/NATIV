import { supabase } from "./supabase.js";

export async function saveSurveyResponse(form) {
  const { data, error } = await supabase
    .from("customer_preference_surveys")
    .insert({
      gender: form.gender,
      preferred_flavor: form.preferredFlavor,
      preferred_size: form.preferredSize,
      purchase_priority: form.purchasePriority,
      delivery_preference: form.deliveryPreference,
      purchase_frequency: form.purchaseFrequency,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  const { error: sheetError } = await supabase.functions.invoke(
    "send-survey-to-sheet",
    {
      body: {
        survey: data,
      },
    }
  );

  if (sheetError) {
    console.error(
      "La encuesta se guardó en Supabase, pero no pudo copiarse a Google Sheets:",
      sheetError
    );
  }

  return data;
}