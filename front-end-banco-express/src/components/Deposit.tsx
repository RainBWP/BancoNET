import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import accountService from '../services/AccountServices';
import Background from './Background';
import './Transfer.css'; // Reuse the transfer styling

function Deposit() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const location = useLocation()
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    // Determine if this is a deposit or withdrawal based on the URL path
    const isWithdrawal = location.pathname.includes('/withdraw');
    // const operationType = isWithdrawal ? 'withdraw' : 'deposit';
    const actionText = isWithdrawal ? 'Retirar' : 'Abonar';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount.trim()) {
      setError(`Por favor ingrese un monto para ${isWithdrawal ? 'retirar' : 'abonar'}`);
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
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      
      if (isWithdrawal) {
        await accountService.withdraw(accountId, amountValue);
      } else {
        await accountService.deposit(accountId, amountValue);
      }
      
      setSuccess(`${isWithdrawal ? 'Retiro' : 'Abono'} exitoso de $${amountValue.toFixed(2)} ${isWithdrawal ? 'de' : 'a'} su cuenta`);
      
      // Clear form
      setAmount('');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/dashboard/${accountId}`);
      }, 2000);
    } catch (err) {
      setError('Error al procesar el abono. Por favor intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="transfer-container">
        <Background />
        <h1>{isWithdrawal ? 'RETIRAR DE CUENTA' : 'ABONAR A CUENTA'}</h1>
        <h2>Dev Only</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Monto a Abonar:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
              placeholder={`Ingrese el monto a ${isWithdrawal ? 'retirar' : 'abonar'}`}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/dashboard/${accountId}`)}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Procesando...' : actionText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Deposit;