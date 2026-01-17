import { User } from 'better-auth'
import Logo from '../Logo'
import UserMenu from './UserMenu';
import Link from 'next/link';

interface NavbarProps {
  user: User;
}

const navLinks = [
  {
    title: "Dashboard",
    url: "/dashboard"
  }
]

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className='fixed top-0 inset-x-0 flex h-16 w-full p-3 bg-sidebar/80 backdrop-blur-md border z-50'>
      <div className='flex justify-between items-center w-full max-w-7xl mx-auto'>
        <div className='flex items-center gap-10'>
          <div className='flex items-center gap-5'>
            <Logo />
            <h3 className='text-lg'>MenuCraft</h3>
          </div>
          <div>
            {navLinks.map(navLink => (
              <Link key={navLink.url} href={navLink.url}>
                {navLink.title}
              </Link>
            ))}
          </div>
        </div>

        <UserMenu user={user} />
      </div>
    </nav>
  )
}
