import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ZodSchema } from "zod";
import type { Path } from "react-hook-form";

interface AuthFormProps<T extends Record<string, any>> {
  title: string;
  description: string;
  schema: ZodSchema;
  onSubmit: (data: T) => Promise<void>;
  submitText: string;
  fields: Array<{
    name: Path<T>;
    label: string;
    type: string;
    placeholder: string;
  }>;
  footer?: React.ReactNode;
}

export function AuthForm<T extends Record<string, any>>({
  title,
  description,
  schema,
  onSubmit,
  submitText,
  fields,
  footer,
}: AuthFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: T) => {
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      toast.error("Error", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">{title}</CardTitle>
        <CardDescription className="text-center text-blue-100/90">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-white">{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitText}
            </Button>
          </form>
        </Form>
      </CardContent>
      {footer && <CardFooter className="flex justify-center">{footer}</CardFooter>}
    </Card>
  );
}
