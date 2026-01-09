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
  CalendarCheck,
  BookOpen,
  Bell,
  LogOut,
  Settings,
  PlusCircle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useAuth, useDatabase, useUser } from "@/firebase";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/dashboard/attendance", icon: CalendarCheck, label: "Attendance" },
  { href: "/student/dashboard/assignments", icon: BookOpen, label: "Assignments" },
];

function ClassSwitcher() {
    return (
        <Select>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
                <div className="p-2 text-sm text-muted-foreground">No classes joined yet.</div>
                <DropdownMenuSeparator />
                <Button variant="ghost" className="w-full justify-start rounded-sm h-8 px-2 font-normal">
                    <PlusCircle className="mr-2"/> Join new class
                </Button>
            </SelectContent>
        </Select>
    )
}

function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const database = useDatabase();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, `users/student/${user.uid}`);
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
            <AvatarFallback>{userProfile ? getInitials(userProfile.fullName) : 'S'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile?.fullName || 'Student'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email || 'student@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/student/dashboard/settings">
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

export default function StudentLayout({ children }: { children: React.ReactNode }) {
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
          <div className="flex-1" />
           <div className="flex items-center gap-4">
            <ClassSwitcher />
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5"/>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
