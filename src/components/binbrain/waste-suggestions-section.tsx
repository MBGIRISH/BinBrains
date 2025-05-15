"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionWrapper } from './section-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb } from 'lucide-react';
import { runWasteManagementTipsFlow } from '@/ai/flows/waste-management-tips'; // Updated import

const suggestionsSchema = z.object({
  fillStatus: z.coerce.number().min(0, "Must be at least 0%").max(100, "Must be at most 100%"),
  timeSinceLastEmptied: z.string().min(1, "This field is required."),
});

type SuggestionsFormValues = z.infer<typeof suggestionsSchema>;

export function WasteSuggestionsSection() {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SuggestionsFormValues>({
    resolver: zodResolver(suggestionsSchema),
    defaultValues: {
      fillStatus: 50,
      timeSinceLastEmptied: '1 day',
    },
  });

  const onSubmit: SubmitHandler<SuggestionsFormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await runWasteManagementTipsFlow(data); // Use the imported function
      if (result && result.tips) {
        setSuggestions(result.tips);
        toast({
          title: "Suggestions Generated!",
          description: "Waste management tips are ready.",
        });
      } else {
        throw new Error("No tips received from AI.");
      }
    } catch (error) {
      console.error("Error fetching waste management tips:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get suggestions. Please try again.";
      setSuggestions(`Error: ${errorMessage}`);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionWrapper
      id="tips"
      title="Smart Waste Management Tips"
      description="Get AI-powered suggestions for better waste management based on current conditions."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Get Personalized Tips</CardTitle>
            <CardDescription>
              Enter the current status of a waste bin to receive tailored advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fillStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fill Status (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 75" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the current fill level of the dustbin (0-100).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeSinceLastEmptied"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Since Last Emptied</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 days, 5 hours" {...field} />
                      </FormControl>
                      <FormDescription>
                        How long ago was the dustbin last emptied?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                     <Lightbulb className="mr-2 h-4 w-4" />
                      Get Waste Tips
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Generated Tips
            </CardTitle>
            <CardDescription>
              Our AI will provide actionable advice here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {suggestions && !isLoading && (
              <Textarea
                value={suggestions}
                readOnly
                className="min-h-[200px] text-base bg-secondary/30 border-dashed"
                rows={8}
              />
            )}
            {!suggestions && !isLoading && (
              <p className="text-muted-foreground text-center py-10">
                Enter details and click "Get Waste Tips" to see suggestions.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
