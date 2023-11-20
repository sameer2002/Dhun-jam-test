import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
const Dashboard = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [customAmount, setCustomAmount] = useState(99);
  const [regularAmounts, setRegularAmounts] = useState([79, 59, 39, 19]);
  const [showGraph, setShowGraph] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataFromApi();
  }, [id]);

  const fetchDataFromApi = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !id) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`https://stg.dhunjam.in/account/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setUserData(data.data);
        setChargeCustomers(data.data.charge_customers);
        setCustomAmount(data.data.amount.category_6);
        setRegularAmounts([
          data.data.amount.category_7,
          data.data.amount.category_8,
          data.data.amount.category_9,
          data.data.amount.category_10,
        ]);
        setShowGraph(data.data.charge_customers);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  const handleChargeOptionChange = (value) => {
    setChargeCustomers(value === 'yes');
    setShowGraph(value === 'yes');
  };

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
  };

  const handleRegularAmountChange = (index, value) => {
    const updatedAmounts = [...regularAmounts];
    updatedAmounts[index] = value;
    setRegularAmounts(updatedAmounts);
  };

  const handleSaveData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://stg.dhunjam.in/account/admin/${id}`, {
        amount: {
          category_6: customAmount,
          category_7: regularAmounts[0],
          category_8: regularAmounts[1],
          category_9: regularAmounts[2],
          category_10: regularAmounts[3],
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        fetchDataFromApi();
        console.log('Data saved successfully');
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  const chartData = {
    labels: ['Custom', 'Category 1', 'Category 2', 'Category 3', 'Category 4'],
    datasets: [
      {
        label: 'Custom Song Request Amount',
        data: [customAmount, 0, 0, 0, 0], // Assuming custom amount is at index 0
        backgroundColor: '#F0C3F1', // F0C3F1
        borderColor: 'rgba(255,255,255,1)', // FFFFFF
        borderWidth: 1,
      },
      {
        label: 'Regular Song Request Amounts',
        data: [0, regularAmounts[0], regularAmounts[1], regularAmounts[2], regularAmounts[3]],
        backgroundColor: '#F0C3F1',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };
  

  return (
    <div className="container2">
      <h1>{userData ? `Welcome, ${userData.name}!` : 'Loading...'}</h1>
      <form>
        <div className="data-det">
          <label>
            Do you want to charge your customers for requesting songs?
            <div className="radio-div">
              <div className="rad" >
                <input
                  type="radio"
                  id="yes"
                  checked={chargeCustomers}
                  onChange={() => handleChargeOptionChange('yes')}style={{
                    backgroundColor: chargeCustomers ? '#6741D9' : '#FFFFFF',
                    borderColor: '#C2C2C2', // Border color when unselected
                  }}
                />
                <label htmlFor="yes">Yes</label>
              </div>
              <div className="rad">
                <input
                  type="radio"
                  id="no"
                  checked={!chargeCustomers}
                  onChange={() => handleChargeOptionChange('no')}
                />
                <label htmlFor="no">No</label>
              </div>
            </div>
          </label>
        </div>
        <div className="data-det">
          <label htmlFor="custom">Custom song request amount-</label>
          <input
           id="custom"
           type="number"
           value={customAmount}
           onChange={(e) => handleCustomAmountChange(e.target.value)}
           disabled={!chargeCustomers}
           min={99}
           style={{
            borderColor: chargeCustomers ? '#FFFFFF' : '#C2C2C2',
            backgroundColor: chargeCustomers ? 'Black' : '#C2C2C2',
          }}
         />
        </div>
        <div className="data-det">
          <label>Regular song request amounts from high to low-</label>
          <div className="regular">
            {regularAmounts.map((amount, index) => (
              <input
                key={index}
                type="number"
                value={amount}
                onChange={(e) => handleRegularAmountChange(index, e.target.value)}
                disabled={!chargeCustomers}
                min={chargeCustomers ? 0 : 0}
                style={{
                  borderColor: chargeCustomers ? '#FFFFFF' : '#C2C2C2',
                  backgroundColor: chargeCustomers ? 'Black' : '#C2C2C2',
                }}
              />
            ))}
          </div>
        </div>
      </form>
      {showGraph && (
        <div className="graph" style={{ width: '600px',marginBottom:'20px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>)}
      <button onClick={handleSaveData} disabled={!chargeCustomers} style={{
      borderColor: chargeCustomers ? '#FFFFFF' : '#C2C2C2',
      backgroundColor: chargeCustomers ? '#6741D9' : '#C2C2C2',
    }}>
        Save
      </button>
    </div>
  );
};

export default Dashboard;
