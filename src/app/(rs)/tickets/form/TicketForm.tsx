"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  insertTicketSchema,
  type insertTicketSchemaType,
  type selectTicketSchemaType,
} from "@/zod-schemas/ticket";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";

import { useAction } from "next-safe-action/hooks";
import { saveTicketAction } from "@/app/actions/saveTicketAction";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import Link from "next/link";
import { ArrowLeft, ClipboardList, UserRound } from "lucide-react";

type Props = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
  techs?: { id: string; description: string }[];
  isEditable?: boolean;
  isManager?: boolean | undefined
};

export default function TicketForm({
  customer,
  ticket,
  techs,
  isEditable = true,
  isManager = false,
}: Props) {
  

  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? "(New)",
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    completed: ticket?.completed ?? false,
    tech: ticket?.tech.toLowerCase() ?? "new-ticket@example.com",
  };

  const form = useForm<insertTicketSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveTicketAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success("Success!", {
          description: data?.message,
        });
      }
    },
    onError() {
      toast.error("Error!", {
        description: "An error occurred while saving the customer.",
      });
    },
  });

  async function submitForm(data: insertTicketSchemaType) {
    executeSave(data);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <Link href="/tickets" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to tickets
        </Link>
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary"><ClipboardList className="size-4" /> Repair ticket</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {ticket?.id && isEditable
            ? `Edit Ticket # ${ticket.id}`
            : ticket?.id
            ? `View Ticket # ${ticket.id}`
            : "New Ticket Form"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Record the repair issue, assign a technician, and keep the customer details close at hand.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]"
        >
          <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-1 border-b pb-4"><h2 className="font-semibold">Issue details</h2><p className="mt-1 text-sm text-muted-foreground">Describe the device and what needs attention.</p></div>
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle="Title"
              nameInSchema="title"
              disabled={!isEditable}
            />

            {isManager && techs ? (
              <SelectWithLabel<insertTicketSchemaType>
                fieldTitle="Tech ID"
                nameInSchema="tech"
                data={[
                  {
                    id: "new-ticket@example.com",
                    description: "new-ticket@example.com",
                  },
                  ...techs,
                ]}
              />
            ) : (
              <InputWithLabel<insertTicketSchemaType>
                fieldTitle="Tech"
                nameInSchema="tech"
                disabled={true}
              />
            )}

            {ticket?.id ? (
              <CheckboxWithLabel<insertTicketSchemaType>
                fieldTitle="Completed"
                nameInSchema="completed"
                message="Yes"
                disabled={!isEditable}
              />
            ) : null}

            <div className="rounded-xl bg-muted/60 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold"><UserRound className="size-4 text-primary" /> Customer</h3>
              <p className="mt-3 font-medium">{customer.firstName} {customer.lastName}</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {customer.address1}{customer.address2 ? `, ${customer.address2}` : ""}<br />
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <div className="mt-3 space-y-1 border-t border-border/70 pt-3 text-sm text-muted-foreground">
                <p>{customer.email}</p>
                <p>{customer.phone}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-1 border-b pb-4"><h2 className="font-semibold">Repair notes</h2><p className="mt-1 text-sm text-muted-foreground">Add symptoms, diagnostic notes, and work completed.</p></div>
            <TextAreaWithLabel<insertTicketSchemaType>
              fieldTitle="Description"
              nameInSchema="description"
              className="min-h-64 resize-y"
              disabled={!isEditable}
            />

            {isEditable ? (
              <div className="mt-auto flex flex-col-reverse gap-2 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  className="h-10 flex-1 rounded-xl"
                  variant="default"
                  title="Save"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl"
                  title="Reset"
                  onClick={() => {
                    form.reset(defaultValues);
                    resetSaveAction();
                  }}
                >
                  Reset changes
                </Button>
              </div>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
