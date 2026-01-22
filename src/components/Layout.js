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
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* Main content area */}
        <div
          className={`
            flex-grow transition-all duration-300
            ${drawerOpen ? 'ml-64' : 'ml-0'}
          `}
        >
          {/* Top bar */}
          <div className="relative">
            <CollapseButton
              open={drawerOpen}
              setOpen={setDrawerOpen}
              className="absolute top-4 left-4 z-30"
            />

            <div className="flex justify-end px-4 py-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Page content wrapper */}
          <div
            className="
              w-full
              px-4
              sm:px-6
              md:px-8
              lg:px-10
              xl:px-12
              pb-8
            "
          >
            <Outlet />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Layout;
