
import { auth, signOut, signIn } from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = async () => {

    const session = await auth();
    
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
        <nav className="flex justify-between items-center">
            <Link href={"/"}>
                <Image src={"/logo.png"} width={144} height={30} alt='Logo' />
            </Link>

            <div className="flex items-center gap-5 text-black">
                {session && session.user ? (
                    <>
                        <Link href={"/startup/create"}>
                            <span className="max-sm:hidden">Create</span>
                            <BadgePlus className='size-6 sm:hidden' />
                        </Link>

                        <form action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/"})
                        }}>
                            <button className='cursor-pointer' type='submit'>
                                <span className="max-sm:hidden">Logout</span>
                                <LogOut className='size-6 sm:hidden' />
                            </button>
                        </form>

                        <Link href={`/user/${session?.id}`}>
                            {/* <span className="">{session?.user?.name}</span> */}
                            <Avatar className='size-10'>
                                <AvatarImage
                                    src={session?.user?.image || ""}
                                    alt={session?.user?.image || ""}
                                 />
                                <AvatarFallback>
                                    AV
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </>
                ): (
                    <form action={async () => {
                        "use server";
                        await signIn("github")
                    }} className="">
                        <button className='cursor-pointer' type='submit'>
                            Login
                        </button>
                    </form>
                )}
            </div>
        </nav>
    </header>
  )
}

export default Navbar
