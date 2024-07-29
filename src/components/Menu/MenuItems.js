import { AiFillPieChart, AiOutlineRead, AiOutlineBook, AiOutlineClockCircle, AiOutlineCheckCircle } from 'react-icons/ai';

const MenuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: <AiFillPieChart /> },
  { title: 'Books', path: '/books', icon: <AiOutlineBook /> },
  { title: 'Currently Reading', path: '/currentlyReading', icon: <AiOutlineClockCircle /> },
  { title: 'Books read', path: '/read', icon: <AiOutlineCheckCircle /> },
  { title: 'Books to read', path: '/willRead', icon: <AiOutlineRead /> },
];

export default MenuItems;
