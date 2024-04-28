import { getSession } from "@auth0/nextjs-auth0";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";

export default async function Home() {
  const { user } = await getSession();

  if (user) return <Dashboard />;
  return <Landing />;
}
