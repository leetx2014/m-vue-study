<template>
  <div>
    <h2>组件通信 demo</h2>
    <!-- props 自定义事件 -->
    <Child1 msg="props: some msg from parent" @some-event="onSomeEvent" />
    <!-- 事件总线 -->
    <Child2 msg="$attrs: some msg from parent" @some-event="onSomeEvent" />
  </div>
</template>

<script>
import Child1 from '@/components/communication/Child1.vue';
import Child2 from '@/components/communication/Child2.vue';

export default {
  provide() {
    return {
      foo: 'foo'
    };
  },
  components: {
    Child1,
    Child2
  },
  methods: {
    onSomeEvent(msg) {
      console.log('Communition: ', msg);
    }
  },
};
</script>

<style scoped>

</style>