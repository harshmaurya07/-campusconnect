'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  Megaphone,
  LogOut,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useAuth, useDatabase, useUser } from "@/firebase";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/teacher/dashboard/students", icon: Users, label: "Students" },
  { href: "/teacher/dashboard/attendance", icon: CalendarCheck, label: "Attendance" },
  { href: "/teacher/dashboard/assignments", icon: BookOpen, label: "Assignments" },
  { href: "/teacher/dashboard/announcements", icon: Megaphone, label: "Announcements" },
];

function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const database = useDatabase();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, `users/teacher/${user.uid}`);
      get(userProfileRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      });
    }
  }, [user, database]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.uid}`} alt={userProfile?.fullName || ''} />
            <AvatarFallback>{userProfile ? getInitials(userProfile.fullName) : 'T'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile?.fullName || 'Teacher'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email || 'teacher@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/teacher/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton>
                    <item.icon />
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-sidebar-foreground/50 p-2">
            © 2024 CampusConnect
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             {/* Can add a global search here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
