import { supabase } from "./supabase.js";

export async function saveSurveyResponse(form) {
  const survey = {
    gender: form.gender,
    preferred_flavor: form.preferredFlavor,
    preferred_size: form.preferredSize,
    purchase_priority: form.purchasePriority,
    delivery_preference: form.deliveryPreference,
    purchase_frequency: form.purchaseFrequency,
  };

  const { error } = await supabase
    .from("customer_preference_surveys")
    .insert(survey);

  if (error) {
    throw error;
  }

  const { error: sheetError } = await supabase.functions.invoke(
    "send-survey-to-sheet",
    {
      body: {
        survey: {
          ...survey,
          created_at: new Date().toISOString(),
        },
      },
    }
  );

  if (sheetError) {
    console.error(
      "La encuesta se guardó en Supabase, pero no pudo copiarse a Google Sheets:",
      sheetError
    );
  }
}