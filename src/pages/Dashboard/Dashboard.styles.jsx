import styled from 'styled-components';

export const Container = styled.div`
  /* Removido o background-color branco para herdar o fundo padrão do app */
  width: 100%;
  padding: 1rem 0; /* Ajuste o padding se necessário para alinhar com as outras telas */
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1e293b;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }
`;

export const PeriodSelector = styled.div`
  display: inline-flex;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 0.75rem;

  button {
    background: transparent;
    border: none;
    padding: 0.375rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    &:hover:not(.active) {
      color: #0f172a;
    }
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const MetricIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  &.emerald { background: #ecfdf5; color: #059669; }
  &.blue { background: #eff6ff; color: #2563eb; }
  &.purple { background: #f3e8ff; color: #7c3aed; }
  &.amber { background: #fffbeb; color: #d97706; }
`;

export const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;

  &.success { background: #ecfdf5; color: #059669; }
  &.danger { background: #fee2e2; color: #e11d48; }
  &.warning { background: #fef3c7; color: #d97706; }
`;