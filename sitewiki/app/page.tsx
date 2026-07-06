// 🚨 점 세 개(.../)로 되어 있던 부분을 점 두 개(../)로 정상 수정했습니다!
import { supabase } from "../lib/supabase"; 
import { SiteExplorer } from "../components/site-explorer";
import { Hero } from "../components/hero";
export const revalidate = 0; 

async function getSites() {
  const { data, error } = await supabase.from("sites").select("*");
  if (error) {
    console.error("🔥 Supabase 데이터 가져오기 실패:", error.message);
  }
  return data || [];
}

export default async function Home() {
  const sites = await getSites();

  return (
    <main className="min-h-screen flex-1 bg-neutral-50 pb-24 text-neutral-900 transition-colors duration-200 dark:bg-neutral-900 dark:text-neutral-100">
      <Hero />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SiteExplorer initialSites={sites} />
      </div>
    </main>
  );
}