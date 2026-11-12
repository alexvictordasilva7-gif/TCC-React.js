import { Modal, Button } from "react-bootstrap";

export default function ModalConfirmacao({
  aberto, titulo, texto, textoConfirmar, perigo, carregando, aoConfirmar, aoFechar,
}) {
  return (
    <Modal show={aberto} onHide={aoFechar} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{texto}</Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={aoFechar} disabled={carregando}>Voltar</Button>
        <Button variant={perigo ? "danger" : "success"} onClick={aoConfirmar} disabled={carregando}>
          {carregando ? "Salvando..." : textoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}