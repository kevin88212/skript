import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../lib/supabase-server";

// POST /api/orders — Neue Bestellung anlegen
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const body = await request.json();
  const { items, delivery_address, total } = body;

  if (!items?.length || !delivery_address || !total) {
    return NextResponse.json({ error: "Ungültige Bestelldaten" }, { status: 400 });
  }

  // Bestellung erstellen
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total,
      delivery_address,
      rider_name: pickRider(),
      rider_lat: 52.52 + (Math.random() - 0.5) * 0.02,
      rider_lng: 13.405 + (Math.random() - 0.5) * 0.02,
      estimated_minutes: Math.floor(Math.random() * 8) + 8,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Bestellung konnte nicht gespeichert werden" }, { status: 500 });
  }

  // Items einfügen
  const itemRows = items.map((item: {
    id: string; name: string; emoji: string; qty: number; price: number
  }) => ({
    order_id: order.id,
    item_id: item.id,
    item_name: item.name,
    item_emoji: item.emoji,
    quantity: item.qty,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) {
    return NextResponse.json({ error: "Items konnten nicht gespeichert werden" }, { status: 500 });
  }

  return NextResponse.json({ order }, { status: 201 });
}

// GET /api/orders — Bestellungen des Nutzers abrufen
export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }

  return NextResponse.json({ orders });
}

const RIDERS = ["Max Keller", "Anna Müller", "Jonas Weber", "Sara Yilmaz", "Tim Fischer"];
function pickRider() {
  return RIDERS[Math.floor(Math.random() * RIDERS.length)];
}
