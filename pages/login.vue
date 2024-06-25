<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { FetchError } from "ofetch";

const loading = ref(false);
const { login, isAuthenticated } = useSanctumAuth();
const router = useRouter();
console.log(isAuthenticated);
if (isAuthenticated.value) {
  router.push("/");
}

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(6, "Must be at least 6 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const formRef = ref();

const form = reactive({
  email: "",
  password: "",
});

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  formRef.value.clear();
  loading.value = true;
  try {
    await login(event.data);
  } catch (e) {
    if (e instanceof FetchError && e.response?.status === 422) {
      const errors = Object.entries(e.response?._data.errors);
      const errorMessages = errors.map((err: any) => ({
        // Map validation errors to { path: string, message: string }
        message: err[1].join(", "),
        path: err[0],
      }));
      console.log(errorMessages);
      formRef.value.setErrors(errorMessages);
    }
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
      >
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
        <ULink to="/register" class="block text-right mb-3 text-xs"
          >Forgot Password?</ULink
        >

        <UButton block class="mb-3" type="submit" :disabled="loading">{{
          loading ? "Loading..." : "Sign In"
        }}</UButton>
        <UButton to="/register" block color="white" variant="solid"
          >Create an Account</UButton
        >
      </UForm>
    </div>
  </div>
</template>

<style scoped></style>
