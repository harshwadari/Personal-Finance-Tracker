"use client"
import { Button } from '@/components/ui/button';
import { PenBox } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbconfig';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function EditBudget({ budgetInfo, refreshData }) {
    // State variables
    const [emojiIcon, setEmojiIcon] = useState("");
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    
    const { user } = useUser();

    // Load budget details when dialog opens
    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo.icon || "");
            setName(budgetInfo.name || "");
            setAmount(budgetInfo.amount || "");
        }
    }, [budgetInfo]);
    
    // Emoji selection handler
    const handleEmojiSelect = (emojiData) => {
        setEmojiIcon(emojiData.emoji || emojiData.native);
        setOpenEmojiPicker(false);
    };
    
    const onUpdateBudget = async () => {
        try {
            const result = await db.update(Budgets)
                .set({
                    name: name,
                    amount: parseFloat(amount),
                    icon: emojiIcon,
                })
                .where(eq(Budgets.id, budgetInfo.id))
                .returning();

            if (result) {
                refreshData();
                toast.success('Budget Updated');
            }
        } catch (error) {
            toast.error('Error updating budget');
            console.error("Update Budget Error:", error);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2'><PenBox /> Edit</Button>
                </DialogTrigger>
        
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
        
                        <DialogDescription asChild>
                            <div className="mt-5 relative">
                                <Button
                                    variant="outline"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                                >
                                    {emojiIcon || "Select Emoji"}
                                </Button>
        
                                {openEmojiPicker && (
                                    <div className="absolute z-50 bg-white shadow-md p-2 rounded-md">
                                        <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                    </div>
                                )}
        
                                <div className="mt-2">
                                    <h2 className="text-black font-medium my-1">Budget Name</h2>
                                    <Input
                                        placeholder="e.g. Shopping"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
        
                                <div className="mt-2">
                                    <h2 className="text-black font-medium my-1">Budget Amount</h2>
                                    <Input
                                        type="number"
                                        value={amount}
                                        placeholder="e.g. 6000₹"
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={onUpdateBudget}
                                className="mt-5 w-full"
                            >
                                Update Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EditBudget;
