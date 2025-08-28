import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Music, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const { user, signIn, signUp, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      // Check if user signed in via Spotify
      const isSpotifyUser = user.app_metadata?.provider === 'spotify';
      
      if (isSpotifyUser) {
        // Spotify users need to set a password first
        navigate('/set-password');
      } else {
        // Regular users go to their dashboard
        // Check user role to determine where to redirect
        if (userRole?.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    }
  }, [user, userRole, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInForm.email, signInForm.password);
      if (!error) {
        // After sign in, the useEffect will handle navigation based on user role
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName);
      if (!error) {
        setSignUpForm({ email: '', password: '', fullName: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotifyAuth = async () => {
    try {
      // For production deployment, we need to specify the exact redirect URL
      // Check if we have a specific Vercel domain environment variable
      const vercelDomain = import.meta.env.VITE_VERCEL_DOMAIN;
      const isVercel = !!import.meta.env.VITE_VERCEL;
      
      let redirectTo;
      if (process.env.NODE_ENV === 'production') {
        if (vercelDomain) {
          redirectTo = `https://${vercelDomain}/set-password`;
        } else if (isVercel) {
          // If we're on Vercel but don't have a specific domain, use the current origin
          redirectTo = `${window.location.origin}/set-password`;
        } else {
          // Fallback for other production environments
          redirectTo = `${window.location.origin}/set-password`;
        }
      } else {
        // Development environment
        redirectTo = `${window.location.origin}/set-password`;
      }
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: redirectTo,
          scopes: 'user-read-email user-read-private playlist-read-private playlist-read-collaborative user-library-read user-read-recently-played'
        }
      });
      
      if (error) {
        toast({
          title: "Spotify Auth Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Spotify auth error:', error);
      toast({
        title: "Spotify Auth Error",
        description: "Failed to initiate Spotify authentication. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Music className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Spotify User</h1>
          <p className="text-gray-400">Playtime Enhancer Dashboard</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="signin" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="space-y-4">
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <CardTitle className="text-white">Welcome back</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in to your account to access your dashboard
                  </CardDescription>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="user@example.com"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="border-gray-700 bg-gray-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={signInForm.password}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="border-gray-700 bg-gray-800 text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-black" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <CardTitle className="text-white">Create Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create a new account to access the platform
                  </CardDescription>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                      className="border-gray-700 bg-gray-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="user@example.com"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="border-gray-700 bg-gray-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="border-gray-700 bg-gray-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-white">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="border-gray-700 bg-gray-800 text-white"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-black" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
                onClick={handleSpotifyAuth}
              >
                <Music className="mr-2 h-4 w-4" />
                Continue with Spotify
              </Button>
            </CardContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>User access to dashboard features</p>
        </div>
      </div>
    </div>
  );
}