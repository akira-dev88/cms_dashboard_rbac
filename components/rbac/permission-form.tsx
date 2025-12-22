'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Permission } from '@/types/rbac';

const formSchema = z.object({
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(100, 'Code must be at most 100 characters')
    .regex(/^[a-z_]+$/, 'Code must be lowercase with underscores'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string().optional(),
  module: z.string()
    .min(2, 'Module must be at least 2 characters')
    .max(50, 'Module must be at most 50 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface PermissionFormProps {
  permission?: Permission | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PermissionForm({ permission, onSubmit, onCancel, isSubmitting }: PermissionFormProps) {
  const isEditMode = !!permission;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: permission?.code || '',
      name: permission?.name || '',
      description: permission?.description || '',
      module: permission?.module || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permission Code *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., create_post, delete_user" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier (lowercase with underscores)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Create Post, Delete User" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., content, users, settings" {...field} />
              </FormControl>
              <FormDescription>
                Group permissions by module for better organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what this permission allows..."
                  className="min-h-25"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Permission'
                : 'Create Permission'}
          </Button>
        </div>
      </form>
    </Form>
  );
}