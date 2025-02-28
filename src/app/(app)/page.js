import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, UserPlus, Star } from "lucide-react";

const Home=()=> {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        AI-Powered Recruitment Platform
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Submit your application and get instant AI-powered feedback on your profile
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <FileText className="w-12 h-12 mx-auto text-primary" />
                                <h2 className="text-xl font-semibold">Resume Parsing</h2>
                                <p className="text-sm text-muted-foreground">
                                    Intelligent parsing of your resume to extract key information
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <Star className="w-12 h-12 mx-auto text-primary" />
                                <h2 className="text-xl font-semibold">Skill Matching</h2>
                                <p className="text-sm text-muted-foreground">
                                    Advanced matching of your skills with job requirements
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <UserPlus className="w-12 h-12 mx-auto text-primary" />
                                <h2 className="text-xl font-semibold">AI Evaluation</h2>
                                <p className="text-sm text-muted-foreground">
                                    Get instant feedback on your profile and suggestions
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-16 flex justify-center flex-wrap gap-4">
                    <Link href="/submit">
                        <Button size="lg" className="text-lg px-4">
                            Submit Your Application
                        </Button>
                    </Link>
                    <Link href="/jobdescription">
                        <Button size="lg" className="text-lg px-8">
                            Search Candidates
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
