import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function SetPassword() {
  const { user, signIn, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: true
  });

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Validate password as user types
  useEffect(() => {
    const password = formData.password;
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      match: formData.password === formData.confirmPassword
    });
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all validations pass
    const allValid = Object.values(passwordValidations).every(Boolean);
    if (!allValid) {
      toast({
        title: "Validation Error",
        description: "Please ensure your password meets all requirements",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update user with new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) throw updateError;

      // Sign in with new password
      if (user?.email) {
        const { error: signInError } = await signIn(user.email, formData.password);
        if (signInError) throw signInError;
      }

      toast({
        title: "Success",
        description: "Password set successfully! You can now sign in with your email and password."
      });

      // Redirect based on user role
      if (userRole?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error: any) {
      console.error("Set password error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-black" />
          </div>
          <CardTitle className="text-2xl text-white">Set Your Password</CardTitle>
          <CardDescription className="text-gray-400">
            Create a strong password to secure your account for future sign-ins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="border-gray-700 bg-gray-800 text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
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
              
              {/* Password requirements */}
              <div className="text-xs text-gray-400 mt-2">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center ${passwordValidations.length ? 'text-green-500' : 'text-gray-400'}`}>
                    {passwordValidations.length ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 inline-block" />}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${passwordValidations.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                    {passwordValidations.uppercase ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 inline-block" />}
                    At least one uppercase letter
                  </li>
                  <li className={`flex items-center ${passwordValidations.lowercase ? 'text-green-500' : 'text-gray-400'}`}>
                    {passwordValidations.lowercase ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 inline-block" />}
                    At least one lowercase letter
                  </li>
                  <li className={`flex items-center ${passwordValidations.number ? 'text-green-500' : 'text-gray-400'}`}>
                    {passwordValidations.number ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 inline-block" />}
                    At least one number
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="border-gray-700 bg-gray-800 text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {!passwordValidations.match && formData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-black" 
              disabled={isLoading || !Object.values(passwordValidations).every(Boolean)}
            >
              {isLoading ? "Setting Password..." : "Set Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}