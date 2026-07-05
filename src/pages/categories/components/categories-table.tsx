import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "../hooks/use-categories";
import AppLoading from "@/components/app-loading";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/services/api/category-ep";

const CategoriesTable = () => {
    const { categoriesData, isCategoriesLoading, deleteCategoryMutation } = useCategories();

    if (isCategoriesLoading) return <AppLoading />;

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            deleteCategoryMutation.mutate(id);
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>

                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categoriesData?.data.map((item: Category) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>

                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleteCategoryMutation.isPending}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!categoriesData?.data || categoriesData.data.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default CategoriesTable;
