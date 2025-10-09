import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // ton fichier est déjà prêt
import { doc, getDoc } from "firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID manquant" }, { status: 400 });
  }

  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const data = snap.data();
    const role = data.role || null;

    return NextResponse.json({ role }, { status: 200 });
  } catch (err: any) {
    console.error("Erreur getUserRole:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}