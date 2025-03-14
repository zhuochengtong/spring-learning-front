<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 重定向
onBeforeMount(() => {
  const { params } = route
  const { path } = params
  console.log("刷新触发重定向 /path 为/"+ path)
  router.replace({ path: '/' + path })
})
</script>

<template>
  <div></div>
</template>