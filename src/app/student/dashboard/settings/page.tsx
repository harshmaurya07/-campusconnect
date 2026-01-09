'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useDatabase, useUser, useStorage } from '@/firebase';
import { ref as dbRef, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

export default function StudentSettingsPage() {
  const { user } = useUser();
  const database = useDatabase();
  const storage = useStorage();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (user) {
      const userProfileRef = dbRef(database, `users/student/${user.uid}`);
      get(userProfileRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfile(data);
          setFullName(data.fullName);
          setCollegeId(data.collegeId);
          setEmail(data.email);
          setBio(data.bio || '');
        }
      });
    }
  }, [user, database]);
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const userProfileRef = dbRef(database, `users/student/${user.uid}`);
    let photoURL = profile.photoURL;

    if (profileImage) {
        setIsUploading(true);
        const imageRef = storageRef(storage, `profile_photos/${user.uid}/${profileImage.name}`);
        try {
            await uploadBytes(imageRef, profileImage);
            photoURL = await getDownloadURL(imageRef);
            toast({ title: 'Photo uploaded successfully!' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Photo Upload Failed', description: error.message });
            setIsUploading(false);
            return;
        }
    }
    
    const updatedData = {
      ...profile,
      fullName,
      collegeId,
      bio,
      photoURL,
    };

    try {
        await update(userProfileRef, updatedData);
        toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully.' });
        setProfile(updatedData);
        setProfileImage(null);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
        setIsUploading(false);
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
            <div className='relative cursor-pointer' onClick={handleAvatarClick}>
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.photoURL} alt={fullName} />
                  <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                </Avatar>
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity'>
                    <Upload className='h-6 w-6 text-white' />
                </div>
            </div>
             <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
             <div>
                <p className='font-medium'>
                    {profileImage ? profileImage.name : 'Upload Profile Photo'}
                </p>
                <p className='text-sm text-muted-foreground'>
                   Click the avatar to upload a new image.
                </p>
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
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us a little about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile} disabled={isUploading}>
            {isUploading ? 'Saving...' : 'Save Changes'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
