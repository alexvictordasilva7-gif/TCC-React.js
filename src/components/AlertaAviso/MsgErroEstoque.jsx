// Aviso de erro exibido embaixo dos campos (ex.: Selects que ainda não têm a prop "erro")
export default function MsgErro({ children, id }) {
  if (!children) return null;

  return (
    <small
      id={id}
      role="alert"
      className="d-block mt-1 fw-medium"
      style={{ color: "#e5534b", fontSize: "0.8rem" }}
    >
      {children}
    </small>
  );
}