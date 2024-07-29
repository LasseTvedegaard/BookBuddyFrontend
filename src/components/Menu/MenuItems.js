import { AiFillPieChart } from 'react-icons/ai';
import { SiFuturelearn } from 'react-icons/si';

const MenuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: <AiFillPieChart /> },
  { title: 'Books', path: '/books', icon: <SiFuturelearn /> },
  { title: 'Currently Reading', path: '/currentlyReading', icon: <SiFuturelearn /> },
  { title: 'Books read', path: '/read', icon: <SiFuturelearn /> },
  { title: 'Books to read', path: '/willRead', icon: <SiFuturelearn /> },
];

export default MenuItems;
