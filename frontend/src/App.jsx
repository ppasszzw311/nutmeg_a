import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Checkin from './pages/Checkin'
import CheckinList from './pages/CheckinList'
import Workshift from './pages/Workshift'
import Purchase from './pages/Purchase'
import PrintAndSale from './pages/PrintAndSale'
import Manager from './pages/Manager'
import ItemData from './pages/ItemData'
import SaleRank from './pages/SaleRank'
import MonthlyReport from './pages/MonthlyReport'
import ErrorFix from './pages/ErrorFix'
import NotFound from './pages/NotFound'
import ServerError from './pages/ServerError'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="checkin" element={<Checkin />} />
          <Route path="checkinList" element={<CheckinList />} />
          <Route path="workshift" element={<Workshift />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="printAndSale" element={<PrintAndSale />} />
          <Route path="manager" element={<Manager />} />
          <Route path="itemData" element={<ItemData />} />
          <Route path="saleRank" element={<SaleRank />} />
          <Route path="monthlyReport" element={<MonthlyReport />} />
          <Route path="errorFix" element={<ErrorFix />} />
          <Route path="record" element={<CheckinList />} />
          <Route path="server-error" element={<ServerError />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
