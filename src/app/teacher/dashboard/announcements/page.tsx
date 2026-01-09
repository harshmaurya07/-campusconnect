import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Pin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const pastAnnouncements = [
  { title: "Mid-term exam schedule", content: "The mid-term exam is scheduled for next Friday. Best of luck!", date: "July 15, 2024", pinned: true },
  { title: "Class cancelled on Monday", content: "Please be advised that the class for this coming Monday has been cancelled.", date: "July 12, 2024", pinned: false },
  { title: "New reading material uploaded", content: "Chapter 5 reading material has been uploaded to the portal.", date: "July 10, 2024", pinned: false },
]

export default function TeacherAnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Announcements</h1>
        <p className="text-muted-foreground">Broadcast messages and updates to your students.</p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">New Announcement</CardTitle>
            <CardDescription>Compose a new message for your students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input id="announcement-title" placeholder="e.g. Exam Schedule Update" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement-content">Message</Label>
              <Textarea id="announcement-content" placeholder="Type your message here..." rows={5} />
            </div>
             <div className="flex items-center space-x-2">
              <Checkbox id="pin-announcement" />
              <Label htmlFor="pin-announcement">Pin this announcement</Label>
            </div>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send Announcement
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle className="font-headline">Past Announcements</CardTitle>
            <CardDescription>A history of all messages you've sent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastAnnouncements.map((item, index) => (
                <div key={index} className="flex flex-col gap-1 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                            {item.pinned && <Pin className="h-4 w-4 text-primary" />}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
