import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountClient from "../../components/account/AccountClient";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_access_token")?.value;

  if (!token) {
    redirect("/api/auth/login");
  }

  return <AccountClient />;
}
