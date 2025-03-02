import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SetStateAction } from "react";
import PasswordItem from "./password-item";

interface PasswordEntry {
  id: string;
  name: string;
  username: string;
  website: string;
  password: string;
  usernameIV: string;
  websiteIV: string;
  passwordIV: string;
  updatedAt: string;
  lastAccess: string;
  created: string;
}

const PaswordTab = ({
  activeTab,
  filteredAndSortedPasswords,
  selectedEntry,
  setSelectedEntry,
  setPasswordToDelete,
  setIsConfirmationDialogOpen,
  setPasswordItems,
  setIsEditDialogOpen,
}: {
  activeTab: string;
  selectedEntry: PasswordEntry | null;
  setSelectedEntry: React.Dispatch<React.SetStateAction<PasswordEntry | null>>;
  setPasswordToDelete: React.Dispatch<
    React.SetStateAction<PasswordEntry | null>
  >;
  setIsConfirmationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordItems: React.Dispatch<
    SetStateAction<
      | {
          id: string;
          type: $Enums.VaultItemType;
          username: string;
          createdAt: Date;
          updatedAt: Date;
          website: string;
          password: string;
          usernameIV: string;
          websiteIV: string;
          passwordIV: string;
          userId: string;
        }[]
      | undefined
    >
  >;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredAndSortedPasswords: PasswordEntry[];
}) => {
  const router = useRouter();

  return (
    <>
      {filteredAndSortedPasswords.map((password) => (
        <PasswordItem
          key={password.id}
          password={password}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          setPasswordToDelete={setPasswordToDelete}
          setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
          setPasswordItems={setPasswordItems}
        />
      ))}
    </>
  );
};

export default PaswordTab;
