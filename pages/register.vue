<script setup lang="ts">
import { object, string, type InferType, ref as yupRef } from "yup";
import type { FormSubmitEvent } from "#ui/types";
const toast = useToast();
const loading = ref(false);
const client = useSanctumClient();

const schema = object({
  name: string().required("Required"),
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(6, "Must be at least 6 characters")
    .required("Required"),
  password_confirmation: string()
    .min(6, "Must be at least 6 characters")
    .oneOf([yupRef("password")], "Your passwords do not match.")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const formRef = ref();

const form = reactive({
  email: "",
  name: "",
  password: "",
  password_confirmation: "",
});

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  formRef.value.clear();
  loading.value = true;
  const { data, error, refresh } = await useAsyncData("register", () =>
    client("/api/register", {
      method: "POST",
      body: event.data,
    })
  );

  if (error?.value?.data?.errors) {
    const errors = Object.entries(error.value?.data?.errors);
    const errorMessages = errors.map((err: any) => ({
      message: err[1].join(", "),
      path: err[0],
    }));
    formRef.value.setErrors(errorMessages);
  } else {
    form.email = "";
    form.name = "";
    form.password = "";
    form.password_confirmation = "";
    toast.add({
      title: "Success",
      description: "You have successfully registered. Please login.",
    });
  }
  loading.value = false;
};
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div class="w-96">
      <UForm
        ref="formRef"
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="handleSubmit"
        ><UFormGroup class="mb-3" label="Name" name="name">
          <template #label>Name</template>
          <template #default>
            <UInput v-model="form.name" placeholder="Name" />
          </template>
        </UFormGroup>
        <UFormGroup class="mb-3" label="Email" name="email">
          <template #label>Email</template>
          <template #default>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Email Address"
            />
          </template>
        </UFormGroup>
        <UFormGroup class="mb-3" label="Password" name="password">
          <template #label>Password</template>
          <template #default>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Password"
            />
          </template>
        </UFormGroup>
        <UFormGroup
          class="mb-3"
          label="Confirm Password"
          name="password_confirmation"
        >
          <template #label>Confrirm Password</template>
          <template #default>
            <UInput
              v-model="form.password_confirmation"
              type="password"
              placeholder="Confirm Password"
            />
          </template>
        </UFormGroup>

        <UButton block class="mb-3" type="submit" :disabled="loading">{{
          loading ? "Loading..." : "Register"
        }}</UButton>
        <UButton to="/login" block color="white" variant="solid"
          >Already have an account?</UButton
        >
      </UForm>
    </div>
  </div>
</template>

<style scoped></style>
