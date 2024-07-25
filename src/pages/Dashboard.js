import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/books">Go to Books</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
