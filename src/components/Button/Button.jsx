export default function Button({
  texto,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...resto
}) {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...resto}
    >
      {texto}
    </button>
  );
}
