import { FormSection } from "@/modules/studio/ui/sections/form-section";

interface Props {
  videoId: string;
}

export const VideoView = ({ videoId }: Props) => {
  return (
    <div className="px-4 py-2.5">
      <FormSection videoId={videoId} />
    </div>
  );
};
