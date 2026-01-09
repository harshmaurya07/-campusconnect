import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { School, GraduationCap, CalendarCheck, BookOpen, Megaphone } from 'lucide-react'
import { Logo } from "@/components/logo"

const features = [
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: "Real-time Attendance",
    description: "Track attendance records for every class, ensuring you stay on top of your academic requirements.",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Assignment Tracking",
    description: "Never miss a deadline. View, submit, and manage all your assignments in one convenient place.",
  },
  {
    icon: <Megaphone className="h-10 w-10 text-primary" />,
    title: "Instant Announcements",
    description: "Stay informed with real-time announcements from your teachers about classes, exams, and more.",
  },
];


export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2">
              <Logo />
              <p className="text-muted-foreground text-center">Your Digital Bridge to a Smarter Campus Experience.</p>
          </div>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">
                <GraduationCap className="mr-2 h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger value="teacher">
                <School className="mr-2 h-4 w-4" /> Teacher
              </TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Student Login</CardTitle>
                  <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input id="student-email" type="email" placeholder="student@example.edu" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input id="student-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-4">
                  <Button className="w-full" asChild>
                    <Link href="/student/dashboard">Login</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account? <Link href="/register" className="font-semibold text-primary hover:underline">Register here</Link>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="teacher">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Teacher Login</CardTitle>
                  <CardDescription>Enter your credentials to manage your classes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input id="teacher-email" type="email" placeholder="teacher@example.edu" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Input id="teacher-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-4">
                   <Button className="w-full" asChild>
                    <Link href="/teacher/dashboard">Login</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account? <Link href="/register" className="font-semibold text-primary hover:underline">Register here</Link>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Features Built for Modern Education</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CampusConnect provides a seamless digital experience for both students and teachers, making campus life more organized and efficient.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}