import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';
import LoginForm from './components/Auth/LoginForm.jsx';
import AdminLoginForm from './components/Auth/AdminLoginForm.jsx';
import SignUpForm from './components/Auth/SignUpForm.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import AddCostume from './components/Admin/AddCostume.jsx';
import CostumeCatalog from './components/User/CostumeCatalog.jsx';
import MyRentals from './components/User/MyRentals.jsx';
import UserProfile from './components/User/UserProfile.jsx';
import RentalModal from './components/RentalModal.jsx';
import { mockCostumes, mockRentals } from './data/mockData.js';
import { addCostume } from './utils/addCostume';
import { deleteCostume } from "./utils/deleteCostume";
import { updateCostumeQuantity } from "./utils/updateCostumeQuantity";


function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('');
  const [authView, setAuthView] = useState('login'); // 'login', 'admin', 'signup'
  const [costumes, setCostumes] = useState(mockCostumes);
  const [rentals, setRentals] = useState(mockRentals);
  const [selectedCostume, setSelectedCostume] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('catalog');
      }
    }
  }, [user]);

  /*const handleAddCostume = (newCostume) => {
    const costume = {
      ...newCostume,
      id: Date.now().toString()
    };
    setCostumes([...costumes, costume]);
    addCostume(costume);
  };*/

  const handleAddCostume = async (newCostume) => {
  const localId = Date.now().toString();
  const costume = {
    ...newCostume,
    id: localId,
  };

  try {
    const firestoreId = await addCostume(costume);
    setCostumes([...costumes, { ...costume, firestoreId }]); // ✅ track Firestore ID
  } catch (err) {
    alert("Failed to add costume.");
  }
};


  /*const handleDeleteCostume = (costumeId) => {
    setCostumes(costumes.filter(c => c.id !== costumeId));
  };*/


const handleDeleteCostume = async (costumeId) => {
  const costumeToDelete = costumes.find(c => c.id === costumeId);
  if (!costumeToDelete?.firestoreId) return alert("Missing Firestore ID");

  await deleteCostume(costumeToDelete.firestoreId); // ✅ correct Firestore doc ID
  setCostumes(costumes.filter(c => c.id !== costumeId));
};



  const handleRentCostume = (costume) => {
    setSelectedCostume(costume);
  };

 /* const handleConfirmRental = (startDate, endDate, totalCost, paymentMethod) => {
    if (!user || !selectedCostume) return;

    const newRental = {
      id: Date.now().toString(),
      userId: user.id,
      costumeId: selectedCostume.id,
      startDate,
      endDate,
      status: 'active',
      totalCost,
      paymentMethod
    };

    setRentals([...rentals, newRental]);
    
    // Decrease available quantity
    setCostumes(costumes.map(c => 
      c.id === selectedCostume.id 
        ? { 
            ...c, 
            quantity: c.quantity - 1,
            available: c.quantity - 1 > 0
          } 
        : c
    ));
    
    setSelectedCostume(null);

    // Simulate payment processing for online payments
    if (paymentMethod === 'online') {
      alert('Payment processed successfully! Your costume rental is confirmed.');
    } else {
      alert('Rental confirmed! You can pay cash on delivery.');
    }
  };
*/


const handleConfirmRental = async (startDate, endDate, totalCost, paymentMethod) => {
  if (!user || !selectedCostume) return;

  const newRental = {
    id: Date.now().toString(),
    userId: user.id,
    costumeId: selectedCostume.id,
    startDate,
    endDate,
    status: 'active',
    totalCost,
    paymentMethod
  };

  setRentals([...rentals, newRental]);

  const newQty = selectedCostume.quantity - 1;

  setCostumes(costumes.map(c =>
    c.id === selectedCostume.id
      ? { ...c, quantity: newQty, available: newQty > 0 }
      : c
  ));

  // 🔥 Update Firebase
  if (selectedCostume.firestoreId) {
    await updateCostumeQuantity(selectedCostume.firestoreId, newQty);
  }

  setSelectedCostume(null);

  if (paymentMethod === 'online') {
    alert('Payment processed successfully! Your costume rental is confirmed.');
  } else {
    alert('Rental confirmed! You can pay cash on delivery.');
  }
};

/*
  const handleReturnCostume = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    setRentals(rentals.map(r => 
      r.id === rentalId ? { ...r, status: 'returned' } : r
    ));
    
    // Increase available quantity
    setCostumes(costumes.map(c => 
      c.id === rental.costumeId 
        ? { 
            ...c, 
            quantity: c.quantity + 1,
            available: true
          } 
        : c
    ));
  };
*/

const handleReturnCostume = async (rentalId) => {
  const rental = rentals.find(r => r.id === rentalId);
  if (!rental) return;

  setRentals(rentals.map(r =>
    r.id === rentalId ? { ...r, status: 'returned' } : r
  ));

  const costume = costumes.find(c => c.id === rental.costumeId);
  const newQty = costume.quantity + 1;

  setCostumes(costumes.map(c =>
    c.id === rental.costumeId
      ? { ...c, quantity: newQty, available: true }
      : c
  ));

  if (costume?.firestoreId) {
    await updateCostumeQuantity(costume.firestoreId, newQty);
  }
};

  /*const handleCancelRental = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    setRentals(rentals.map(r => 
      r.id === rentalId ? { ...r, status: 'cancelled' } : r
    ));
    
    // Increase available quantity
    setCostumes(costumes.map(c => 
      c.id === rental.costumeId 
        ? { 
            ...c, 
            quantity: c.quantity + 1,
            available: true
          } 
        : c
    ));
  };
*/

const handleCancelRental = async (rentalId) => {
  const rental = rentals.find(r => r.id === rentalId);
  if (!rental) return;

  setRentals(rentals.map(r =>
    r.id === rentalId ? { ...r, status: 'cancelled' } : r
  ));

  const costume = costumes.find(c => c.id === rental.costumeId);
  const newQty = costume.quantity + 1;

  setCostumes(costumes.map(c =>
    c.id === rental.costumeId
      ? { ...c, quantity: newQty, available: true }
      : c
  ));

  // 🔥 Update Firestore quantity
  if (costume?.firestoreId) {
    await updateCostumeQuantity(costume.firestoreId, newQty);
  }
};


  const userRentals = user ? rentals.filter(r => r.userId === user.id) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PEHENNAWA...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    switch (authView) {
      case 'admin':
        return (
          <AdminLoginForm 
            onSwitchToUser={() => setAuthView('login')} 
          />
        );
      case 'signup':
        return (
          <SignUpForm 
            onSwitchToLogin={() => setAuthView('login')} 
          />
        );
      case 'login':
      default:
        return (
          <LoginForm 
            onSwitchToSignup={() => setAuthView('signup')}
            onSwitchToAdmin={() => setAuthView('admin')}
          />
        );
    }
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
            userRentals={userRentals}
            allRentals={rentals}
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
      case 'profile':
        return <UserProfile />;
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
            userRentals={userRentals}
            allRentals={rentals}
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
          existingRentals={rentals}
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