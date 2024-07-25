import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/books">All books</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
