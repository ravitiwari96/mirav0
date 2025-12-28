import { useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RewardsFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-3 rounded-full shadow-lg hover:bg-accent transition-all duration-300"
      >
        <Gift className="h-5 w-5" />
        <span className="font-medium text-sm tracking-wide">MIRAVO Rewards</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Gift className="h-6 w-6 text-primary" />
              MIRAVO Green Rewards
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your Points</span>
                <span className="text-3xl font-bold text-primary">0</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground">
                Seed Level 🌱 - Start earning points!
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Quick Ways to Earn:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-secondary/50 rounded">
                  <span>🛍️ Shop sustainable products</span>
                  <span className="font-semibold">5 pts/₹100</span>
                </div>
                <div className="flex justify-between p-2 bg-secondary/50 rounded">
                  <span>📱 Follow on Instagram</span>
                  <span className="font-semibold">+50 pts</span>
                </div>
                <div className="flex justify-between p-2 bg-secondary/50 rounded">
                  <span>📝 Leave a review</span>
                  <span className="font-semibold">+100 pts</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setIsOpen(false);
                navigate("/rewards");
              }}
              className="w-full"
            >
              View Full Rewards Program
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RewardsFloatingButton;
