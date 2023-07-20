'use client';
import { useConfig } from '@/app/components/config-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

export function QueryConfigForm() {
  const { model, topK, temperature } = useConfig();
  const { setModel, setTopK, setTemperature } = useConfig();
  const FormSchema = z.object({
    model: z.string({
      required_error: 'A model is required',
    }),
    topK: z
      .number({
        required_error: 'Select how many documents should be added to the context.',
      })
      .max(10, { message: 'TopK value must be less than 10.' }),
    temperature: z.number().min(0).max(1),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { topK, model, temperature },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setModel(data.model);
    setTopK(data.topK);
    setTemperature(data.temperature);
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel>Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text-davinci-003">text-davinci-003</SelectItem>
                    <SelectItem value="text-davinci-002">text-davinci-002</SelectItem>
                    <SelectItem value="text-davinci-001">text-davinci-001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                The model used for answering the question, with augmented context.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topK"
          render={({ field }) => (
            <FormItem>
              <div className="mt-4 flex items-center gap-4">
                <FormLabel className="min-w-fit">top K</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </div>
              <FormDescription>
                The number of document chunks that will be added to the context at query time.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormControl>
                <div className="flex items-center gap-4">
                  <FormLabel className="min-w-fit">Temperature: {field.value}</FormLabel>
                  <Slider
                    defaultValue={[0]}
                    max={1}
                    step={0.1}
                    onValueChange={(e) => field.onChange(e[0])}
                  />
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Controls randomness: lowering results in less random completions. As the temperature
                approaches zero, the model will become deterministic and repetitive.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center justify-center">
          <Button type="submit" className="mt-4">
            Update config
          </Button>
        </div>
      </form>
    </Form>
  );
}
