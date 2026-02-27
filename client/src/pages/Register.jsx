import React from 'react';
import { useSelector } from 'react-redux';
import AuthForm from '../components/form/AuthForm';

export default function Register() {
  const mobileOpen = useSelector(state => state.theme.isMobileOpen);

  return (
    <div className={` bg-white flex justify-center items-center ${mobileOpen && 'hidden'} min-h-[70vh] pt-24 pb-20`}>
      <AuthForm 
        authMethod={'register'}
      />
    </div>
  )
}

