import React,{ useEffect } from 'react'
import Header from './_components/Header'
import { useAuthStore } from '@/store/useAuthStore'

function DashboardLayout({children}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Header/>
      <div className='mx-5 md:mx-20 lg:mx-36'>
      {children}
      </div>
    </div>
  )
}

export default DashboardLayout
