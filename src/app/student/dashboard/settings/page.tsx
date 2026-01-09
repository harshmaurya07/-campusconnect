'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useDatabase, useUser } from '@/firebase';
import { ref, get, set, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'firebase/auth';

export default function StudentSettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const database = useDatabase();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, `users/student/${user.uid}`);
      get(userProfileRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfile(data);
          setFullName(data.fullName);
          setCollegeId(data.collegeId);
          setEmail(data.email);
        }
      });
    }
  }, [user, database]);

  const handleUpdateProfile = () => {
    if (user) {
      const userProfileRef = ref(database, `users/student/${user.uid}`);
      const updatedData = {
        ...profile,
        fullName,
        collegeId,
      };
      update(userProfileRef, updatedData)
        .then(() => {
          toast({
            title: 'Profile Updated',
            description: 'Your profile has been updated successfully.',
          });
          setProfile(updatedData);
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message,
          });
        });
    }
  };
  
    const getInitials = (name: string) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Profile</CardTitle>
          <CardDescription>Update your personal information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className='text-sm text-muted-foreground'>
                <p>Your avatar is generated from your name.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="collegeId">College ID</Label>
            <Input id="collegeId" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
