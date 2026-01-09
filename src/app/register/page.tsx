'use client';
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { School, GraduationCap } from 'lucide-react'
import { Logo } from "@/components/logo"
import { useAuth, useDatabase } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function RegisterPage() {
  const [studentName, setStudentName] = useState('');
  const [studentCollegeId, setStudentCollegeId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentClassCode, setStudentClassCode] = useState('');

  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  const auth = useAuth();
  const database = useDatabase();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (role: 'student' | 'teacher') => {
    const email = role === 'student' ? studentEmail : teacherEmail;
    const password = role === 'student' ? studentPassword : teacherPassword;
    const name = role === 'student' ? studentName : teacherName;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userProfileRef = ref(database, `users/${role}/${user.uid}`);
      
      const userData: any = {
        id: user.uid,
        email: user.email,
        fullName: name,
        role: role,
      };

      if (role === 'student') {
        userData.collegeId = studentCollegeId;
        // Here you would typically also validate the classCode and enroll the student
      }
      
      await set(userProfileRef, userData);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      });

      router.push(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    }
  };


  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
            <Logo />
            <p className="text-muted-foreground text-center">Create an account to get started.</p>
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
                <CardTitle className="font-headline text-2xl">Student Registration</CardTitle>
                <CardDescription>Fill out the form to create your student account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input id="student-name" placeholder="John Doe" required value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-id">College ID</Label>
                  <Input id="student-id" placeholder="12345" required value={studentCollegeId} onChange={(e) => setStudentCollegeId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email-reg">Email</Label>
                  <Input id="student-email-reg" type="email" placeholder="student@example.edu" required value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password-reg">Password</Label>
                  <Input id="student-password-reg" type="password" required value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-class-code">Class Code</Label>
                  <Input id="student-class-code" placeholder="e.g. CS101-FA24" required value={studentClassCode} onChange={(e) => setStudentClassCode(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4">
                <Button className="w-full" onClick={() => handleRegister('student')}>Register</Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Login here</Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="teacher">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Teacher Registration</CardTitle>
                <CardDescription>Fill out the form to create your teacher account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Full Name</Label>
                  <Input id="teacher-name" placeholder="Dr. Jane Smith" required value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-email-reg">Email</Label>
                  <Input id="teacher-email-reg" type="email" placeholder="teacher@example.edu" required value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password-reg">Password</Label>
                  <Input id="teacher-password-reg" type="password" required value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4">
                 <Button className="w-full" onClick={() => handleRegister('teacher')}>Register</Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Login here</Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
