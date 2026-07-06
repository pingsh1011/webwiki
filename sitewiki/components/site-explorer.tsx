"use client";

import { useEffect, useState } from "react";

interface Site {
  id: string | number;
  name: string;
  category: string;
  description: string;
  url: string;
}

interface SiteExplorerProps {
  initialSites: Site[];
}

const koreanSearchMap: { [key: string]: string } = {
  "Netflix": "넷플릭스 넷플",
  "TVING": "티빙",
  "Disney+": "디즈니플러스 디즈니 디즈니+",
  "Watcha": "왓챠 왓차",
  "Wavve": "웨이브 웨이부",
  "Coupang Play": "쿠팡플레이 쿠플",
  "Apple TV+": "애플티비 애플 TV 애플티비플러스",
  "Laftel": "라프텔",
  "Series On": "시리즈온",
  "Amazon Prime Video": "아마존프라이브 아마존 프라임 비디오",
  "YouTube": "유튜브 유투브 너튜브",
  "CHZZK (치지직)": "치지직 치직",
  "AfreecaTV (SOOP)": "아프리카티비 아프리카 TV 아프리카 아프리카tv 숲 soop 소프",
  "TikTok": "틱톡",
  "Twitch": "트위치",
  "Vimeo": "비메오 비메이오",
  "KakaoTV": "카카오티비 카카오 TV",
  "Spotify": "스포티파이 스포티",
  "Melon": "멜론 메론",
  "Genie Music": "지니뮤직 지니",
  "Bugs": "벅스 벅스뮤직",
  "YouTube Music": "유튜브뮤직 유튜브 뮤직 유뮤",
  "VIBE": "바이브",
  "Apple Music": "애플뮤직 애플 뮤직",
  "Flo": "플로",
  "SoundCloud": "사운드클라우드 사클",
  "Instagram": "인스타그램 인스타",
  "X (Twitter)": "트위터 엑스 트위터",
  "Facebook": "페이스북 페북",
  "LinkedIn": "링크드인",
  "Threads": "스레드 쓰레드",
  "Reddit": "레딧",
  "Coupang": "쿠팡",
  "Naver Shopping": "네이버쇼핑 네이버 쇼핑 네쇼",
  "11st (11번가)": "11번가 십일번가 11st",
  "Musinsa": "무신사 무신사스토어",
  "Zigzag": "지그재그 지재",
  "Ably": "에이블리",
  "Kream": "크림 크림스토어",
  "Karrot (당근마켓)": "당근마켓 당근",
  "Bunjang (번개장터)": "번개장터 번장",
  "Kurly": "컬리 마켓컬리",
  "SSG": "쓱 쓱닷컴 신세계",
  "Steam": "스팀",
  "Epic Games": "에픽게임즈 에픽게임스 에픽",
  "Riot Games": "라이엇게임즈 라이엇 라이옷",
  "Nexon": "넥슨",
  "NCSoft": "엔씨소프트 엔씨 엔씨소프드",
  "Smilegate": "스마일게이트 스마게",
  "Blizzard": "블리자드 블리자드엔터테인먼트",
  "Nintendo": "닌텐도 닌텐도스위치",
  "PlayStation": "플레이스테이션 플스",
  "Baedal Minjok (배달의민족)": "배달의민족 배민",
  "Yogiyo (요기요)": "요기요",
  "Coupang Eats": "쿠팡이츠 쿠이",
  "CatchTable": "캐치테이블 캐치 테이블",
  "MangoPlate": "망고플레이트 망고 플레이트",
  "Toss (토스)": "토스",
  "KakaoBank": "카카오뱅크 카뱅",
  "BankSalad": "뱅크샐러드 뱅샐",
  "Naver Pay": "네이버페이 네페",
  "Kbank": "케이뱅크 케뱅",
  "Naver": "네이버",
  "Daum": "다음",
  "Google": "구글",
  "Namuwiki": "나무위키",
  "ChatGPT": "챗지피티 챗GPT 지피티",
  "Papago": "파파고",
  "Yanolja": "야놀자",
  "Yeogieottae": "여기어때",
  "Airbnb": "에어비앤비 에어비엔비",
  "Skyscanner": "스카이스캐너 스카이 스캐너",
  "MyRealTrip": "마이리얼트립 마이 리얼 트립",
  "Agoda": "아고다"
};

const THEME_STORAGE_KEY = "sitewiki-theme";
const BOOKMARKS_STORAGE_KEY = "sitewiki-bookmarks";

function normalizeSiteId(id: string | number): string {
  return String(id);
}

function parseBookmarkIds(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((id) => id != null && (typeof id === "string" || typeof id === "number"))
      .map((id) => normalizeSiteId(id));
  } catch {
    return [];
  }
}

function loadBookmarkIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    return parseBookmarkIds(localStorage.getItem(BOOKMARKS_STORAGE_KEY));
  } catch {
    return [];
  }
}

function saveBookmarkIds(ids: string[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage 접근 실패 시 무시
  }
}

function BookmarkButton({
  isBookmarked,
  onToggle,
  compact = false,
}: {
  isBookmarked: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={isBookmarked}
      className={`absolute z-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 ${
        compact ? "top-2 right-2 h-7 w-7 text-base" : "top-4 right-4 h-8 w-8 text-lg"
      } ${
        isBookmarked
          ? "text-amber-500 hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-300"
          : "text-neutral-300 hover:text-amber-400 dark:text-neutral-600 dark:hover:text-amber-400"
      }`}
    >
      {isBookmarked ? "⭐" : "☆"}
    </button>
  );
}

function SiteCard({
  site,
  isBookmarked,
  onToggleBookmark,
}: {
  site: Site;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  return (
    <div className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-neutral-300 dark:bg-neutral-800 dark:ring-neutral-700 dark:hover:ring-neutral-600">
      <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 pr-12"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
            {site.category}
          </span>
          <span className="text-sm text-neutral-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            방문하기 ↗
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-neutral-900 group-hover:text-black dark:text-neutral-100 dark:group-hover:text-white">
          {site.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {site.description}
        </p>
      </a>
    </div>
  );
}

function CompactBookmarkCard({
  site,
  onToggleBookmark,
}: {
  site: Site;
  onToggleBookmark: () => void;
}) {
  return (
    <div className="group relative min-w-0">
      <BookmarkButton compact isBookmarked onToggle={onToggleBookmark} />
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl bg-white py-2.5 pl-3.5 pr-10 shadow-sm ring-1 ring-neutral-200 transition-all duration-200 hover:bg-neutral-50 hover:ring-neutral-300 dark:bg-neutral-800 dark:ring-neutral-700 dark:hover:bg-neutral-700 dark:hover:ring-neutral-600"
      >
        <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {site.name}
        </span>
        <span className="shrink-0 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
          {site.category}
        </span>
      </a>
    </div>
  );
}

const externalSearchProviders = [
  {
    id: "google",
    label: "구글 검색",
    buildUrl: (query: string) =>
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
  {
    id: "naver",
    label: "네이버 검색",
    buildUrl: (query: string) =>
      `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`,
  },
  {
    id: "youtube",
    label: "유튜브 검색",
    buildUrl: (query: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  },
  {
    id: "namuwiki",
    label: "나무위키 검색",
    buildUrl: (query: string) =>
      `https://namu.wiki/w/${encodeURIComponent(query)}`,
  },
  {
    id: "chzzk",
    label: "치지직 검색",
    buildUrl: (query: string) =>
      `https://chzzk.naver.com/search?keyword=${encodeURIComponent(query)}`,
  },
] as const;

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

export function SiteExplorer({ initialSites }: SiteExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(prefersDark);
    applyDarkClass(prefersDark);
  }, []);

  useEffect(() => {
    setBookmarkIds(loadBookmarkIds());
    setIsMounted(true);
  }, []);

  useEffect(() => {
    applyDarkClass(isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleBookmark = (siteId: string | number) => {
    const normalizedId = normalizeSiteId(siteId);

    setBookmarkIds((prev) => {
      const next = prev.includes(normalizedId)
        ? prev.filter((id) => id !== normalizedId)
        : [...prev, normalizedId];

      saveBookmarkIds(next);
      return next;
    });
  };

  const isBookmarked = (siteId: string | number) => {
    if (!isMounted) return false;
    return bookmarkIds.includes(normalizeSiteId(siteId));
  };

  const bookmarkedSites = isMounted
    ? bookmarkIds
        .map((id) =>
          initialSites.find((site) => normalizeSiteId(site.id) === id)
        )
        .filter((site): site is Site => site !== undefined)
    : [];

  const categories = ["전체", ...Array.from(new Set(initialSites.map((site) => site.category)))];
  const trimmedSearchTerm = searchTerm.trim();
  const hasSearchQuery = trimmedSearchTerm.length > 0;

  const filteredSites = initialSites.filter((site) => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return selectedCategory === "전체" || site.category === selectedCategory;

    const matchesEnglishName = site.name.toLowerCase().includes(searchLower);
    const matchesDescription = site.description.toLowerCase().includes(searchLower);
    const koreanKeywords = koreanSearchMap[site.name] || "";
    const matchesKoreanKeywords = koreanKeywords.toLowerCase().includes(searchLower);

    const matchesSearch = matchesEnglishName || matchesDescription || matchesKoreanKeywords;
    const matchesCategory = selectedCategory === "전체" || site.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 rounded-3xl p-6 transition-colors duration-200">
      <div className="flex justify-end">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition-all hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-700"
        >
          {isDarkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
        </button>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="relative rounded-2xl shadow-sm">
          <input
            type="text"
            className="block w-full rounded-2xl border-0 bg-white py-4 pl-5 pr-12 text-neutral-900 ring-1 ring-inset ring-neutral-200 transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 sm:text-base sm:leading-6 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-400"
            placeholder="사이트 이름(한글/영어)이나 키워드를 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-neutral-400 sm:text-base">🔍</span>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <p className="text-center text-xs font-medium text-neutral-400 dark:text-neutral-500">
            외부 검색
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {externalSearchProviders.map((provider) => {
              const href = hasSearchQuery
                ? provider.buildUrl(trimmedSearchTerm)
                : undefined;

              return (
                <a
                  key={provider.id}
                  href={href}
                  target={hasSearchQuery ? "_blank" : undefined}
                  rel={hasSearchQuery ? "noopener noreferrer" : undefined}
                  aria-disabled={!hasSearchQuery}
                  tabIndex={hasSearchQuery ? 0 : -1}
                  onClick={(event) => {
                    if (!hasSearchQuery) event.preventDefault();
                  }}
                  className={`rounded-full px-3.5 py-2 text-xs font-medium ring-1 transition-all duration-200 sm:text-sm ${
                    hasSearchQuery
                      ? "cursor-pointer bg-white text-neutral-700 ring-neutral-200 shadow-sm hover:bg-neutral-100 hover:ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-700 dark:hover:ring-neutral-600"
                      : "pointer-events-none cursor-not-allowed bg-white/60 text-neutral-400 ring-neutral-200/60 opacity-50 dark:bg-neutral-800/60 dark:text-neutral-500 dark:ring-neutral-700/60"
                  }`}
                >
                  {provider.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {isMounted && bookmarkedSites.length > 0 && (
        <section className="rounded-2xl bg-amber-50/60 p-4 ring-1 ring-amber-200/70 dark:bg-amber-950/25 dark:ring-amber-900/50 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 sm:text-base">
              📌 내가 찜한 바로가기
            </h2>
            <span className="text-xs font-medium text-amber-700/80 dark:text-amber-400/80">
              {bookmarkedSites.length}개
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedSites.map((site) => (
              <CompactBookmarkCard
                key={site.id}
                site={site}
                onToggleBookmark={() => toggleBookmark(site.id)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-all duration-200 ${
              selectedCategory === category
                ? "bg-neutral-900 text-white ring-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:ring-neutral-100"
                : "bg-white text-neutral-600 ring-neutral-200 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700 dark:hover:bg-neutral-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          총{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {filteredSites.length}
          </span>
          개의 사이트가 있습니다.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              isBookmarked={isBookmarked(site.id)}
              onToggleBookmark={() => toggleBookmark(site.id)}
            />
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="rounded-2xl py-20 text-center ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
            <span className="mb-3 block text-4xl">🫙</span>
            <p className="text-neutral-500 dark:text-neutral-400">
              검색 결과와 일치하는 사이트가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
