import { User } from 'better-auth'
import Logo from '../Logo'
import UserMenu from './UserMenu';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className='fixed top-3 inset-x-0 flex justify-between items-center h-16 w-full max-w-7xl mx-auto p-5 bg-sidebar/80 backdrop-blur-md border rounded-lg z-50'>
      <div className='flex items-center gap-5'>
          <Logo />
          <h3 className='text-lg'>MenuCraft</h3>
        </div>
      <UserMenu user={user} />
    </nav>
  )
}
