import { useToast } from "@/components/ui/use-toast";
import { FilePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";
import { QueryClient, useMutation } from "react-query";

const PasswordCard = ({
  item,
  deleteItem,
  queryClient,
}: {
  item: PasswordItem;
  deleteItem: (id: string, type: string) => Promise<void>;
  queryClient: QueryClient;
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const deletePasswordMutation = useMutation(
    () => deleteItem(item.id, item.type),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vaultItems");
        toast({
          title: "Password Deleted.",
          description: `The password for ${item.website} has been deleted.`,
        });
      },
    }
  );

  return (
    <TableRow key={item.id}>
      <TableCell>{item.website}</TableCell>
      <TableCell>{item.username}</TableCell>
      <TableCell>{item.password}</TableCell>
      <TableCell>Notes...</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <FilePenIcon className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            deletePasswordMutation.mutate();
          }}
        >
          <TrashIcon className="w-4 h-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PasswordCard;
