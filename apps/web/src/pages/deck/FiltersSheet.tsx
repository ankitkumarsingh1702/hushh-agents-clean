/* ── Filters Sheet ── Dark purple bottom sheet matching design guidelines ── */

import { availableCategories, sortOptions, ratingOptions, responseTimeOptions } from "./FiltersModel";
import type { useFiltersViewModel } from "./FiltersViewModel";

type FiltersVM = ReturnType<typeof useFiltersViewModel>;

export default function FiltersSheet({ vm }: { vm: FiltersVM }) {
  if (!vm.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={vm.onClose} />

      {/* sheet */}
      <div className="relative w-full max-w-md rounded-t-[28px] max-h-[85vh] overflow-y-auto pb-safe bg-[#0a0a0a] border-t border-white/[0.08]"
      >
        {/* handle bar */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-[4px] rounded-full bg-white/25" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pb-5">
          <h2 className="text-xl font-bold text-white tracking-tight font-serif">Filters & Sorting</h2>
          <button onClick={vm.onReset} className="text-[13px] text-[#ff7eb3] font-medium">
            Reset to recommended
          </button>
        </div>

        <div className="px-6 space-y-7 pb-8">

          {/* ════════════════════════════════════════
              LINE OF BUSINESS
              ════════════════════════════════════════ */}
          <section>
            <h3 className="text-[11px] font-semibold text-[#c8a87c] uppercase tracking-[0.15em] mb-3">
              Line of Business
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(cat => {
                const active = vm.draft.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => vm.onToggleCategory(cat)}
                    className={`text-[13px] px-4 py-2 rounded-full border-[1.5px] transition-all ${
                      active
                        ? "bg-white/10 border-white/40 text-white font-medium"
                        : "border-white/15 text-white/55 hover:border-white/25 hover:text-white/70"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ════════════════════════════════════════
              AVAILABILITY
              ════════════════════════════════════════ */}
          <section>
            <h3 className="text-[11px] font-semibold text-[#c8a87c] uppercase tracking-[0.15em] mb-3">
              Availability
            </h3>
            <div className="flex gap-5">
              <label className="flex items-center gap-2.5 cursor-pointer group" onClick={() => vm.onToggleRemote()}>
                <div className={`w-[22px] h-[22px] rounded-[5px] flex items-center justify-center border-[1.5px] transition-all ${
                  vm.draft.remote_ok
                    ? "bg-green-500 border-green-500"
                    : "bg-white/5 border-white/20 group-hover:border-white/30"
                }`}>
                  {vm.draft.remote_ok && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[14px] text-white/70">Remote / Virtual</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group" onClick={() => vm.onToggleInPerson()}>
                <div className={`w-[22px] h-[22px] rounded-[5px] flex items-center justify-center border-[1.5px] transition-all ${
                  vm.draft.in_person_ok
                    ? "bg-green-500 border-green-500"
                    : "bg-white/5 border-white/20 group-hover:border-white/30"
                }`}>
                  {vm.draft.in_person_ok && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[14px] text-white/70">In-person</span>
              </label>
            </div>
          </section>

          {/* ════════════════════════════════════════
              MINIMUM RATING
              ════════════════════════════════════════ */}
          <section>
            <h3 className="text-[11px] font-semibold text-[#c8a87c] uppercase tracking-[0.15em] mb-3">
              Minimum Rating
            </h3>
            <div className="flex gap-2 flex-wrap">
              {ratingOptions.map(r => {
                const active = vm.draft.min_rating === r;
                return (
                  <button
                    key={r}
                    onClick={() => vm.onSetRating(r)}
                    className={`text-[13px] px-4 py-2 rounded-full border-[1.5px] transition-all flex items-center gap-1.5 ${
                      active
                        ? r === 0
                          ? "bg-yellow-600/30 border-yellow-500/50 text-yellow-300 font-medium"
                          : "bg-white/10 border-white/35 text-white font-medium"
                        : "border-white/15 text-white/55 hover:border-white/25"
                    }`}
                  >
                    {r === 0 ? "Any" : (
                      <>
                        <span className="text-yellow-400">★</span> {r}+
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ════════════════════════════════════════
              RESPONSE TIME
              ════════════════════════════════════════ */}
          <section>
            <h3 className="text-[11px] font-semibold text-[#c8a87c] uppercase tracking-[0.15em] mb-3">
              Response Time
            </h3>
            <div className="flex gap-2 flex-wrap">
              {responseTimeOptions.map(opt => {
                const active = vm.draft.max_response_minutes === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => vm.onSetResponseTime(opt.value)}
                    className={`text-[13px] px-4 py-2 rounded-full border-[1.5px] transition-all ${
                      active
                        ? opt.value === null
                          ? "bg-[#c8a87c]/20 border-[#c8a87c]/50 text-[#c8a87c] font-medium"
                          : "bg-white/10 border-white/35 text-white font-medium"
                        : "border-white/15 text-white/55 hover:border-white/25"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ════════════════════════════════════════
              SORT BY
              ════════════════════════════════════════ */}
          <section>
            <h3 className="text-[11px] font-semibold text-[#c8a87c] uppercase tracking-[0.15em] mb-3">
              Sort By
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(s => {
                const active = vm.draft.sort_by === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => vm.onSetSort(s.value)}
                    className={`text-[13px] px-4 py-2 rounded-full border-[1.5px] transition-all ${
                      active
                        ? "bg-white/12 border-white/35 text-white font-medium"
                        : "border-white/15 text-white/55 hover:border-white/25"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ════════════════════════════════════════
              APPLY BUTTON — coral/pink gradient
              ════════════════════════════════════════ */}
          <button
            onClick={vm.onApply}
            disabled={vm.saving}
            className="w-full py-4 rounded-2xl text-white text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #ff6b8a 0%, #ff8a65 100%)",
            }}
          >
            {vm.saving ? "Applying…" : "Apply Filters"}
            {!vm.saving && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
