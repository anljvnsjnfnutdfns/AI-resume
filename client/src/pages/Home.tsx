import { Card, CardContent } from "@/components/ui/card";
import ResumeForm from "@/components/resume/ResumeForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-primary/10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary">AI Resume Builder</h1>
          <p className="text-gray-600 mt-2">
            Create a professional resume with AI-powered suggestions
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardContent className="p-6">
            <ResumeForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}