'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, UserPlus, Eye, Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDatabase, useUser } from "@/firebase";
import { ref, get, set, remove, onValue } from "firebase/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  fullName: string;
  email: string;
  collegeId: string;
  photoURL?: string;
  bio?: string;
}

interface PendingRequest extends Student {
  status: string;
}


export default function TeacherStudentsPage() {
  const [classCode, setClassCode] = useState<string>('');
  const [initialClassCode, setInitialClassCode] = useState<string>('');
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  
  const { toast } = useToast();
  const { user } = useUser();
  const database = useDatabase();

  useEffect(() => {
    if (user) {
      // Fetch class code
      const classCodeRef = ref(database, `teachers/${user.uid}/classCode`);
      const unsubscribeCode = onValue(classCodeRef, (snapshot) => {
        const code = snapshot.val();
        if(code) {
          setClassCode(code);
          setInitialClassCode(code);
          setIsEditingCode(false);
        } else {
            setIsEditingCode(true); // If no code, start in editing mode
        }
      });
      
      // Fetch pending requests
      const requestsRef = ref(database, `classRequests/${user.uid}`);
      const unsubscribeRequests = onValue(requestsRef, (snapshot) => {
        const requestsData = snapshot.val();
        const loadedRequests = requestsData ? Object.values(requestsData) : [];
        setPendingRequests(loadedRequests as PendingRequest[]);
      });

      // Fetch enrolled students
      const studentsRef = ref(database, `classes/${user.uid}/students`);
       const unsubscribeStudents = onValue(studentsRef, async (snapshot) => {
         const studentIds = snapshot.val();
         if(studentIds) {
           const studentPromises = Object.keys(studentIds).map(studentId => 
             get(ref(database, `users/student/${studentId}`))
           );
           const studentSnapshots = await Promise.all(studentPromises);
           const loadedStudents = studentSnapshots.map(snap => snap.val()).filter(Boolean);
           setEnrolledStudents(loadedStudents);
         } else {
            setEnrolledStudents([]);
         }
      });

      return () => {
        unsubscribeCode();
        unsubscribeRequests();
        unsubscribeStudents();
      }
    }
  }, [user, database]);


  const handleSaveCode = async () => {
    if (!user || !classCode) {
        toast({ variant: 'destructive', title: 'Class code cannot be empty.' });
        return;
    }
    if (classCode === initialClassCode) {
        setIsEditingCode(false);
        return;
    }

    const newCodeRef = ref(database, `classCodes/${classCode}`);
    const snapshot = await get(newCodeRef);

    if (snapshot.exists()) {
        toast({ variant: 'destructive', title: 'Code not available', description: 'This class code is already in use. Please choose another one.' });
        return;
    }

    // If there was an old code, remove it from the lookup table
    if (initialClassCode) {
        await remove(ref(database, `classCodes/${initialClassCode}`));
    }
    
    // Save to multiple locations for lookup
    await set(ref(database, `classCodes/${classCode}`), { teacherId: user.uid });
    await set(ref(database, `teachers/${user.uid}/classCode`), classCode);

    toast({ title: "Class Code Saved!", description: "Your new class code has been saved." });
    setIsEditingCode(false);
  };
  
  const copyCode = () => {
    if (classCode) {
      navigator.clipboard.writeText(classCode);
      toast({
        title: "Copied to clipboard!",
        description: "The class code has been copied.",
      });
    }
  }
  
    const getInitials = (name: string) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

  const handleApprove = async (request: PendingRequest) => {
    if (!user) return;
    
    const studentData = {
      id: request.id,
      email: request.email,
      fullName: request.fullName,
      collegeId: request.collegeId,
      role: 'student',
      photoURL: request.photoURL || '',
      bio: request.bio || '',
    };

    // Add to main student user pool
    await set(ref(database, `users/student/${request.id}`), studentData);
    // Add student to the teacher's class
    await set(ref(database, `classes/${user.uid}/students/${request.id}`), true);
    // Add class to the student's profile
    await set(ref(database, `users/student/${request.id}/classes/${user.uid}`), true);
    // Remove from pending requests
    await remove(ref(database, `classRequests/${user.uid}/${request.id}`));

    toast({ title: "Student Approved", description: `${request.fullName} has been added to your class.` });
  };

  const handleDeny = async (request: PendingRequest) => {
    if(!user) return;
    await remove(ref(database, `classRequests/${user.uid}/${request.id}`));
    // Note: This doesn't delete the auth user. A more robust solution might involve a Cloud Function.
    toast({ variant: "destructive", title: "Student Denied", description: `${request.fullName}'s request has been denied.` });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Student Management</h1>
        <p className="text-muted-foreground">Manage your student roster and approve new members.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Class Code</CardTitle>
          <CardDescription>Share this code with your students to allow them to register for your class.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {isEditingCode ? (
             <Input 
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Enter a unique class code"
                className="flex-1 font-mono text-lg"
             />
          ) : (
             <div className="flex-1 rounded-md border bg-muted px-4 py-2 font-mono text-lg h-11 flex items-center">
                {classCode}
             </div>
          )}

          {isEditingCode ? (
            <Button onClick={handleSaveCode}>
                <Save className="mr-2 h-4 w-4" /> Save Code
            </Button>
          ) : (
            <>
                <Button variant="outline" size="icon" onClick={copyCode} disabled={!classCode}>
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setIsEditingCode(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Code
                </Button>
            </>
          )}

        </CardContent>
      </Card>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">
            <Users className="mr-2 h-4 w-4" /> Enrolled Students
          </TabsTrigger>
          <TabsTrigger value="pending">
            <UserPlus className="mr-2 h-4 w-4" /> Pending Requests {pendingRequests.length > 0 && <Badge className="ml-2">{pendingRequests.length}</Badge>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enrolled">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>College ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledStudents.length > 0 ? (
                    enrolledStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={student.photoURL} alt={student.fullName} />
                              <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                          </Avatar>
                          {student.fullName}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                         <TableCell>{student.collegeId}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="font-headline text-2xl flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={student.photoURL} alt={student.fullName} />
                                    <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                                  </Avatar>
                                  {student.fullName}
                                </DialogTitle>
                                <DialogDescription>{student.email} | {student.collegeId}</DialogDescription>
                              </DialogHeader>
                              <div>
                                <h4 className="font-semibold mb-2">Bio</h4>
                                <p className="text-sm text-muted-foreground">{student.bio || 'No bio provided.'}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          No students enrolled yet.
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>College ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.fullName}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.collegeId}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(request)}>Approve</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeny(request)}>Deny</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
