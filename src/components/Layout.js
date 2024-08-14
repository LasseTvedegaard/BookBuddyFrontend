import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ThemeToggle from './Theme/ThemeToggle';
import MenuDrawer from './Navbar/MenuDrawer';
import CollapseButton from './Navbar/CollapseButton';
import Background from './Background';

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Background>
      <div className="flex h-screen">
        <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <CollapseButton open={drawerOpen} setOpen={setDrawerOpen} className="absolute top-5 left-5 z-30" />
        <div className={`flex-grow transition-all duration-300 ${drawerOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="m-5">
            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Layout;
