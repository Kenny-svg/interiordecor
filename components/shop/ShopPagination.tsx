import Link from "next/link";
import { cn } from "@/lib/utils";

export function ShopPagination({
  page,
  pageCount,
  category,
}: {
  page: number;
  pageCount: number;
  category?: string;
}) {
  if (pageCount <= 1) {
    return null;
  }

  function href(n: number) {
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    if (n > 1) {
      params.set("page", String(n));
    }
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  }

  const numbers = pageNumbers(page, pageCount);

  return (
    <nav className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8" aria-label="Pages">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="text-[12px] uppercase tracking-[0.18em] text-ink"
        >
          Previous
        </Link>
      ) : (
        <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Previous</span>
      )}
      <ol className="flex flex-wrap items-center gap-4">
        {numbers.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`e-${index}`} className="text-muted" aria-hidden>
              ·
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                className={cn(
                  "text-[12px] uppercase tracking-[0.18em]",
                  item === page ? "text-ink" : "text-muted hover:text-ink",
                )}
                aria-current={item === page ? "page" : undefined}
              >
                {String(item).padStart(2, "0")}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < pageCount ? (
        <Link
          href={href(page + 1)}
          className="text-[12px] uppercase tracking-[0.18em] text-ink"
        >
          Next
        </Link>
      ) : (
        <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Next</span>
      )}
    </nav>
  );
}

function pageNumbers(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const set = new Set([1, pageCount, page, page - 1, page + 1, page - 2, page + 2]);
  const sorted = [...set].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (const n of sorted) {
    const last = out[out.length - 1];
    if (typeof last === "number" && n - last > 1) {
      out.push("ellipsis");
    }
    out.push(n);
  }
  return out;
}
