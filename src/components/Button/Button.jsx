export default function Button({ texto , onClick, className = "" }) {
  return (
    <button type="button" className={`btn ${className}`} onClick={onClick}>
      {texto}
    </button>
  );
}