import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUpdateUserRole } from "@/hooks/useUsers";
import { User, Shield, Calendar, ShoppingCart, FileText } from "lucide-react";

interface UserDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDialog = ({ user, open, onOpenChange }: UserDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user');
  const updateUserRole = useUpdateUserRole();

  const handleSave = async () => {
    if (!user || selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    try {
      await updateUserRole.mutateAsync({
        userId: user.id,
        role: selectedRole,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Details
          </DialogTitle>
          <DialogDescription>
            View and manage user information and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {user.full_name || 'No Name'}
                </h3>
                <p className="text-gray-600">{user.id}</p>
              </div>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' ? (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 mr-1" />
                    User
                  </>
                )}
              </Badge>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {user.orderCount || 0}
                </div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {user.rfqCount || 0}
                </div>
                <div className="text-xs text-gray-600">RFQs</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xs text-purple-600 font-semibold">
                  {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                </div>
                <div className="text-xs text-gray-600">Last Active</div>
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Regular User
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Administrator
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {selectedRole !== user.role && (
              <p className="text-sm text-amber-600">
                ⚠️ Role will be changed from {user.role} to {selectedRole}
              </p>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <Label>Account Information</Label>
            <div className="text-sm space-y-1 text-gray-600">
              <p><strong>Created:</strong> {formatDate(user.updated_at)}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateUserRole.isPending || selectedRole === user.role}
          >
            {updateUserRole.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
