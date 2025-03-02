import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import PaymentService from '../utils/paymentService';
import MobileBottomNavigation from '../components/common/MobileBottomNavigation';

const EarningsDetailsScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { userData, currentUser } = useUser();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      try {
        const result = await PaymentService.getPaymentHistory(currentUser.uid);
        if (result.success) {
          setPaymentHistory(result.payments || []);
        } else {
          setError(result.message || 'Failed to load payment history');
        }
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentHistory();
  }, [currentUser]);
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('dashboard')}>
          <span className="mr-1">←</span> {t('dashboard')}
        </button>
        <div className="text-xs uppercase tracking-wider text-gray-500">{t('earnings')}</div>
        <div className="w-6"></div>
      </div>
      
      <div className="px-6 py-6">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t('totalEarnings')}</p>
          <div className="text-3xl font-normal text-gray-900 mb-1">${userData.totalEarnings.toFixed(2)}</div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>${(userData.totalEarnings - userData.pendingEarnings).toFixed(2)} paid</span>
              <span>${userData.pendingEarnings.toFixed(2)} pending</span>
            </div>
            {userData.pendingEarnings > 0 && (
              <button 
                className="text-sm text-white bg-black px-3 py-1.5"
                onClick={() => {
                  if (currentUser) {
                    PaymentService.processPayout(
                      currentUser.uid, 
                      userData.pendingEarnings,
                      'usd',
                      userData.paymentMethod?.toLowerCase() || 'paypal'
                    )
                    .then(() => {
                      // In a real app, this would update the user's pending earnings
                      // For now, we just simulate a success message
                      alert('Payout initiated! Your funds will arrive in 2-3 business days.');
                    })
                    .catch(err => {
                      console.error('Payout error:', err);
                      alert('Failed to process payout. Please try again later.');
                    });
                  }
                }}
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-8 border-b border-gray-100 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider text-gray-500">Payment Method</h2>
            <button className="text-sm text-gray-800">{t('edit')}</button>
          </div>
          <div className="border border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-8 bg-gray-100 flex items-center justify-center mr-3">
                <span className="text-gray-800 text-sm">P</span>
              </div>
              <div>
                <p className="text-base text-gray-800">{userData.paymentMethod}</p>
                <p className="text-xs text-gray-500">{userData.paymentEmail}</p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border border-gray-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider text-gray-500">Payment History</h2>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="py-4 text-center border-l-2 border-red-600 pl-3 bg-gray-50">
              {error}
              <button 
                className="ml-2 underline text-gray-800"
                onClick={() => setError(null)}
              >
                Retry
              </button>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No payment history yet.
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {paymentHistory.map(payment => (
                <div key={payment.id} className="border-b border-gray-100 py-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-base text-gray-800 font-normal">{payment.description}</p>
                    <p className="text-base text-gray-800 font-normal">${payment.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <p className={`${payment.status === 'processing' ? 'text-gray-800' : 'text-gray-800'}`}>
                      {payment.status === 'processing' ? 'Processing' : 'Completed'}
                    </p>
                    <p>
                      {new Date(payment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <button className="text-sm text-gray-500 py-3 border-t border-gray-100 w-full">
              View all payment history
            </button>
          </div>
        </div>
      </div>
      
      {/* Add padding to the bottom to account for the fixed navigation */}
      <div className="pb-20"></div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNavigation activeTab="earnings-details" navigate={navigate} />
    </div>
  );
};

export default EarningsDetailsScreen;
