import React from 'react';
import { useUser } from "../components/common/Login/UserContext"; // ✅ den rigtige fil
import UserAuthForm from "../components/common/Login/UserAuthForm"; // til visning af loginformular


function Dashboard() {
  const { currentUser } = useUser();

  return (
    <div className="p-6">
      {!currentUser ? (
        <UserAuthForm />
      ) : (
        <div className="text-white">
          <h1 className="text-3xl font-semibold mb-4">
            Velkommen, {currentUser.firstName || currentUser.userId}!
          </h1>
          <p className="text-lg">Du er nu logget ind i BookBuddy 🚀</p>
        </div>
      )}
    </div>
  );
}


export default Dashboard;
