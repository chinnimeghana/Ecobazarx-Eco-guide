import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowLeft, User as UserIcon } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function Profile() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>

        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{user.username}</CardTitle>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Status</span>
              <span className="font-medium capitalize">{user.status}</span>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}