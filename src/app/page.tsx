import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { School, GraduationCap, CalendarCheck, BookOpen, Megaphone, ArrowRight } from 'lucide-react'
import { Logo } from "@/components/logo"

const features = [
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: "Real-time Attendance",
    description: "Track attendance records for every class, ensuring you stay on top of your academic requirements.",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Assignment Tracking",
    description: "Never miss a deadline. View, submit, and manage all your assignments in one convenient place.",
  },
  {
    icon: <Megaphone className="h-10 w-10 text-primary" />,
    title: "Instant Announcements",
    description: "Stay informed with real-time announcements from your teachers about classes, exams, and more.",
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="p-4 lg:px-6 h-14 flex items-center">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                  A Smarter Campus Experience Starts Here
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your Digital Bridge to a Seamless Academic Journey. Connect, learn, and excel with CampusConnect.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/register">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Features Built for Modern Education</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CampusConnect provides a seamless digital experience for both students and teachers, making campus life more organized and efficient.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CampusConnect. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
