export default function Section({ title, children, variant = "default" }) {
  const variants = {
    default: "bg-white",
    muted: "bg-gray-50",
  };

  return (
    <section className={`${variants[variant]} py-16`}>
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-4 text-3xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600">{children}</p>
      </div>
    </section>
  );
}