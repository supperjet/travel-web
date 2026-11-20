import { useQuery } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { listCompanions } from "../catalog/api";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";

export function CompanionListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const language = searchParams.get("language") ?? "";
  const serviceArea = searchParams.get("serviceArea") ?? "";
  const companions = useQuery({
    queryKey: ["companions", { language, serviceArea }],
    queryFn: () => listCompanions({ language: language || undefined, serviceArea: serviceArea || undefined }),
  });

  const handleFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    for (const key of ["language", "serviceArea"] as const) {
      const value = String(data.get(key) ?? "").trim();
      if (value) next.set(key, value);
    }
    setSearchParams(next);
  };

  return (
    <div className="catalog-page">
      <header className="catalog-hero companion-catalog-hero">
        <div><p className="eyebrow">PEOPLE WHO KNOW</p><h1>和真正了解这里的人，<br />一起走走。</h1></div>
        <form className="catalog-filter" onSubmit={handleFilter}>
          <label>语言<input name="language" defaultValue={language} placeholder="例如 Mandarin" /></label>
          <label>服务区域<input name="serviceArea" defaultValue={serviceArea} placeholder="例如 Shanghai" /></label>
          <button className="button button-accent" type="submit">寻找地陪</button>
        </form>
      </header>
      <section className="catalog-content">
        <div className="result-heading"><div><p className="eyebrow">LOCAL COMPANIONS</p><h2>认识你的地陪</h2></div><span>{companions.data?.pagination.total ?? 0} 位地陪</span></div>
        {companions.isLoading && <LoadingState>正在寻找当地地陪…</LoadingState>}
        {companions.isError && <ErrorState error={companions.error} retry={() => void companions.refetch()} />}
        {companions.data?.data.length === 0 && <EmptyState>没有找到符合条件的地陪</EmptyState>}
        <div className="companion-grid">
          {companions.data?.data.map((companion) => (
            <Link className="companion-tile" to={`/companions/${companion.id}`} key={companion.id}>
              <img src={companion.portraitUrl} alt={companion.displayName} />
              <div className="companion-overlay"><p className="card-label">LOCAL COMPANION</p><h3>{companion.displayName}</h3><div><span>景点 {companion.ratings.sights}</span><span>美食 {companion.ratings.food}</span><span>夜生活 {companion.ratings.nightlife}</span></div></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
