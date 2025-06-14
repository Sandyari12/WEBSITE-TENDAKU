import { createContext, useContext, useState } from 'react';

const RentalContext = createContext();

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};

export const RentalProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Tenda Dome 4 Orang',
      category: 'Tenda',
      price: 150000,
      stock: 5,
      image: 'https://example.com/tenda.jpg',
      description: 'Tenda dome untuk 4 orang, waterproof, mudah dipasang',
      status: 'available'
    },
    {
      id: 2,
      name: 'Sleeping Bag',
      category: 'Peralatan Tidur',
      price: 50000,
      stock: 10,
      image: 'https://example.com/sleeping-bag.jpg',
      description: 'Sleeping bag nyaman untuk suhu 0-10°C',
      status: 'available'
    },
    {
      id: 3,
      name: 'Kompor Portable',
      category: 'Peralatan Masak',
      price: 75000,
      stock: 8,
      image: 'https://example.com/kompor.jpg',
      description: 'Kompor portable dengan bahan bakar gas',
      status: 'available'
    }
  ]);

  const [rentals, setRentals] = useState([]);

  const addEquipment = (newEquipment) => {
    setEquipment([...equipment, { ...newEquipment, id: Date.now() }]);
  };

  const updateEquipment = (id, updatedData) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
  };

  const deleteEquipment = (id) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const createRental = (rentalData) => {
    const newRental = {
      id: Date.now(),
      ...rentalData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setRentals([...rentals, newRental]);
    
    // Update equipment stock
    const rentedEquipment = equipment.find(item => item.id === rentalData.equipmentId);
    if (rentedEquipment) {
      updateEquipment(rentedEquipment.id, {
        stock: rentedEquipment.stock - rentalData.quantity
      });
    }
  };

  const completeRental = (rentalId) => {
    setRentals(rentals.map(rental => 
      rental.id === rentalId ? { ...rental, status: 'completed' } : rental
    ));
  };

  const value = {
    equipment,
    rentals,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    createRental,
    completeRental
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
}; 