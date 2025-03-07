"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Settings2, Copy, Trash2, RefreshCw, Key } from "lucide-react";
import { ConfirmationDialog } from "./dialogs/confirm-dialog";
import { resetVault } from "@/app/actions";
import toast from "react-hot-toast";
import { retrieveKey, setEncryptionKey } from "@/utils/encryption";
import { useUser } from "@clerk/nextjs";

export function Settings() {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [isSetKeyDialogOpen, setIsSetKeyDialogOpen] = useState(false);
  const [isSetKeyLoading, setIsSetKeyLoading] = useState(false);

  const { user } = useUser();

  const handleSetKey = async () => {
    setIsSetKeyLoading(true);

    if (!keyInput.trim()) {
      toast.error("Please enter a valid key.");
      setIsSetKeyLoading(false);
      return;
    }

    try {
      await setEncryptionKey(keyInput, user!.id);
      toast.success("Encryption key set successfully!");
      setKeyInput("");
    } catch (error) {
      toast.error("Failed to set encryption key. Please try again.");
      console.error(error);
    }

    setIsSetKeyDialogOpen(false);
    setIsSetKeyLoading(false);
  };

  const handleReset = () => {
    setIsResetLoading(true);
    resetVault();
    setIsResetDialogOpen(false);
    setIsResetLoading(false);

    toast.success("Vault reset successfully!");
  };

  const handleClear = () => {
    setIsClearLoading(true);

    localStorage.clear();
    sessionStorage.clear();

    const indexedDBDatabases = indexedDB.databases
      ? indexedDB.databases()
      : Promise.resolve([]);
    indexedDBDatabases.then((databases) => {
      databases.forEach((db) => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      });
    });

    setIsClearDialogOpen(false);
    setIsClearLoading(false);

    toast.success("Cache cleared successfully!");
  };

  const handleCopyKey = async () => {
    const cryptoKey = await retrieveKey(user!.id);

    const exportedKey = await window.crypto.subtle.exportKey("raw", cryptoKey);
    const keyAsString = btoa(
      String.fromCharCode(...new Uint8Array(exportedKey))
    );

    await navigator.clipboard.writeText(keyAsString);

    toast.success("Key copied to clipboard!");
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Settings</CardTitle>
          <CardDescription>
            Manage your preferences and security options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">Lock on Idle</h3>
                    <p className="text-sm text-muted-foreground">
                      Lock the vault when your device is idle
                    </p>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">Clear Cache</h3>
                    <p className="text-sm text-muted-foreground">
                      Clear all locally stored data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsClearDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">Reset Vault</h3>
                    <p className="text-sm text-muted-foreground">
                      Delete all vault entries
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsResetDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">Copy Encryption Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy your encryption key to clipboard
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyKey}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>

                <div className="pt-2">
                  <h3 className="font-medium mb-2">Set Encryption Key</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter a custom encryption key for your vault
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="Enter your key"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => setIsSetKeyDialogOpen(true)}
                      size="sm"
                    >
                      Set Key
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this password entry? This action cannot be undone."
        onConfirm={handleReset}
        loading={isResetLoading}
      />
      <ConfirmationDialog
        open={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        title="Confirm Clear"
        message="Are you sure you want to clear the cache? You WILL lose your encryption key, rendering your vault inaccessible."
        onConfirm={handleClear}
        loading={isClearLoading}
      />
      <ConfirmationDialog
        open={isSetKeyDialogOpen}
        onClose={() => setIsSetKeyDialogOpen(false)}
        title="Confirm Key Change"
        message="Are you sure you want to change your encryption key? This will affect how your data is encrypted and cannot be undone."
        onConfirm={handleSetKey}
        loading={isSetKeyLoading}
      />
    </div>
  );
}
