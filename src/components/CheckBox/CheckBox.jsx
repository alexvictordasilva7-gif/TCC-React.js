export default function Checkbox({ id, texto, marcado, onChange }) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={marcado}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {texto}
      </label>
    </div>
  );
}