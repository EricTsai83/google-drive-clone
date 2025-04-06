import { Card, CardContent } from "@/components/ui/card";

type Props = {
  ownerId: string;
  createdAt: string;
};

export default function ImageDescriptionCard({ ownerId, createdAt }: Props) {
  return (
    <div className="relative flex w-full items-center justify-center">
      <Card className="w-full max-w-md border-white/30 bg-white/60 shadow-xl backdrop-blur-md transition-all">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="font-semibold uppercase tracking-wider text-gray-900/80">
                Uploaded By
              </div>
              <div className="text-lg font-medium text-gray-900/70">
                {ownerId}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold uppercase tracking-wider text-gray-900/80">
                Created On
              </div>
              <div className="text-lg font-medium text-gray-900/70">
                {createdAt}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
