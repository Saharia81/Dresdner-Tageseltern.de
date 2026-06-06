import { redirect } from "next/navigation";

// Banner 3 ist aktuell keinem Steckbrief zugeordnet, sondern leitet direkt
// auf die Übersicht aller Tageseltern weiter.
export default function Banner3Page() {
  redirect("/kindertagespflege-finden");
}
