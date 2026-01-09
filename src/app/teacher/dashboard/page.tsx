import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarCheck, BookOpen, Percent } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const stats = [
  { title: "Total Students", value: "125", icon: Users, change: "+5 this week" },
  { title: "Average Attendance", value: "88%", icon: Percent, change: "-2% vs last month" },
  { title: "Assignments to Grade", value: "3", icon: BookOpen, change: "1 new submission" },
  { title: "Classes Managed", value: "4", icon: CalendarCheck, change: "CS-101, MA-203,..." },
];

const recentActivities = [
    { student: "Alice Johnson", activity: "submitted 'Calculus Homework 3'", time: "2 hours ago" },
    { student: "Bob Williams", activity: "requested to join 'CS-101'", time: "5 hours ago" },
    { student: "Charlie Brown", activity: "attendance dropped to 72%", time: "1 day ago" },
]

export default function TeacherDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, Teacher!</h1>
        <p className="text-muted-foreground">Here's a summary of your activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>What's been happening in your classes.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {recentActivities.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${item.student}`} alt="Avatar" />
                    <AvatarFallback>{item.student.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.student} <span className="font-normal text-muted-foreground">{item.activity}</span></p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
           <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Your most common tasks, one click away.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button>Create Assignment</Button>
            <Button variant="secondary">Take Attendance</Button>
            <Button variant="secondary">Send Announcement</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
