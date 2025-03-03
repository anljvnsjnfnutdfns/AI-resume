import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import PDFPreview from "./PDFPreview";
import { type InsertResume } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const INITIAL_STATE: InsertResume = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  template: "modern",
};

export default function ResumeForm() {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<InsertResume>(INITIAL_STATE);
  const { toast } = useToast();

  const createResume = useMutation({
    mutationFn: async (data: InsertResume) => {
      const res = await apiRequest("POST", "/api/resumes", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your resume has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    createResume.mutate(formData);
  };

  const updateFormData = (section: keyof InsertResume, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfo
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData("personalInfo", data)}
          />
        </TabsContent>

        <TabsContent value="education">
          <Education
            data={formData.education}
            onUpdate={(data) => updateFormData("education", data)}
          />
        </TabsContent>

        <TabsContent value="experience">
          <Experience
            data={formData.experience}
            onUpdate={(data) => updateFormData("experience", data)}
          />
        </TabsContent>

        <TabsContent value="skills">
          <Skills
            data={formData.skills}
            onUpdate={(data) => updateFormData("skills", data)}
          />
        </TabsContent>

        <TabsContent value="preview">
          <PDFPreview data={formData} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
            if (currentIndex > 0) {
              setActiveTab(tabs[currentIndex - 1].id);
            }
          }}
          disabled={activeTab === "personal"}
        >
          Previous
        </Button>

        {activeTab === "preview" ? (
          <Button onClick={handleSubmit} disabled={createResume.isPending}>
            {createResume.isPending ? "Creating..." : "Create Resume"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].id);
              }
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
