import { useEffect } from 'react';

import { BrowserRouter, Routes, Route } from "react-router";

import { AddUserForm, UserList } from './db';

function Test() {

  return (
    <>
      <UserList />
      <AddUserForm />
    </>
  )
}


export function App() {
  console.log("Rendering App.")
  useEffect(() => {
    console.log("Mounting App.");
  }, []);

  return (
        <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Test />} />
          </Routes>
        </BrowserRouter>
        </>
  )
}
