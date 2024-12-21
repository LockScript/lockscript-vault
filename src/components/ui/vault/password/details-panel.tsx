import {PasswordItem} from "@prisma/client";
import axios from "axios";
import {
  Check,
  Edit,
  ExternalLink,
  Eye,
  EyeClosed,
  Globe,
  PenSquare,
  Trash,
  User,
  Zap,
} from "lucide-react";
import {useEffect,useState} from "react";
import toast from "react-hot-toast";
import {Button} from "../../button";
import {revalidatePath} from "next/cache";
import {useRouter} from "next/navigation";

interface DetailsPanelProps {
  selectedVault: PasswordItem | null;
  onClose: () => void;
  encrypt: (data: string) => string;
  setData: React.Dispatch<
    React.SetStateAction<PasswordItem | null | undefined>
  >;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedVault,
  onClose,
  encrypt,
  setData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editedValues, setEditedValues] = useState({
    username: selectedVault?.username || "",
    password: selectedVault?.password || "",
    website: selectedVault?.website || "",
  });
  const router = useRouter();

  const handleCopy = (text: string, field: string) => {
    if (!text) {
      toast.error(`${field} is empty!`);
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast(`${field} copied!`);
      })
      .catch((error) => {
        toast.error("Failed to copy!");
        console.error("Clipboard copy failed: ", error);
      });
  };

  const handleEdit = (field: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/passwords/${selectedVault?.id}`
      );
      if (response.status === 200) {
        toast("Item Deleted");
      } else {
        toast("Failed to delete item");
      }
      
      router.refresh();
    } catch (error) {
      toast("Error deleting item");
      console.log(error)
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    const encryptedUsername = encrypt(editedValues.username);
    const encryptedPassword = encrypt(editedValues.password);
    const encryptedWebsite = encrypt(editedValues.website);

    try {
      const response = await axios.patch(
        `/api/passwords/${selectedVault?.id}`,
        {
          username: encryptedUsername,
          password: encryptedPassword,
          website: encryptedWebsite,
        }
      );

      if (response.status === 200) {
        toast("Changes saved");
      } else {
        toast("Failed to save changes");
      }

      router.refresh();
    } catch (error) {
      toast("Error saving changes");
    }
  };

  useEffect(() => {
    if (selectedVault) {
      setEditedValues({
        username: selectedVault.username,
        password: selectedVault.password,
        website: selectedVault.website,
      });
    }
  }, [selectedVault]);

  if (!selectedVault) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{selectedVault?.website}</h2>
        </div>
        <Button variant="outline" size="icon" onClick={() => handleDelete()}>
          <Trash />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div>
        <button
          className="w-full group text-left border rounded-tr-xl rounded-tl-xl"
          onClick={() => handleCopy(selectedVault?.username ?? "", "Username")}
        >
          <div className="flex items-center gap-3 px-6 py-4 rounded-lg hover:bg-muted/50">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">Username</div>
              <div className="font-medium truncate w-full leading-normal">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedValues?.username}
                    onChange={(e) => handleEdit("username", e.target.value)}
                    className="w-full h-[38px] leading-[38px] bg-transparent border-b-2 focus:outline-none"
                  />
                ) : (
                  <div className="font-medium truncate w-full h-[38px] leading-[38px]">
                    {selectedVault?.username}
                  </div>
                )}
              </div>
            </div>
          </div>
        </button>

        <button
          className="w-full group text-left border"
          onClick={() => handleCopy(selectedVault?.password ?? "", "Password")}
        >
          <div className="flex items-center gap-3 px-6 py-4 rounded-lg hover:bg-muted/50">
            <PenSquare className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">Password</div>
              <div className="font-medium w-full leading-normal">
                {isEditing ? (
                  <input
                    type="password"
                    value={editedValues?.password}
                    onChange={(e) => handleEdit("password", e.target.value)}
                    className="w-full h-[38px] leading-[38px] bg-transparent border-b-2 focus:outline-none"
                  />
                ) : showPassword ? (
                  <div className="font-medium truncate w-full h-[38px] leading-[38px]">
                    {selectedVault?.password}
                  </div>
                ) : (
                  <div className="font-medium truncate w-full h-[38px] leading-[38px]">
                    {"*".repeat(selectedVault?.password.length ?? 8)}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
              </div>
            </div>
          </div>
        </button>

        <button
          className="w-full group text-left border rounded-bl-xl rounded-br-xl"
          onClick={() => handleCopy(selectedVault?.website ?? "", "Website")}
        >
          <div className="flex items-center gap-3 px-6 py-4 rounded-lg hover:bg-muted/50">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">Website</div>
              <div className="font-medium text-primary w-full leading-normal min-w-96">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedValues?.website}
                    onChange={(e) => handleEdit("website", e.target.value)}
                    className="w-full h-[38px] leading-[38px] bg-transparent border-b-2 focus:outline-none"
                  />
                ) : (
                  <div className="font-medium truncate w-full h-[38px] leading-[38px]">
                    {selectedVault?.website}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedVault?.website) {
                    const url =
                      selectedVault.website.startsWith("http://") ||
                      selectedVault.website.startsWith("https://")
                        ? selectedVault.website
                        : `https://${selectedVault.website}`;
                    window.open(url, "_blank");
                  } else {
                    toast.error("No website URL available!");
                  }
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </button>

        {/* Last Modified */}
        <button className="w-full group text-left mt-10 border rounded-tr-xl rounded-tl-xl">
          <div className="flex items-center gap-3 px-6 py-4 rounded-lg hover:bg-muted/50">
            <PenSquare className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">Last modified</div>
              <div className="font-medium leading-normal">
                {selectedVault?.updatedAt
                  ? new Date(selectedVault.updatedAt).toLocaleString()
                  : "No date available"}
              </div>
            </div>
          </div>
        </button>

        {/* Created */}
        <button className="w-full group text-left border rounded-br-xl rounded-bl-xl">
          <div className="flex items-center gap-3 px-6 py-4 rounded-lg hover:bg-muted/50">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium leading-normal">
                {selectedVault?.createdAt
                  ? new Date(selectedVault.createdAt).toLocaleString()
                  : "No date available"}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
