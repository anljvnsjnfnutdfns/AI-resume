import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "@shared/schema";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wand2 } from "lucide-react";

type PersonalInfoData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
};

interface PersonalInfoProps {
  data: PersonalInfoData;
  onUpdate: (data: PersonalInfoData) => void;
}

export default function PersonalInfo({ data, onUpdate }: PersonalInfoProps) {
  const { toast } = useToast();
  const form = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  const improveSummary = useMutation({
    mutationFn: async (summary: string) => {
      const res = await apiRequest("POST", "/api/improve/summary", { summary });
      return res.json();
    },
    onSuccess: (data) => {
      form.setValue("summary", data.improved);
      toast({
        title: "Summary improved!",
        description: "AI has enhanced your professional summary.",
      });
    },
  });

  const onSubmit = (values: PersonalInfoData) => {
    onUpdate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
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
                <Input placeholder="New York, NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Summary</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Textarea
                    placeholder="Write a brief summary of your professional background and goals..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => improveSummary.mutate(field.value)}
                  disabled={!field.value || improveSummary.isPending}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save & Continue</Button>
      </form>
    </Form>
  );
}
