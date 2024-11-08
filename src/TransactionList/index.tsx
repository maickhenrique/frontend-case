import { useState, useEffect } from 'react';
import debitImg from "../assets/debit.svg";
import creditImg from "../assets/credit.svg";
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.svg'
import "./index.css";

interface ITransaction {
  id: string;
  description: string;
  label: string;
  entry: "DEBIT" | "CREDIT";
  amount: number;
  name: string;
  dateEvent: string;
  status: string;
}

interface IResult {
  items: ITransaction[];
  date: string;
  balance: number;
}

interface IResponseList {
  results: IResult[];
  itemsTotal: number;
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [filter, setFilter] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = "http://localhost:3000" || import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setTimeout(async () => {

      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("Token não encontrado");
        window.location.href = '/ibanking'; 
        return;  
      }
      
      try {
        const response = await fetch(`${BASE_URL}/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error('Falha ao buscar transações. Status:', response.status);
          if (response.status === 401) {
            setTimeout(() => {
              window.location.href = '/ibanking';
            }, 100);
          }
          return;
        }
  
        const data: IResponseList = await response.json();
        setItemsTotal(data.itemsTotal);
        setTransactions(data.results.flatMap((result: IResult) => result.items));
      } catch (error) {
        console.error("Erro ao buscar as transações:", error);
      } finally {
        setIsLoading(false); 
      }
    }, 3000);
    };
  
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(transaction => transaction.entry === filter));
    }
  }, [filter, transactions]);

  const groupByDate = (transactions: ITransaction[]) => {
    const groups: { [key: string]: { transactions: ITransaction[]; balance: number } } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.dateEvent).toLocaleDateString(); 
      if (!groups[date]) {
        groups[date] = { transactions: [], balance: 0 };
      }
      groups[date].transactions.push(transaction);
      groups[date].balance += transaction.amount; 
    });

    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return sortedDates.map(date => ({
      date,
      transactions: groups[date].transactions,
      balance: groups[date].balance, 
    }));
  };

  const exportToCSV = () => {
    const header = ["Nome", "Descrição", "Etiqueta", "Data", "Valor" ];
    const rows = filteredTransactions.map(transaction => [
      transaction.name,
      transaction.description,
      transaction.label,
      new Date(transaction.dateEvent).toLocaleDateString(),
      " R$" +(transaction.amount / 100).toFixed(2) ,
    ]);

    const csvContent = [
      header.join(';'),
      ...rows.map(row => row.join(';')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'extrato-cora.csv';
    link.click();
  };

  const groupedTransactions = groupByDate(filteredTransactions);

  if (isLoading) {
    return (
      <div className="loading-container">
        <img src={logoImage} alt="Cora" title="Cora" className="rotating-logo" />
      </div>
    );
  }

  return (
    <div className="header">
      <button className="logout" onClick={handleLogout}>Sair</button>
      <div className='container-btn' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-list ${filter === 'ALL' ? 'active' : 'inactive'}`}
            onClick={() => setFilter('ALL')}
          >
            Todas
          </button>
          <button
            className={`btn-list ${filter === 'DEBIT' ? 'active' : 'inactive'}`}
            onClick={() => setFilter('DEBIT')}
          >
            Débito
          </button>
          <button
            className={`btn-list ${filter === 'CREDIT' ? 'active' : 'inactive'}`}
            onClick={() => setFilter('CREDIT')}
          >
            Crédito
          </button>
        </div>
        <button className='btn-export' onClick={exportToCSV}>Exportar Extrato</button>
      </div>

      <p>Total de transações: {itemsTotal}</p>
      {groupedTransactions.length > 0 ? (
        groupedTransactions.map((group, index) => {
          const hasTransactionAbove = index > 0 && groupedTransactions[index - 1].transactions.length > 0;

          return (
            <div key={group.date} className="transaction-card-wrapper">
                <div className="date-container">
                  {hasTransactionAbove && <div className="date-vertical"></div>}
                  <h3 className="date">{group.date}</h3>
                  <div className={hasTransactionAbove ? "date-line" : "date-line"}></div>
              </div>
              <div className="balance-container">
                  <span className='balanceDay'>saldo do dia <strong>R$ {(group.balance / 100).toFixed(2)}</strong></span>
                </div>
              <div className="transaction-card">
                <table>
                  <tbody>
                    {group.transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className='svgEntry'>
                          {transaction.entry === "DEBIT" ? (
                            <img src={debitImg} alt="Debito" />
                          ) : (
                            <img src={creditImg} alt="Credito" />
                          )}
                        </td>
                        <td style={{ color: transaction.entry === "DEBIT" ? "#1A93DA" : "#6b7076" }}>
                          {transaction.name}
                        </td>
                        <td>{transaction.description}</td>
                        <td>{transaction.label}</td>
                        <td>
                          {new Date(transaction.dateEvent).toLocaleString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).replace(",", " -")}
                        </td>
                        <td className="td-amount" style={{ color: transaction.entry === "DEBIT" ? "#1A93DA" : "#6b7076" }}>R$ {(transaction.amount / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      ) : (
        <p>Não há transações para exibir.</p>
      )}
    </div>
  );
};

export default TransactionList;
