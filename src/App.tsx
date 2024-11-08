import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Todo from "./Todo";
import { IBanking } from "./IBanking";
import TransactionList from './TransactionList';
import Header from './Header';
import "./App.css";

function App() {
  return (
    <Router>
      <main id="page">
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/ibanking" element={<IBanking />} />
          <Route path="/transactions" element={<TransactionList />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
