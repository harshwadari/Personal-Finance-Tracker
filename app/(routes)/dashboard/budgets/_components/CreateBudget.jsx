"use client";

import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbconfig";

function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [scannedData, setScannedData] = useState("");
  const [scanning, setScanning] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Add mounted state

  const { user } = useUser();

  // Ensure component only renders client-side after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setEmojiIcon(emoji.emoji);
    setOpenEmojiPicker(false);
  };

  // Function to perform OCR on the uploaded receipt image
  const handleReceiptScan = async () => {
    if (!receiptFile) {
      toast.error("Please upload a receipt image first.");
      return;
    }
    setScanning(true);
    try {
      const { data } = await Tesseract.recognize(receiptFile, "eng", {
        logger: (m) => console.log(m),
      });
      setScannedData(data.text);
      
      const amountMatch = data.text.match(/(\d+(\.\d{1,2})?)/);
      if (amountMatch) {
        setAmount(amountMatch[0]);
        toast.success("Detected amount: " + amountMatch[0]);
      } else {
        toast.warning("Could not detect an amount from the receipt.");
      }
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Error scanning receipt.");
    }
    setScanning(false);
  };

  // Function to create the budget entry
  const onCreateBudget = async () => {
    if (!user) {
      toast.error("User not found!");
      return;
    }
    try {
      const result = await db
        .insert(Budgets)
        .values({
          name: name,
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
        })
        .returning({ insertId: Budgets.id });

      if (result) {
        if (refreshData) {
          refreshData();
        }
        toast.success("New Budget Created!");
        setName(""); // Reset form
        setAmount("");
        setEmojiIcon("");
        setReceiptFile(null);
        setScannedData("");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget.");
    }
  };

  // Return null or a loading state until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null; // Or a simple loading placeholder
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 dark:bg-slate-800 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md dark:border-gray-700 dark:hover:shadow-gray-800"
          >
            <h2 className="text-3xl dark:text-white">+</h2>
            <h2 className="dark:text-gray-300">Create New Budget</h2>
          </div>
        </DialogTrigger>

        <DialogContent className="dark:bg-gray-900 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Create New Budget</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg dark:border-gray-700 dark:text-white"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon || "Select Emoji"}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute z-50 bg-white dark:bg-gray-800 shadow-md p-2 rounded-md">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} theme="auto" />
                  </div>
                )}

                <div className="mt-2">
                  <h2 className="text-black dark:text-white font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Shopping"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="mt-2">
                  <h2 className="text-black dark:text-white font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 6000"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="mt-2">
                  <h2 className="text-black dark:text-white font-medium my-1">Receipt Scan (Optional)</h2>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <Button
                    className="mt-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    onClick={handleReceiptScan}
                    disabled={scanning || !receiptFile}
                  >
                    {scanning ? "Scanning..." : "Scan Receipt"}
                  </Button>
                  {scannedData && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h3 className="font-medium dark:text-white">Scanned Receipt Text:</h3>
                      <p className="dark:text-gray-300">{scannedData}</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={onCreateBudget}
                className="mt-5 w-full"
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;