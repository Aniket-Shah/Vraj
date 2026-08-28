import { industries } from "@/data/industries";

export function IndustriesServed() {
  return (
    <section id="industries" className="section">
      <div className="container">
        <p className="eyebrow">Industries we serve</p>
        <h2 className="mt-3">Powering diverse industries</h2>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map(({ name, icon: Icon }) => (
            <li key={name} className="card flex flex-col items-center gap-3 p-5 text-center">
              <span
                className="grid h-11 w-11 place-items-center rounded-[var(--radius)] bg-surface-mid text-primary"
                aria-hidden="true"
              >
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
