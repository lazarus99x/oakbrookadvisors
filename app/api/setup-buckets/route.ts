import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing environment variables on server" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const expectedBuckets = [
      { id: "kyc", public: false },
      { id: "deposit-proofs", public: true },
      { id: "funding-images", public: true },
    ];

    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results: string[] = [];

    for (const eb of expectedBuckets) {
      const exists = buckets.some((b) => b.name === eb.id);
      if (!exists) {
        const { error: createError } = await supabase.storage.createBucket(
          eb.id,
          {
            public: eb.public,
            fileSizeLimit: 10485760, // 10MB
          }
        );
        if (createError) {
          results.push(`Failed to create ${eb.id}: ${createError.message}`);
        } else {
          results.push(`Created bucket ${eb.id}`);
        }
      } else {
        results.push(`Bucket ${eb.id} already exists`);
        const currentBucket = buckets.find((b) => b.name === eb.id);
        if (currentBucket && currentBucket.public !== eb.public) {
          const { error: updateError } = await supabase.storage.updateBucket(
            eb.id,
            {
              public: eb.public,
            }
          );
          if (updateError) {
            results.push(`Failed to update ${eb.id}: ${updateError.message}`);
          } else {
            results.push(`Updated bucket ${eb.id} to public: ${eb.public}`);
          }
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
