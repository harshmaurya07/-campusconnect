'use client';
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Upload, Download, Trash2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser, useDatabase } from "@/firebase";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref as databaseRef, onValue, set, serverTimestamp, remove } from "firebase/database";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  class: string;
  deadline: string;
  mode: 'Online' | 'Offline';
  submittedOn?: string;
  grade?: string;
  fileURL?: string;
  storagePath?: string;
}

export default function StudentAssignmentsPage() {
  const { user } = useUser();
  const database = useDatabase();
  const storage = getStorage();
  const { toast } = useToast();
  
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [submittedAssignments, setSubmittedAssignments] = useState<Assignment[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Mock assignments from teacher for now. In a real app, this would come from the teacher's side.
      const mockAssignments: Assignment[] = [
        { id: 'assign1', title: 'Lab Report 1', class: 'CS101', deadline: '2024-10-26', mode: 'Online' },
        { id: 'assign2', title: 'History Essay', class: 'HIST201', deadline: '2024-11-15', mode: 'Online' },
        { id: 'assign3', title: 'Final Project Presentation', class: 'CS101', deadline: '2024-12-05', mode: 'Offline' },
      ];
      
      const assignmentsRef = databaseRef(database, `users/${user.uid}/assignments`);
      onValue(assignmentsRef, (snapshot) => {
        const allAssignments: Assignment[] = [...mockAssignments];
        const submittedData = snapshot.val() || {};

        const submitted = Object.values(submittedData) as Assignment[];

        const pending = allAssignments.filter(
          (assign) => !submitted.find((sub) => sub.id === assign.id)
        );
        
        setPendingAssignments(pending);
        setSubmittedAssignments(submitted);
      });
    }
  }, [user, database]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (assignment: Assignment) => {
    if (!file || !user) {
      toast({ variant: 'destructive', title: 'No file selected', description: 'Please select a file to submit.' });
      return;
    }

    setUploading(assignment.id);

    const filePath = `user_uploads/${user.uid}/${assignment.id}_${file.name}`;
    const fileStorageRef = storageRef(storage, filePath);

    try {
      const uploadResult = await uploadBytes(fileStorageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const submissionData: Assignment = {
        ...assignment,
        submittedOn: new Date().toLocaleDateString(),
        fileURL: downloadURL,
        storagePath: filePath,
        grade: 'Not Graded'
      };

      const submissionRef = databaseRef(database, `users/${user.uid}/assignments/${assignment.id}`);
      await set(submissionRef, submissionData);
      
      toast({ title: 'Assignment Submitted!', description: `${assignment.title} was submitted successfully.` });
      setFile(null);

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
        setUploading(null);
    }
  };

  const handleFileDownload = (fileURL: string, fileName: string) => {
    window.open(fileURL, '_blank');
  };

  const handleDeleteSubmission = async (assignment: Assignment) => {
    if (!user || !assignment.storagePath) return;

    const fileStorageRef = storageRef(storage, assignment.storagePath);
    const submissionRef = databaseRef(database, `users/${user.uid}/assignments/${assignment.id}`);

    try {
        await deleteObject(fileStorageRef);
        await remove(submissionRef);
        toast({ title: 'Submission Deleted', description: 'Your submission has been successfully removed.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
    }
  };

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
                    pendingAssignments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell><Badge variant="outline">{item.class}</Badge></TableCell>
                        <TableCell>{item.deadline}</TableCell>
                        <TableCell className="text-right">
                          {item.mode === "Online" ? (
                              <div className="flex items-center justify-end gap-2">
                                  <Input type="file" className="text-xs h-9 file:mr-2 file:text-xs" onChange={handleFileChange} disabled={!!uploading}/>
                                  <Button size="sm" onClick={() => handleFileUpload(item)} disabled={!file || uploading === item.id}>
                                    {uploading === item.id ? 'Submitting...' : 'Submit'}
                                  </Button>
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
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedAssignments.length > 0 ? (
                    submittedAssignments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.submittedOn}</TableCell>
                        <TableCell>
                          <Badge variant={item.grade === 'Not Graded' ? 'secondary' : 'default'} className={item.grade !== 'Not Graded' ? 'bg-green-500' : ''}>{item.grade}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            {item.fileURL && (
                                <>
                                    <Button variant="outline" size="icon" onClick={() => handleFileDownload(item.fileURL!, item.title)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteSubmission(item)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            {!item.fileURL && <Badge variant="outline">No File</Badge>}
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
