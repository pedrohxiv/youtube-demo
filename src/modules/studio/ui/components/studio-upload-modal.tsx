"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem with your request.",
      });
    },
  });

  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? (
        <Loader2Icon className="size-5 animate-spin" />
      ) : (
        <PlusIcon className="size-5" />
      )}
      Create
    </Button>
  );
};
