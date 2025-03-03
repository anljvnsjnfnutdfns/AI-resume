import { Card, CardContent } from "@/components/ui/card";
import ResumeForm from "@/components/resume/ResumeForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">AI Resume Builder</h1>
          <p className="text-primary-foreground mt-2">
            Create a professional resume with AI-powered suggestions
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <ResumeForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
