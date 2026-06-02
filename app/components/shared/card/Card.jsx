export default function Card({
  children,
  className = "",
  padding = "md",
  shadow = true,
  hover = false,
  rounded = "lg",
  variant = "default", // NEW
}) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const roundeds = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  const variants = {
    default: "",

    elevated: `
      relative
      transition-all duration-300 ease-in-out
      hover:-translate-y-2
      hover:border-transparent
      hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_8px_25px_rgba(190,56,135,0.35)]
      before:absolute before:bottom-0 before:left-1/2 before:h-[6px] before:w-[70%]
      before:-translate-x-1/2 before:rounded-full before:bg-primary
      before:opacity-0 before:blur-md before:transition-all before:duration-300
      hover:before:opacity-100
    `,
  };

  return (
    <div
      className={[
        "bg-white border border-slate-200",
        roundeds[rounded] ?? rounded,
        paddings[padding] ?? padding,
        shadow && variant === "default" ? "shadow-lg" : "",
        hover && variant === "default"
          ? "transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          : "",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
