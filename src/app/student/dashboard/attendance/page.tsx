'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const classAttendance: any[] = [];

export default function StudentAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">My Attendance</h1>
        <p className="text-muted-foreground">Here is a breakdown of your attendance for each class.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Attendance Summary</CardTitle>
          <CardDescription>Overall attendance is calculated based on all your enrolled classes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {classAttendance.length > 0 ? (
            classAttendance.map((item) => {
              const isLow = item.attendance < 75;
              return (
                <div key={item.code}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{item.class} <Badge variant="secondary">{item.code}</Badge></p>
                    <p className={`font-semibold ${isLow ? 'text-destructive' : ''}`}>{item.attendance}%</p>
                  </div>
                  <Progress value={item.attendance} className={isLow ? "[&>div]:bg-destructive" : ""} />
                </div>
              )
            })
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>Your attendance data is not available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
