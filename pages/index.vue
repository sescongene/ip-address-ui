<script setup lang="ts">
definePageMeta({
  middleware: ["sanctum:auth"],
});

const { logout } = useSanctumAuth();
const router = useRouter();
const handleLogout = async () => {
  await logout();
  router.push("/login");
};

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "ip_address",
    label: "IP Address",
  },
  {
    key: "description",
    label: "description",
  },
  {
    key: "created_at",
    label: "Created At",
  },
  {
    key: "updated_at",
    label: "Updated At",
  },
];
const data = ref([
  {
    id: 1,
    ip_address: "127.0.0.1",
    description: "This is a description",
    created_at: "2021-10-10",
    updated_at: "2021-10-10",
  },
]);
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div class="max-w-screen-md w-full">
      <div class="h-80">
        <UTable :columns="columns" :rows="data" />
      </div>
      <Controls />
      <UButton block variant="solid" class="mt-6" @click="handleLogout()"
        >Logout</UButton
      >
    </div>
  </div>
</template>

<style scoped></style>
