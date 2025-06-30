import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddCostume from './components/Admin/AddCostume';
import CostumeCatalog from './components/User/CostumeCatalog';
import MyRentals from './components/User/MyRentals';
import RentalModal from './components/RentalModal';
import { mockCostumes, mockRentals } from './data/mockData';
import { Costume, Rental } from './types';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [costumes, setCostumes] = useState<Costume[]>(mockCostumes);
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('catalog');
      }
    }
  }, [user]);

  const handleAddCostume = (newCostume: Omit<Costume, 'id'>) => {
    const costume: Costume = {
      ...newCostume,
      id: Date.now().toString()
    };
    setCostumes([...costumes, costume]);
  };

  const handleDeleteCostume = (costumeId: string) => {
    setCostumes(costumes.filter(c => c.id !== costumeId));
  };

  const handleRentCostume = (costume: Costume) => {
    setSelectedCostume(costume);
  };

  const handleConfirmRental = (startDate: string, endDate: string, totalCost: number) => {
    if (!user || !selectedCostume) return;

    const newRental: Rental = {
      id: Date.now().toString(),
      userId: user.id,
      costumeId: selectedCostume.id,
      startDate,
      endDate,
      status: 'active',
      totalCost
    };

    setRentals([...rentals, newRental]);
    setCostumes(costumes.map(c => 
      c.id === selectedCostume.id ? { ...c, available: false } : c
    ));
    setSelectedCostume(null);
  };

  const handleReturnCostume = (rentalId: string) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    setRentals(rentals.map(r => 
      r.id === rentalId ? { ...r, status: 'returned' } : r
    ));
    setCostumes(costumes.map(c => 
      c.id === rental.costumeId ? { ...c, available: true } : c
    ));
  };

  const handleCancelRental = (rentalId: string) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    setRentals(rentals.map(r => 
      r.id === rentalId ? { ...r, status: 'cancelled' } : r
    ));
    setCostumes(costumes.map(c => 
      c.id === rental.costumeId ? { ...c, available: true } : c
    ));
  };

  const userRentals = user ? rentals.filter(r => r.userId === user.id) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginForm onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignUpForm onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin-dashboard':
        return (
          <AdminDashboard
            costumes={costumes}
            onDeleteCostume={handleDeleteCostume}
          />
        );
      case 'add-costume':
        return <AddCostume onAddCostume={handleAddCostume} />;
      case 'catalog':
        return (
          <CostumeCatalog
            costumes={costumes}
            onRentCostume={handleRentCostume}
          />
        );
      case 'my-rentals':
        return (
          <MyRentals
            rentals={userRentals}
            costumes={costumes}
            onReturnCostume={handleReturnCostume}
            onCancelRental={handleCancelRental}
          />
        );
      default:
        return user.role === 'admin' ? (
          <AdminDashboard
            costumes={costumes}
            onDeleteCostume={handleDeleteCostume}
          />
        ) : (
          <CostumeCatalog
            costumes={costumes}
            onRentCostume={handleRentCostume}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderCurrentView()}
      </main>
      
      {selectedCostume && (
        <RentalModal
          costume={selectedCostume}
          onClose={() => setSelectedCostume(null)}
          onConfirm={handleConfirmRental}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;