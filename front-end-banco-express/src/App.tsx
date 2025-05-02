import { useState } from 'react'
import logoBuap from './assets/LogoBuap.webp'
import dollarIcon from './assets/dollar-circle-list-svgrepo-com.svg'
import accountService from './services/AccountServices';

function App() {

  // API Simulation


  // State variables
  const [accountId, setAccountId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId.trim()) {
      setMessage('Por favor ingresa un ID de cuenta válido');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Real API call instead of simulation
      const exists = await accountService.verifyAccount(accountId);
      
      if (exists) {
        setMessage(`Cuenta ${accountId} encontrada. Iniciando sesión...`);
        // Navigate to login or dashboard
      } else {
        setMessage('Cuenta no encontrada. Verifica el ID ingresado.');
      }
    } catch (error) {
      setMessage('Error al procesar la solicitud. Intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='background-image'>
        <img src={logoBuap} alt="Banco" />
      </div>
      <div className='logo-container'>
        <h1>Bankpress</h1>
        <img src={dollarIcon} alt="Banco" />
      </div>

      <div className='text-container'>
        
        <h2>Bienvenido a la app de Banco Express</h2>
        <p>Esta es una aplicación de ejemplo para el banco.</p>
        <p>Por favor ingresa tu ID de cuenta para continuar.</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="id_cuenta">ID de cuenta:</label>
          <input 
            type="text" 
            id="id_cuenta" 
            name="id_cuenta"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Enviar'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  )
}

export default App