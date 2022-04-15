<script setup>

</script>

<template>
  <div class="w-screen flex h-[70px] items-center bg-white shadow-lg inset-x-0 top-0 fixed justify-center z-40">
    <div class="flex container w-[100%]">
      <div class="flex items-center w-[87%]">
        <div>
          <h1 class="text-primary">
            Firebase Auth Example
          </h1>
        </div>
      </div>
      <div class="md:flex items-center w-[13%] sm:hidden justify-center">
        <div>
          <router-link to="/" class="text-primary mr-2">
            Home
          </router-link>
          <router-link to="/login" class="text-primary mr-2">
            Login
          </router-link>
          <router-link to="/register" class="text-primary mr-2">
            Register
          </router-link>
          <router-link to="/testpage" class="text-primary">
            Test
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
