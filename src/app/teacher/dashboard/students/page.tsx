'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const enrolledStudents: any[] = [];
const pendingRequests: any[] = [];

export default function TeacherStudentsPage() {
  const [classCode, setClassCode] = useState<string | null>(null);
  const { toast } = useToast();

  const generateCode = () => {
    // In a real app, this would be a unique code from the backend
    const newCode = `CS${Math.floor(Math.random() * 900) + 100}-SP${new Date().getFullYear().toString().slice(-2)}`;
    setClassCode(newCode);
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
          <div className="flex-1 rounded-md border bg-muted px-4 py-2 font-mono text-lg">
            {classCode || "No code generated"}
          </div>
          <Button variant="outline" size="icon" onClick={copyCode} disabled={!classCode}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button onClick={generateCode} disabled={!!classCode}>Generate New Code</Button>
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
                    <TableHead className="text-right">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledStudents.length > 0 ? (
                    enrolledStudents.map((student) => (
                      <TableRow key={student.email}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={parseInt(student.attendance) < 75 ? "destructive" : "secondary"}>{student.attendance}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
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
                      <TableRow key={request.email}>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.collegeId}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">Approve</Button>
                          <Button variant="destructive" size="sm">Deny</Button>
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
