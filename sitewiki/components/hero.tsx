export function Hero() {
  return (
    <section className="px-5 pb-8 pt-20 sm:px-8 sm:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="flex flex-col items-center gap-1 text-balance">
          <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl sm:leading-[1.15]">
            웹 위키
          </span>
          <span className="font-mono text-base font-medium tracking-[0.18em] text-neutral-400 uppercase dark:text-neutral-500 sm:text-lg">
            WebWiki
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:mt-6 sm:text-lg">
          한국의 다양한 웹사이트를 한 곳에서 검색하고 발견하세요.
        </p>
      </div>
    </section>
  );
}
