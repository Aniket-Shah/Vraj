const industries = ["Textile", "Cosmetics", "Pharma", "Food", "Paint", "Plastics", "Rubber", "Ink"];
const origins = ["India", "Imported", "Korea", "China", "Japan", "Local"];
const packaging = ["Drum", "Bag", "Carboy"];

function CheckboxGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <fieldset className="grid gap-3 border-0 p-0">
      <legend className="mb-2 font-bold">{title}</legend>
      {values.map((value) => (
        <label key={value} className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="accent-[var(--color-accent)]" /> {value}
        </label>
      ))}
    </fieldset>
  );
}

export function FilterSidebar() {
  return (
    <aside className="panel h-fit p-5">
      <details open className="grid gap-5">
        <summary className="cursor-pointer font-bold">Filters</summary>
        <div className="mt-5 grid gap-6">
          <CheckboxGroup title="Industry" values={industries} />
          <CheckboxGroup title="Origin" values={origins} />
          <CheckboxGroup title="Packaging" values={packaging} />
          <CheckboxGroup title="Availability" values={["In Stock", "On Order"]} />
        </div>
      </details>
    </aside>
  );
}
