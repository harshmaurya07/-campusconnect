'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge";
import { Book, Pin, AlertTriangle } from "lucide-react";

const attendanceData = [
  { month: "Jan", attendance: 95 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 85 },
  { month: "Apr", attendance: 88 },
  { month: "May", attendance: 76 },
  { month: "Jun", attendance: 74 },
];

const upcomingAssignments = [
  { title: "Calculus Homework 3", class: "MA-203", deadline: "July 30, 2024" },
  { title: "Final Essay", class: "EN-101", deadline: "August 15, 2024" },
];

const announcements = [
    { title: "Attendance Warning", content: "Your attendance is at 74%, which is below the 75% requirement.", date: "July 20, 2024", type: "warning" },
    { title: "Mid-term exam schedule", content: "The mid-term exam is scheduled for next Friday. Best of luck!", date: "July 15, 2024", type: "pinned" },
    { title: "Class cancelled on Monday", content: "Please be advised that the class for this coming Monday has been cancelled.", date: "July 12, 2024", type: "normal" },
]


export default function StudentDashboardPage() {
  const overallAttendance = 74;
  const isAttendanceLow = overallAttendance < 75;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Student!</h1>
        <p className="text-muted-foreground">Here's what's happening in your classes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Attendance Trend</CardTitle>
            <CardDescription>Your attendance over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer>
              <AreaChart data={attendanceData}>
                <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis unit="%" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Area type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className={`flex flex-col justify-center items-center ${isAttendanceLow ? 'bg-destructive/10 border-destructive' : ''}`}>
          <CardHeader className="items-center">
            <CardTitle className="font-headline">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className={`text-6xl font-bold ${isAttendanceLow ? 'text-destructive' : ''}`}>
              {overallAttendance}%
            </div>
            {isAttendanceLow && (
              <p className="text-center text-sm text-destructive font-medium">Your attendance is below the 75% requirement. Please consult your advisor.</p>
            )}
            {!isAttendanceLow && (
                 <p className="text-sm text-muted-foreground">Great job! Keep it up.</p>
            )}
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Assignments</CardTitle>
            <CardDescription>Don't miss these deadlines!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-md p-2">
                    <Book className="h-5 w-5"/>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.class}</Badge>
                        <p className="text-sm text-muted-foreground">Due: {item.deadline}</p>
                    </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Announcements</CardTitle>
            <CardDescription>Updates from your teachers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {announcements.map((item, index) => (
                <div key={index} className={`flex items-start gap-4 rounded-lg border p-3 ${item.type === 'warning' ? 'border-destructive bg-destructive/5' : ''}`}>
                    <div className={`rounded-md p-2 ${item.type === 'warning' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {item.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
                        {item.type === 'pinned' && <Pin className="h-5 w-5" />}
                        {item.type === 'normal' && <Book className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.content}</p>
                    </div>
                </div>
             ))}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
