import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { School, GraduationCap } from 'lucide-react'
import { Logo } from "@/components/logo"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
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
    </div>
  );
}
