import Link from "next/link";

export function BreadcrumbNav({ items }: { items: Array<{ label: string; href?: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="flex min-h-11 items-center hover:text-text sm:min-h-0">
                  {item.label}
                </Link>
              ) : (
                <span className="flex min-h-11 items-center sm:min-h-0">{item.label}</span>
              )}
              {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
