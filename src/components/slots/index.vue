<template>
  <div>
    <h2>插槽</h2>
    <!-- 插槽 -->
    <Layout>
      <!-- 具名插槽 -->
      <template v-slot:header>具名插槽</template>
      <!-- 匿名插槽 -->
      <template>匿名插槽</template>
      <!-- 作用域插槽 -->
      <template v-slot:footer="{fc}">作用域插槽: {{fc}}</template>
    </Layout>
  </div>
</template>

<script>
import Layout from '@/components/slots/Layout.vue';

export default {
  components: {
    Layout,
  },
};
</script>

<style lang="scss" scoped>

</style>