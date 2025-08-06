"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Edit, Trash2, Paperclip } from "lucide-react";
import { useCommentsBySalesOrder, useCreateSalesOrderComment, useUpdateSalesOrderComment, useDeleteSalesOrderComment } from "@/hooks/sales-order/use-sales-order-comments";
import type { SalesOrderComment, CreateSalesOrderCommentData } from "@/types/sales-order-extended";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

interface SalesOrderCommentsProps {
  salesOrderId: number;
}

export function SalesOrderComments({ salesOrderId }: SalesOrderCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<SalesOrderComment | null>(null);
  const [editText, setEditText] = useState("");
  
  const { data: comments = [], isLoading, refetch } = useCommentsBySalesOrder(salesOrderId);
  const createCommentMutation = useCreateSalesOrderComment();
  const updateCommentMutation = useUpdateSalesOrderComment();
  const deleteCommentMutation = useDeleteSalesOrderComment();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData: CreateSalesOrderCommentData = {
      salesOrderId,
      comments: newComment.trim(),
    };

    try {
      await createCommentMutation.mutateAsync({ salesOrderId, data: commentData });
      setNewComment("");
      refetch();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editText.trim()) return;

    const commentData: CreateSalesOrderCommentData = {
      salesOrderId,
      comments: editText.trim(),
    };

    try {
      await updateCommentMutation.mutateAsync({ 
        salesOrderId, 
        commentId: editingComment.id, 
        data: commentData 
      });
      setEditingComment(null);
      setEditText("");
      refetch();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ salesOrderId, commentId });
      refetch();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const startEditing = (comment: SalesOrderComment) => {
    setEditingComment(comment);
    setEditText(comment.comments);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (

    <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center gap-2">
       <div className="flex justify-between items-center gap-2">
       <Paperclip className="h-5 w-5" />
       Comments
       </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
    <div className="space-y-4">
      {/* Add New Comment */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
          disabled={createCommentMutation.isPending}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || createCommentMutation.isPending}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="border rounded-md p-4">
        {comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Add the first comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment: SalesOrderComment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                {editingComment?.id === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleEditComment}
                        disabled={updateCommentMutation.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.createdByName || "Unknown User"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(comment.createdAt), "MMM dd, yyyy HH:mm")}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(comment)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteCommentMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{comment.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
    </CardContent>
  </Card>
  
  
  );
} 