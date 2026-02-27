import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AuthForm from '../components/form/AuthForm';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const mobileOpen = useSelector(state => state.theme.isMobileOpen);
  return (
    <div className={` bg-white flex justify-center items-center ${mobileOpen && 'hidden'} min-h-[80vh] pt-28 pb-20`}>
      <AuthForm 
        authMethod={'login'}
      />
    </div>
  )
}


