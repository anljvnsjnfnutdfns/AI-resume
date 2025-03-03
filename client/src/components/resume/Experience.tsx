import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Plus, Trash2, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ExperienceEntry = {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
};

interface ExperienceProps {
  data: ExperienceEntry[];
  onUpdate: (data: ExperienceEntry[]) => void;
}

export default function Experience({ data, onUpdate }: ExperienceProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ExperienceEntry>({
    resolver: zodResolver(experienceSchema),
    defaultValues: editIndex !== null ? data[editIndex] : {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: [""],
    },
  });

  const improveDescription = useMutation({
    mutationFn: async (description: string[]) => {
      const res = await apiRequest("POST", "/api/improve/experience", { description });
      return res.json();
    },
    onSuccess: (data) => {
      form.setValue("description", data.improved);
      toast({
        title: "Description improved!",
        description: "AI has enhanced your experience descriptions.",
      });
    },
  });

  const onSubmit = (values: ExperienceEntry) => {
    const newData = [...data];
    if (editIndex !== null) {
      newData[editIndex] = values;
    } else {
      newData.push(values);
    }
    onUpdate(newData);
    setEditIndex(null);
    form.reset();
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    form.reset(data[index]);
  };

  const addDescriptionPoint = () => {
    const current = form.getValues("description");
    form.setValue("description", [...current, ""]);
  };

  const removeDescriptionPoint = (index: number) => {
    const current = form.getValues("description");
    form.setValue(
      "description",
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.map((entry, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{entry.position}</h3>
                  <p className="text-sm text-muted-foreground">
                    {entry.company} - {entry.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.startDate} - {entry.endDate}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {entry.description.map((point, i) => (
                      <li key={i} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Description Points</FormLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const description = form.getValues("description");
                    improveDescription.mutate(description);
                  }}
                  disabled={improveDescription.isPending}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Improve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDescriptionPoint}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Point
                </Button>
              </div>
            </div>

            {form.watch("description").map((_, index) => (
              <div key={index} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`description.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Describe your achievements and responsibilities..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDescriptionPoint(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit">
            {editIndex !== null ? (
              "Update Experience"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
