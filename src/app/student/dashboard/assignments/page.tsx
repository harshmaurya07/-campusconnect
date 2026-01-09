'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input"

const pendingAssignments: any[] = [];
const submittedAssignments: any[] = [];

export default function StudentAssignmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Assignments</h1>
        <p className="text-muted-foreground">View your pending tasks, submit your work, and see your grades.</p>
      </div>

       <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            <Clock className="mr-2 h-4 w-4" /> Pending
          </TabsTrigger>
          <TabsTrigger value="submitted">
            <CheckCircle className="mr-2 h-4 w-4" /> Submitted
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAssignments.length > 0 ? (
                    pendingAssignments.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell><Badge variant="outline">{item.class}</Badge></TableCell>
                        <TableCell>{item.deadline}</TableCell>
                        <TableCell className="text-right">
                          {item.mode === "Online" ? (
                              <div className="flex items-center justify-end gap-2">
                                  <Input type="file" className="text-xs h-9 file:mr-2 file:text-xs"/>
                                  <Button size="sm">Submit</Button>
                              </div>
                          ) : (
                              <Badge variant="secondary">Offline Submission</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No pending assignments.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Submitted Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedAssignments.length > 0 ? (
                    submittedAssignments.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell><Badge variant="outline">{item.class}</Badge></TableCell>
                        <TableCell>{item.submittedOn}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="default" className="bg-green-500 text-white">{item.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        You have not submitted any assignments yet.
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
  )
}
