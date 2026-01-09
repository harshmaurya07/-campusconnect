import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, UserPlus } from "lucide-react";

const enrolledStudents = [
  { name: "Alice Johnson", email: "alice@example.com", attendance: "95%" },
  { name: "Bob Williams", email: "bob@example.com", attendance: "88%" },
  { name: "Charlie Brown", email: "charlie@example.com", attendance: "72%" },
  { name: "Diana Miller", email: "diana@example.com", attendance: "98%" },
];

const pendingRequests = [
  { name: "Eve Davis", email: "eve@example.com", collegeId: "S67890" },
  { name: "Frank White", email: "frank@example.com", collegeId: "S11223" },
];

export default function TeacherStudentsPage() {
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
            CS101-FA24
          </div>
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
          <Button>Generate New Code</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">
            <Users className="mr-2 h-4 w-4" /> Enrolled Students
          </TabsTrigger>
          <TabsTrigger value="pending">
            <UserPlus className="mr-2 h-4 w-4" /> Pending Requests <Badge className="ml-2">{pendingRequests.length}</Badge>
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
                  {enrolledStudents.map((student) => (
                    <TableRow key={student.email}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-right">
                         <Badge variant={parseInt(student.attendance) < 75 ? "destructive" : "secondary"}>{student.attendance}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {pendingRequests.map((request) => (
                    <TableRow key={request.email}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.collegeId}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">Approve</Button>
                        <Button variant="destructive" size="sm">Deny</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
