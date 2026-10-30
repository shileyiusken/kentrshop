"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from "@/zod-schemas/customer";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { StatesArray } from "@/constants/StatesArray";
import { useAction } from "next-safe-action/hooks";
import { saveCustomerAction } from "@/app/actions/saveCustomerAction";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ContactRound } from "lucide-react";


type Props = {
  customer?: selectCustomerSchemaType;
  isManager?: boolean | undefined
};

export default function CustomerForm({ customer, isManager = false }: Props) {

  const searchParams = useSearchParams()
  const hasCustomerId = searchParams.has('customerId')

  const emptyValues: insertCustomerSchemaType = {
    id: 0,
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    notes: '',
    active: true,
  }

  const defaultValues: insertCustomerSchemaType = hasCustomerId ? {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    address1: customer?.address1 ?? "",
    address2: customer?.address2 ?? "",
    city: customer?.city ?? "",
    state: customer?.state ?? "",
    zip: customer?.zip ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    notes: customer?.notes ?? "",
    active: customer?.active ?? true,
  } : emptyValues

  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(hasCustomerId ? defaultValues : emptyValues)
  }, [searchParams.get("customerId")]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveCustomerAction, {
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

  async function submitForm(data: insertCustomerSchemaType) {
    executeSave(data);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <Link href="/customers" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to customers
        </Link>
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary"><ContactRound className="size-4" /> Customer record</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {customer?.id ? "Edit" : "New"} Customer{" "}
          {customer?.id ? `#${customer.id}` : "Form"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Keep contact and address information accurate for a smooth repair experience.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="grid gap-5 lg:grid-cols-2"
        >
          <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="border-b pb-4"><h2 className="font-semibold">Contact information</h2><p className="mt-1 text-sm text-muted-foreground">Who should we contact about the repair?</p></div>
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="First Name"
              nameInSchema="firstName"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Last Name"
              nameInSchema="lastName"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Address 1"
              nameInSchema="address1"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Address 2"
              nameInSchema="address2"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="City"
              nameInSchema="city"
            />
            <SelectWithLabel<selectCustomerSchemaType>
              fieldTitle="State"
              nameInSchema="state"
              data={StatesArray}
            />
          </div>
          <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="border-b pb-4"><h2 className="font-semibold">Address and notes</h2><p className="mt-1 text-sm text-muted-foreground">Add a location and any useful customer context.</p></div>
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Zip Code"
              nameInSchema="zip"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Email"
              nameInSchema="email"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Phone"
              nameInSchema="phone"
            />
            <TextAreaWithLabel<insertCustomerSchemaType>
              fieldTitle="Notes"
              nameInSchema="notes"
              className="min-h-32 resize-y"
            />
            {isManager && customer?.id ? (
              <CheckboxWithLabel<insertCustomerSchemaType>
                fieldTitle="Active"
                nameInSchema="active"
                message="Yes"
              />
            ) : null}

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row">
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
          </div>
        </form>
      </Form>
    </div>
  );
}
