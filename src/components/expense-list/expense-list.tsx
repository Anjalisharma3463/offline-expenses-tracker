import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Edit, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Housing",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Travel",
  "Education",
  "Other",
];

type Expense = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
};

function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange,
}: {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterChange: (value: string) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("table");

const handleFilterChange = (value: string): void => {
    onFilterChange(value === "All Categories" ? "" : value);
};

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-4">
          <Select value={filterCategory || "All Categories"} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2  ">
            <Button
            
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-10 w-10"
            >
              <span className="sr-only">Table view</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-table"
              >
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("cards")}
              className="h-10 w-10"
            >
              <span className="sr-only ">Card view</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-grid"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No expenses found. Add your first expense to get started.</p>
        </div>
      ) : (
        <>
          <div className=" bg-[#030712] p-4 rounded-lg mb-4   ">
            <p className="font-medium ">
              Total: <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Showing {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
            </p>
          </div>
           {viewMode === "table" ? (
            <div className="rounded-md border text-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#030712]">
                    <TableHead className="text-white" >Title</TableHead>
                    <TableHead className="text-white">Category</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-right text-white">Amount</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {expenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <TableCell className="font-medium">{expense.title}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(expense.id)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(expense.id)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the expense.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {expenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className=" bg-[#030712] text-white">
                      <CardContent className="p-4 ">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{expense.title}</p>
                            <p className="text-sm text-muted-foreground">{expense.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${expense.amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(expense.date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(expense.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId(expense.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the expense.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseList;
