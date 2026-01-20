import { createClient } from "@/utils/supabase/client";

export async function logApiUsage(clientId: string) {
    try {
        const supabase = createClient();
        const today = new Date().toISOString().split("T")[0];

        const { data: existingRecord, error: selectError } = await supabase
            .from("usage_stats_daily")
            .select("count")
            .eq("client_id", clientId)
            .eq("usage_date", today)
            .single();

        if (selectError && selectError.code !== "PGRST116") {
            console.error("Error checking existing usage stats:", selectError);
            return;
        }

        if (existingRecord) {
            const { error: updateError } = await supabase
                .from("usage_stats_daily")
                .update({ count: existingRecord.count + 1 })
                .eq("client_id", clientId)
                .eq("usage_date", today);

            if (updateError) {
                console.error("Error updating usage stats:", updateError);
            }
        } else {
            const { error: insertError } = await supabase.from("usage_stats_daily").insert({
                client_id: clientId,
                usage_date: today,
                count: 1,
            });

            if (insertError) {
                console.error("Error inserting usage stats:", insertError);
            }
        }
    } catch (error) {
        console.error("Error logging usage stats:", error);
    }
}
