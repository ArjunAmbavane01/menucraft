import { User } from 'better-auth'
import Logo from '../Logo'
import UserMenu from './UserMenu';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className='fixed top-0 inset-x-0 flex h-16 w-full p-3 bg-sidebar/80 backdrop-blur-md border z-50'>
      <div className='flex justify-between items-center w-full max-w-7xl mx-auto'>
        <div className='flex items-center gap-5'>
          <Logo />
          <h3 className='text-lg'>MenuCraft</h3>
        </div>
        <UserMenu user={user} />
      </div>
    </nav>
  )
}
