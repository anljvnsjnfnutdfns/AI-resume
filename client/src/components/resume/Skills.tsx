import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface SkillsProps {
  data: string[];
  onUpdate: (data: string[]) => void;
}

export default function Skills({ data, onUpdate }: SkillsProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onUpdate([...data, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdate(data.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter a skill..."
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="p-2 text-sm flex items-center gap-2"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No skills added yet. Add your key professional skills above.
        </p>
      )}
    </div>
  );
}
