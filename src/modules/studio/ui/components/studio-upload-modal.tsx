"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const StudioUploadModal = () => {
  return (
    <Button variant="secondary">
      <PlusIcon className="size-5" />
      Create
    </Button>
  );
};
