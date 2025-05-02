import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import accountService from '../services/AccountServices';
import Background from './background';

function Transfer() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!toAccountId.trim() || !amount.trim()) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Por favor ingrese un monto válido');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Add this method to your AccountServices or create a TransactionService
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      await accountService.transferMoney(accountId, toAccountId, amountValue, description);
      setSuccess(`Transferencia exitosa de $${amountValue.toFixed(2)} a la cuenta ${toAccountId}`);
      
      // Clear form
      setToAccountId('');
      setAmount('');
      setDescription('');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/dashboard/${accountId}`);
      }, 2000);
    } catch (err) {
      setError('Error al procesar la transferencia. Por favor intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="transfer-container">
        <Background></Background>
      <h1>Transferencia Bancaria</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="toAccountId">Cuenta Destino:</label>
          <input
            type="text"
            id="toAccountId"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Monto:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/dashboard/${accountId}`)}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Transferir'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Transfer;